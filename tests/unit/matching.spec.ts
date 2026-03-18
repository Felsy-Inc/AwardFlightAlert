import { describe, it, expect } from 'vitest'
import { matchAlertToObservation } from '../../lib/matching/matchAlertToObservation'

const baseAlert = () => ({
  id: 'a1',
  userId: 'u1',
  originAirport: 'AMS',
  destinationRegion: 'JAPAN',
  startDate: '2026-01-10T00:00:00.000Z',
  endDate: '2026-01-20T00:00:00.000Z',
  program: 'FLYING_BLUE',
  cabin: 'BUSINESS',
  seatsNeeded: 1,
  maxPoints: null,
  maxTaxes: null,
  status: 'ACTIVE' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

const baseObs = () => ({
  id: 'o1',
  sourceProvider: 'mock',
  sourceRunId: null,
  program: 'FLYING_BLUE',
  airline: 'KL',
  flightNumber: 'KL123',
  originAirport: 'AMS',
  destinationAirport: 'HND',
  destinationRegion: 'JAPAN',
  departureDatetime: '2026-01-15T12:00:00.000Z',
  arrivalDatetime: '2026-01-15T23:00:00.000Z',
  departureDate: '2026-01-15T00:00:00.000Z',
  cabin: 'BUSINESS',
  pointsCost: 70000,
  taxesAmount: 250,
  currency: 'EUR',
  seatsAvailable: 2,
  bookingUrl: null,
  bookingHint: null,
  observedAt: '2026-01-02T00:00:00.000Z',
  fingerprintHash: 'hash',
  createdAt: '2026-01-02T00:00:00.000Z',
})

describe('matchAlertToObservation', () => {
  it('matches when all criteria satisfied', () => {
    const res = matchAlertToObservation(baseAlert() as any, baseObs() as any)
    expect(res.matches).toBe(true)
  })

  it('rejects when outside date window', () => {
    const obs = baseObs()
    obs.departureDate = '2026-02-01T00:00:00.000Z'
    const res = matchAlertToObservation(baseAlert() as any, obs as any)
    expect(res.matches).toBe(false)
    expect(res.reasons).toContain('outside_date_window')
  })

  it('rejects when seats are insufficient', () => {
    const alert = baseAlert()
    alert.seatsNeeded = 2
    const obs = baseObs()
    obs.seatsAvailable = 1
    const res = matchAlertToObservation(alert as any, obs as any)
    expect(res.matches).toBe(false)
    expect(res.reasons).toContain('insufficient_seats')
  })

  it('rejects when caps exceeded', () => {
    const alert = baseAlert()
    alert.maxPoints = 60000
    alert.maxTaxes = 200
    const res = matchAlertToObservation(alert as any, baseObs() as any)
    expect(res.matches).toBe(false)
    expect(res.reasons).toContain('points_over_cap')
    expect(res.reasons).toContain('taxes_over_cap')
  })
})

