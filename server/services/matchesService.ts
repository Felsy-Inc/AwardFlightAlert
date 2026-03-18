import { requireUser } from '~lib/auth/guard'
import { prisma } from '~lib/db/client'
import type { H3Event } from 'h3'

export type RecentMatchDto = {
  id: string
  matchedAt: string
  alert: {
    id: string
    originAirport: string
    destinationRegion: string
    program: string
    seatsNeeded: number
  }
  observation: {
    id: string
    program: string
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
}

export const listRecentMatchesForCurrentUser = async (
  event: H3Event,
  limit = 20,
) => {
  const user = await requireUser(event)

  const rows = await prisma.alertMatch.findMany({
    where: {
      alert: { userId: user.id },
    },
    orderBy: { matchedAt: 'desc' },
    take: limit,
    include: {
      alert: true,
      observation: true,
    },
  })

  const matches: RecentMatchDto[] = rows.map((m) => ({
    id: m.id,
    matchedAt: m.matchedAt.toISOString(),
    alert: {
      id: m.alertId,
      originAirport: m.alert.originAirport,
      destinationRegion: m.alert.destinationRegion,
      program: m.alert.program,
      seatsNeeded: m.alert.seatsNeeded,
    },
    observation: {
      id: m.observationId,
      program: m.observation.program,
      airline: m.observation.airline,
      flightNumber: m.observation.flightNumber,
      originAirport: m.observation.originAirport,
      destinationAirport: m.observation.destinationAirport,
      destinationRegion: m.observation.destinationRegion,
      departureDatetime: m.observation.departureDatetime.toISOString(),
      pointsCost: m.observation.pointsCost,
      taxesAmount: m.observation.taxesAmount,
      currency: m.observation.currency,
      seatsAvailable: m.observation.seatsAvailable,
    },
  }))

  return { matches }
}

