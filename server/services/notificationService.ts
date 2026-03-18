import { Resend } from 'resend'
import { prisma } from '~lib/db/client'
import { getFeatureFlags } from '~lib/config/featureFlags'

const buildAlertMatchEmail = (input: {
  to: string
  appUrl: string
  subject: string
  alert: {
    originAirport: string
    destinationRegion: string
    program: string
    seatsNeeded: number
  }
  observation: {
    airline: string
    flightNumber: string
    originAirport: string
    destinationAirport: string
    destinationRegion: string
    departureDatetime: string
    pointsCost: number
    taxesAmount: number
    currency: string
    seatsAvailable: number
  }
}) => {
  const { to, appUrl, subject, alert, observation } = input

  const text = [
    subject,
    '',
    `Route: ${observation.originAirport} → ${observation.destinationAirport} (${observation.destinationRegion})`,
    `Flight: ${observation.airline}${observation.flightNumber.replace(observation.airline, '')}`,
    `Departure: ${new Date(observation.departureDatetime).toLocaleString()}`,
    `Cost: ${observation.pointsCost.toLocaleString()} points + ${observation.taxesAmount} ${observation.currency}`,
    `Seats available: ${observation.seatsAvailable} (alert needs ${alert.seatsNeeded})`,
    `Program: ${alert.program}`,
    '',
    `Dashboard: ${appUrl}/dashboard`,
  ].join('\n')

  const html = `
  <div style="font-family: ui-sans-serif, system-ui; line-height: 1.45;">
    <h2 style="margin: 0 0 8px;">${escapeHtml(subject)}</h2>
    <p style="margin: 0 0 12px; color: #334155;">
      We found award availability that matches your alert.
    </p>
    <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
      ${row('Route', `${escapeHtml(observation.originAirport)} → ${escapeHtml(observation.destinationAirport)} (${escapeHtml(observation.destinationRegion)})`)}
      ${row('Flight', `${escapeHtml(observation.airline)}${escapeHtml(observation.flightNumber.replace(observation.airline, ''))}`)}
      ${row('Departure', escapeHtml(new Date(observation.departureDatetime).toLocaleString()))}
      ${row('Cost', `${escapeHtml(observation.pointsCost.toLocaleString())} points + ${escapeHtml(String(observation.taxesAmount))} ${escapeHtml(observation.currency)}`)}
      ${row('Seats', `${escapeHtml(String(observation.seatsAvailable))} available (you need ${escapeHtml(String(alert.seatsNeeded))})`)}
      ${row('Program', escapeHtml(alert.program))}
    </table>
    <p style="margin: 16px 0 0;">
      <a href="${appUrl}/dashboard" style="color: #0284c7; font-weight: 600;">Open dashboard</a>
    </p>
    <p style="margin: 12px 0 0; font-size: 12px; color: #64748b;">
      AwardFlightNotice MVP • mock data provider
    </p>
  </div>
  `

  return { to, subject, text, html }
}

const row = (label: string, value: string) =>
  `<tr><td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 13px; color:#475569; width: 140px;"><strong>${escapeHtml(label)}</strong></td><td style="padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 13px; color:#0f172a;">${value}</td></tr>`

const escapeHtml = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

export const sendPendingNotifications = async (opts?: { limit?: number }) => {
  const flags = getFeatureFlags()
  const limit = Math.min(50, Math.max(1, opts?.limit ?? 10))

  const pending = await prisma.notification.findMany({
    where: { status: 'PENDING', channel: 'EMAIL', type: 'ALERT_MATCH' },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  if (!flags.emailsEnabled) {
    if (pending.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: pending.map((n) => n.id) } },
        data: { status: 'SUPPRESSED' },
      })

      // Best-effort: mark related matches as suppressed too (pairwise, no cross-product).
      const pairs = pending
        .map((n) => ({ alertId: n.alertId, observationId: n.observationId }))
        .filter((p): p is { alertId: string; observationId: string } => !!p.alertId && !!p.observationId)

      const uniqueKey = new Set<string>()
      const uniquePairs = pairs.filter((p) => {
        const k = `${p.alertId}:${p.observationId}`
        if (uniqueKey.has(k)) return false
        uniqueKey.add(k)
        return true
      })

      if (uniquePairs.length > 0) {
        await prisma.alertMatch.updateMany({
          where: {
            OR: uniquePairs,
          },
          data: { notificationStatus: 'SUPPRESSED' },
        })
      }
    }

    return {
      emailsEnabled: false,
      processed: pending.length,
      sent: 0,
      failed: 0,
      suppressed: pending.length,
    }
  }

  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey as string | undefined
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'RESEND_API_KEY is missing',
    })
  }

  const resend = new Resend(apiKey)
  const appUrl =
    (config.public?.appUrl as string | undefined) ??
    process.env.NUXT_PUBLIC_APP_URL ??
    'http://localhost:3000'

  let sent = 0
  let failed = 0

  for (const n of pending) {
    try {
      const [profile, alert, observation] = await Promise.all([
        prisma.profile.findUnique({ where: { id: n.userId } }),
        n.alertId ? prisma.alert.findUnique({ where: { id: n.alertId } }) : null,
        n.observationId ? prisma.awardObservation.findUnique({ where: { id: n.observationId } }) : null,
      ])

      const to = profile?.email
      if (!to || !alert || !observation) {
        await prisma.notification.update({
          where: { id: n.id },
          data: { status: 'FAILED' },
        })
        failed++
        continue
      }

      const email = buildAlertMatchEmail({
        to,
        appUrl,
        subject: n.subject,
        alert: {
          originAirport: alert.originAirport,
          destinationRegion: alert.destinationRegion,
          program: alert.program,
          seatsNeeded: alert.seatsNeeded,
        },
        observation: {
          airline: observation.airline,
          flightNumber: observation.flightNumber,
          originAirport: observation.originAirport,
          destinationAirport: observation.destinationAirport,
          destinationRegion: observation.destinationRegion,
          departureDatetime: observation.departureDatetime.toISOString(),
          pointsCost: observation.pointsCost,
          taxesAmount: observation.taxesAmount,
          currency: observation.currency,
          seatsAvailable: observation.seatsAvailable,
        },
      })

      const from = (config.public?.emailFrom as string | undefined) ?? process.env.EMAIL_FROM
      if (!from) {
        throw new Error('EMAIL_FROM is missing (set a from address)')
      }

      const result = await resend.emails.send({
        from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })

      await prisma.notification.update({
        where: { id: n.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          providerMessageId: (result as any)?.data?.id ?? null,
        },
      })

      if (n.alertId && n.observationId) {
        await prisma.alertMatch.updateMany({
          where: {
            alertId: n.alertId,
            observationId: n.observationId,
            notificationFingerprint: { not: '' },
          },
          data: {
            notificationStatus: 'SENT',
            lastNotifiedAt: new Date(),
          },
        })
      }

      sent++
    } catch (e) {
      await prisma.notification.update({
        where: { id: n.id },
        data: { status: 'FAILED' },
      })
      failed++
    }
  }

  return {
    emailsEnabled: true,
    processed: pending.length,
    sent,
    failed,
    suppressed: 0,
  }
}

export const enqueueNotificationsFromRecentMatches = async (opts?: { limit?: number }) => {
  const limit = Math.min(200, Math.max(1, opts?.limit ?? 50))

  const matches = await prisma.alertMatch.findMany({
    where: {
      notificationStatus: { in: ['NONE', 'PENDING'] },
      alert: { status: 'ACTIVE' },
    },
    orderBy: { matchedAt: 'desc' },
    take: limit,
    include: {
      alert: true,
    },
  })

  let enqueued = 0
  let skipped = 0

  for (const m of matches) {
    const exists = await prisma.notification.findFirst({
      where: {
        type: 'ALERT_MATCH',
        channel: 'EMAIL',
        status: 'PENDING',
        alertId: m.alertId,
        observationId: m.observationId,
        userId: m.alert.userId,
      },
      select: { id: true },
    })

    if (exists) {
      skipped++
      continue
    }

    await prisma.notification.create({
      data: {
        userId: m.alert.userId,
        alertId: m.alertId,
        observationId: m.observationId,
        type: 'ALERT_MATCH',
        channel: 'EMAIL',
        subject: `Award match: ${m.alert.originAirport} → ${m.alert.destinationRegion}`,
        status: 'PENDING',
      },
    })

    await prisma.alertMatch.update({
      where: { id: m.id },
      data: { notificationStatus: 'PENDING' },
    })

    enqueued++
  }

  return { considered: matches.length, enqueued, skipped }
}

