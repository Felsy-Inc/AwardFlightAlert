import { prisma } from '~lib/db/client'
import { matchAlertToObservation } from '~lib/matching/matchAlertToObservation'
import type { Alert, AwardObservation } from '~lib/domain/types'
import { buildAlertNotificationFingerprint, getCooldownMsFromEnv } from '~lib/domain/dedupe'

const NOTIFY_COOLDOWN_MS = getCooldownMsFromEnv(48)

type RunMatchingOptions = {
  providerRunId?: string
}

export const runMatching = async (options?: RunMatchingOptions) => {
  const whereObs = options?.providerRunId
    ? { providerRunId: options.providerRunId }
    : undefined

  const [alerts, observations] = await Promise.all([
    prisma.alert.findMany({ where: { status: 'ACTIVE' } }),
    prisma.awardObservation.findMany({
      where: whereObs,
      orderBy: { observedAt: 'desc' },
      take: 2000,
    }),
  ])

  let considered = 0
  let created = 0
  let deduped = 0
  let suppressedCooldown = 0

  // Preload recent matches for cooldown checks
  const since = new Date(Date.now() - NOTIFY_COOLDOWN_MS)
  const recentMatches = await prisma.alertMatch.findMany({
    where: {
      matchedAt: { gte: since },
    },
    select: {
      alertId: true,
      notificationFingerprint: true,
      matchedAt: true,
    },
  })

  const recentKey = new Set(
    recentMatches.map((m) => `${m.alertId}:${m.notificationFingerprint}`),
  )

  for (const alertRow of alerts) {
    const alert: Alert = {
      id: alertRow.id,
      userId: alertRow.userId,
      originAirport: alertRow.originAirport as any,
      destinationRegion: alertRow.destinationRegion as any,
      startDate: alertRow.startDate.toISOString(),
      endDate: alertRow.endDate.toISOString(),
      program: alertRow.program as any,
      cabin: alertRow.cabin as any,
      seatsNeeded: alertRow.seatsNeeded,
      maxPoints: alertRow.maxPoints ?? null,
      maxTaxes: alertRow.maxTaxes ?? null,
      status: alertRow.status as any,
      createdAt: alertRow.createdAt.toISOString(),
      updatedAt: alertRow.updatedAt.toISOString(),
    }

    for (const obsRow of observations) {
      const observation: AwardObservation = {
        id: obsRow.id,
        sourceProvider: obsRow.sourceProvider,
        sourceRunId: obsRow.providerRunId ?? null,
        program: obsRow.program as any,
        airline: obsRow.airline,
        flightNumber: obsRow.flightNumber,
        originAirport: obsRow.originAirport as any,
        destinationAirport: obsRow.destinationAirport as any,
        destinationRegion: obsRow.destinationRegion as any,
        departureDatetime: obsRow.departureDatetime.toISOString(),
        arrivalDatetime: obsRow.arrivalDatetime.toISOString(),
        departureDate: obsRow.departureDate.toISOString(),
        cabin: obsRow.cabin as any,
        pointsCost: obsRow.pointsCost,
        taxesAmount: obsRow.taxesAmount,
        currency: obsRow.currency,
        seatsAvailable: obsRow.seatsAvailable,
        bookingUrl: obsRow.bookingUrl ?? null,
        bookingHint: obsRow.bookingHint ?? null,
        observedAt: obsRow.observedAt.toISOString(),
        fingerprintHash: obsRow.fingerprintHash,
        createdAt: obsRow.createdAt.toISOString(),
      }

      considered++
      const res = matchAlertToObservation(alert, observation)
      if (!res.matches) continue

      const notificationFingerprint = buildAlertNotificationFingerprint({
        alertId: alert.id,
        observationFingerprint: observation.fingerprintHash,
      })
      const key = `${alert.id}:${notificationFingerprint}`

      // Cooldown suppression (even if we'd otherwise match again)
      if (recentKey.has(key)) {
        suppressedCooldown++
        continue
      }

      try {
        const match = await prisma.alertMatch.create({
          data: {
            alertId: alert.id,
            observationId: observation.id,
            notificationFingerprint,
            notificationStatus: 'PENDING',
          },
        })

        await prisma.notification.create({
          data: {
            userId: alert.userId,
            alertId: alert.id,
            observationId: observation.id,
            type: 'ALERT_MATCH',
            channel: 'EMAIL',
            subject: `Award match: ${alert.originAirport} → ${alert.destinationRegion}`,
            status: 'PENDING',
          },
        })
        created++
        recentKey.add(key)
      } catch (e: any) {
        // Unique constraint hit => dedupe
        deduped++
      }
    }
  }

  return {
    alerts: alerts.length,
    observations: observations.length,
    considered,
    created,
    deduped,
    suppressedCooldown,
  }
}

