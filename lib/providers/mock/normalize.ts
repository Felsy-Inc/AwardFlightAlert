import { buildObservationFingerprint } from '~lib/domain/dedupe'
import type { ProviderObservation } from '../types'
import type { MockRawObservation } from './raw'

const toUtcMidnightDate = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))

export const normalizeMockObservations = (
  raw: MockRawObservation[],
): ProviderObservation[] => {
  return raw.map((r) => ({
    sourceProvider: 'mock',
    program: r.program,
    airline: r.airline,
    flightNumber: r.flightNumber,
    originAirport: r.originAirport,
    destinationAirport: r.destinationAirport,
    destinationRegion: r.destinationRegion,
    departureDatetime: r.departureDatetime,
    arrivalDatetime: r.arrivalDatetime,
    departureDate: toUtcMidnightDate(r.departureDatetime),
    cabin: r.cabin,
    pointsCost: r.pointsCost,
    taxesAmount: r.taxesAmount,
    currency: r.currency,
    seatsAvailable: r.seatsAvailable,
    bookingUrl: r.bookingUrl,
    bookingHint: r.bookingHint,
    observedAt: r.observedAt,
    fingerprintHash: buildObservationFingerprint({
      program: r.program,
      airline: r.airline,
      flightNumber: r.flightNumber,
      originAirport: r.originAirport,
      destinationAirport: r.destinationAirport,
      destinationRegion: r.destinationRegion,
      departureDate: toUtcMidnightDate(r.departureDatetime),
      cabin: r.cabin,
    }),
  }))
}

