import { describe, it, expect } from 'vitest'
import { alertCreateSchema, alertUpdateSchema } from '../../lib/domain/alerts'

describe('alerts schemas', () => {
  it('accepts a minimal valid create payload', () => {
    const payload = {
      originAirport: 'AMS',
      destinationRegion: 'JAPAN',
      startDate: new Date('2026-01-10T00:00:00.000Z').toISOString(),
      endDate: new Date('2026-01-20T00:00:00.000Z').toISOString(),
      program: 'FLYING_BLUE',
      cabin: 'BUSINESS',
      seatsNeeded: 1,
      maxPoints: null,
      maxTaxes: null,
    }

    const parsed = alertCreateSchema.safeParse(payload)
    expect(parsed.success).toBe(true)
  })

  it('rejects create payload when endDate is before startDate', () => {
    const payload = {
      originAirport: 'AMS',
      destinationRegion: 'JAPAN',
      startDate: new Date('2026-02-10T00:00:00.000Z').toISOString(),
      endDate: new Date('2026-02-01T00:00:00.000Z').toISOString(),
      program: 'FLYING_BLUE',
      cabin: 'BUSINESS',
      seatsNeeded: 1,
      maxPoints: null,
      maxTaxes: null,
    }

    const parsed = alertCreateSchema.safeParse(payload)
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.endDate?.[0]).toContain('End date')
    }
  })

  it('allows maxTaxes to be 0', () => {
    const payload = {
      originAirport: 'AMS',
      destinationRegion: 'US_EAST',
      startDate: new Date('2026-03-10T00:00:00.000Z').toISOString(),
      endDate: new Date('2026-03-15T00:00:00.000Z').toISOString(),
      program: 'AVIOS',
      cabin: 'BUSINESS',
      seatsNeeded: 1,
      maxPoints: 50000,
      maxTaxes: 0,
    }

    expect(alertCreateSchema.safeParse(payload).success).toBe(true)
  })

  it('update schema allows partial payload', () => {
    const parsed = alertUpdateSchema.safeParse({
      status: 'PAUSED',
    })

    expect(parsed.success).toBe(true)
  })
})

