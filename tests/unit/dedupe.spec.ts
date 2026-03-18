import { describe, it, expect } from 'vitest'
import { buildObservationFingerprint, buildAlertNotificationFingerprint } from '../../lib/domain/dedupe'

describe('dedupe', () => {
  it('buildObservationFingerprint is stable for same inputs', () => {
    const a = buildObservationFingerprint({
      program: 'FLYING_BLUE',
      airline: 'KL',
      flightNumber: 'KL123',
      originAirport: 'AMS',
      destinationAirport: 'HND',
      destinationRegion: 'JAPAN',
      departureDate: new Date('2026-01-15T12:00:00.000Z'),
      cabin: 'BUSINESS',
    })

    const b = buildObservationFingerprint({
      program: 'FLYING_BLUE',
      airline: 'KL',
      flightNumber: 'KL123',
      originAirport: 'AMS',
      destinationAirport: 'HND',
      destinationRegion: 'JAPAN',
      departureDate: new Date('2026-01-15T00:00:00.000Z'),
      cabin: 'BUSINESS',
    })

    expect(a).toBe(b)
  })

  it('buildAlertNotificationFingerprint is scoped by unique index (alertId + fingerprint)', () => {
    const fp = 'abc123'
    expect(
      buildAlertNotificationFingerprint({ alertId: 'a1', observationFingerprint: fp }),
    ).toBe(fp)
  })
})

