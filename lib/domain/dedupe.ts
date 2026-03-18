import { createHash } from 'node:crypto'
import type { AirportCode, DestinationRegion } from '~lib/constants/airports'
import type { CabinCode } from '~lib/constants/cabins'
import type { ProgramCode } from '~lib/constants/programs'

export type ObservationFingerprintInput = {
  program: ProgramCode
  airline: string
  flightNumber: string
  originAirport: AirportCode
  destinationAirport: AirportCode
  destinationRegion: DestinationRegion
  departureDate: Date
  cabin: CabinCode
}

const toUtcMidnightIso = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString()

export const buildObservationFingerprint = (o: ObservationFingerprintInput): string => {
  const source = [
    o.program,
    o.airline,
    o.flightNumber,
    o.originAirport,
    o.destinationAirport,
    o.destinationRegion,
    toUtcMidnightIso(o.departureDate),
    o.cabin,
  ].join('|')

  return createHash('sha256').update(source).digest('hex')
}

export const buildAlertNotificationFingerprint = (args: {
  alertId: string
  observationFingerprint: string
}): string => {
  // Prisma uniqueness is scoped as (alertId, notificationFingerprint).
  // Keeping fingerprint stable across alert updates by not embedding alertId.
  return args.observationFingerprint
}

export const getCooldownMsFromEnv = (fallbackHours = 48): number => {
  const raw = process.env.NOTIFICATION_DEDUP_COOLDOWN_HOURS
  const hours = raw ? Number(raw) : NaN
  const normalized = Number.isFinite(hours) && hours > 0 ? hours : fallbackHours
  return normalized * 60 * 60 * 1000
}

