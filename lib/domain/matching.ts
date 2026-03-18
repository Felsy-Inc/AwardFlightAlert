import type { Alert, AwardObservation } from './types'

export type MatchResult = {
  matches: boolean
  reasons?: string[]
}

const isoDateToUtcMidnight = (iso: string) => {
  const d = new Date(iso)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export const doesObservationMatchAlert = (alert: Alert, observation: AwardObservation): MatchResult => {
  const reasons: string[] = []

  if (alert.status !== 'ACTIVE') reasons.push('alert_not_active')

  if (alert.originAirport !== observation.originAirport) reasons.push('origin_mismatch')
  if (alert.destinationRegion !== observation.destinationRegion) reasons.push('region_mismatch')
  if (alert.program !== observation.program) reasons.push('program_mismatch')
  if (alert.cabin !== observation.cabin) reasons.push('cabin_mismatch')

  if (observation.seatsAvailable < alert.seatsNeeded) reasons.push('insufficient_seats')

  if (alert.maxPoints != null && observation.pointsCost > alert.maxPoints) reasons.push('points_over_cap')
  if (alert.maxTaxes != null && observation.taxesAmount > alert.maxTaxes) reasons.push('taxes_over_cap')

  const depDay = isoDateToUtcMidnight(observation.departureDate)
  const startDay = isoDateToUtcMidnight(alert.startDate)
  const endDay = isoDateToUtcMidnight(alert.endDate)

  if (depDay < startDay || depDay > endDay) reasons.push('outside_date_window')

  return reasons.length === 0 ? { matches: true } : { matches: false, reasons }
}

