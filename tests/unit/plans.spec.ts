import { describe, it, expect } from 'vitest'
import {
  getPlanConfig,
  getUserEffectivePlan,
  canCreateAlert,
  canUseTwoSeatAlerts,
  maxAlertsForPlan,
} from '../../lib/domain/plans'

describe('plans', () => {
  describe('getPlanConfig', () => {
    it('returns FREE config with maxActiveAlerts 3 and allowTwoSeatAlerts false', () => {
      const config = getPlanConfig('FREE')
      expect(config.code).toBe('FREE')
      expect(config.maxActiveAlerts).toBe(3)
      expect(config.allowTwoSeatAlerts).toBe(false)
    })

    it('returns PRO config with maxActiveAlerts 25 and allowTwoSeatAlerts true', () => {
      const config = getPlanConfig('PRO')
      expect(config.code).toBe('PRO')
      expect(config.maxActiveAlerts).toBe(25)
      expect(config.allowTwoSeatAlerts).toBe(true)
    })
  })

  describe('getUserEffectivePlan', () => {
    it('returns subscription plan when subscription exists', () => {
      expect(
        getUserEffectivePlan(
          { plan: 'FREE' },
          { plan: 'PRO' }
        )
      ).toBe('PRO')
    })

    it('returns profile plan when no subscription', () => {
      expect(
        getUserEffectivePlan(
          { plan: 'PRO' },
          null
        )
      ).toBe('PRO')
    })

    it('returns FREE when profile and subscription are null', () => {
      expect(getUserEffectivePlan(null, null)).toBe('FREE')
    })
  })

  describe('canCreateAlert', () => {
    it('allows create when under FREE limit (3)', () => {
      expect(canCreateAlert('FREE', 0)).toBe(true)
      expect(canCreateAlert('FREE', 2)).toBe(true)
      expect(canCreateAlert('FREE', 3)).toBe(false)
    })

    it('allows create when under PRO limit (25)', () => {
      expect(canCreateAlert('PRO', 24)).toBe(true)
      expect(canCreateAlert('PRO', 25)).toBe(false)
    })
  })

  describe('canUseTwoSeatAlerts', () => {
    it('returns false for FREE', () => {
      expect(canUseTwoSeatAlerts('FREE')).toBe(false)
    })

    it('returns true for PRO', () => {
      expect(canUseTwoSeatAlerts('PRO')).toBe(true)
    })
  })

  describe('maxAlertsForPlan', () => {
    it('returns 3 for FREE', () => {
      expect(maxAlertsForPlan('FREE')).toBe(3)
    })

    it('returns 25 for PRO', () => {
      expect(maxAlertsForPlan('PRO')).toBe(25)
    })
  })
})
