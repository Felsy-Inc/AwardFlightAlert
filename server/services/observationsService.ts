import { getFeatureFlags } from '~lib/config/featureFlags'
import { requireUser } from '~lib/auth/guard'
import { prisma } from '~lib/db/client'
import type { H3Event } from 'h3'

export type ObservationsQuery = {
  originAirport?: string
  destinationRegion?: string
  program?: string
  cabin?: string
  seatsMin?: number
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

export type ObservationDto = {
  id: string
  sourceProvider: string
  program: string
  airline: string
  flightNumber: string
  originAirport: string
  destinationAirport: string
  destinationRegion: string
  departureDatetime: string
  arrivalDatetime: string
  departureDate: string
  cabin: string
  pointsCost: number
  taxesAmount: number
  currency: string
  seatsAvailable: number
  bookingUrl: string | null
  bookingHint: string | null
  observedAt: string
  fingerprintHash: string
}

export const listObservations = async (event: H3Event, query: ObservationsQuery) => {
  const flags = getFeatureFlags()
  if (!flags.publicBrowseEnabled) {
    await requireUser(event)
  }

  const limit = Math.min(200, Math.max(1, query.limit ?? 50))
  const offset = Math.max(0, query.offset ?? 0)

  const where: any = {}
  if (query.originAirport) where.originAirport = query.originAirport
  if (query.destinationRegion) where.destinationRegion = query.destinationRegion
  if (query.program) where.program = query.program
  if (query.cabin) where.cabin = query.cabin
  if (query.seatsMin != null) where.seatsAvailable = { gte: query.seatsMin }

  if (query.dateFrom || query.dateTo) {
    where.departureDate = {}
    if (query.dateFrom) where.departureDate.gte = new Date(query.dateFrom)
    if (query.dateTo) where.departureDate.lte = new Date(query.dateTo)
  }

  const [rows, total] = await Promise.all([
    prisma.awardObservation.findMany({
      where,
      orderBy: [{ observedAt: 'desc' }],
      take: limit,
      skip: offset,
    }),
    prisma.awardObservation.count({ where }),
  ])

  const observations: ObservationDto[] = rows.map((o) => ({
    id: o.id,
    sourceProvider: o.sourceProvider,
    program: o.program,
    airline: o.airline,
    flightNumber: o.flightNumber,
    originAirport: o.originAirport,
    destinationAirport: o.destinationAirport,
    destinationRegion: o.destinationRegion,
    departureDatetime: o.departureDatetime.toISOString(),
    arrivalDatetime: o.arrivalDatetime.toISOString(),
    departureDate: o.departureDate.toISOString(),
    cabin: o.cabin,
    pointsCost: o.pointsCost,
    taxesAmount: o.taxesAmount,
    currency: o.currency,
    seatsAvailable: o.seatsAvailable,
    bookingUrl: o.bookingUrl ?? null,
    bookingHint: o.bookingHint ?? null,
    observedAt: o.observedAt.toISOString(),
    fingerprintHash: o.fingerprintHash,
  }))

  return {
    observations,
    total,
    page: { limit, offset },
  }
}

