import type { PlanCode, PlanConfig } from '../constants/plans'
import { PLAN_CONFIG } from '../constants/plans'

type ProfileLike = {
  plan: PlanCode
}

type SubscriptionLike = {
  plan: PlanCode
} | null

export const getUserEffectivePlan = (profile: ProfileLike | null, subscription: SubscriptionLike): PlanCode => {
  if (subscription) {
    return subscription.plan
  }

  if (profile) {
    return profile.plan
  }

  return 'FREE'
}

export const getPlanConfig = (plan: PlanCode): PlanConfig => {
  return PLAN_CONFIG[plan]
}

export const canCreateAlert = (plan: PlanCode, currentActiveAlertsCount: number): boolean => {
  const config = getPlanConfig(plan)
  return currentActiveAlertsCount < config.maxActiveAlerts
}

export const canUseTwoSeatAlerts = (plan: PlanCode): boolean => {
  const config = getPlanConfig(plan)
  return config.allowTwoSeatAlerts
}

export const maxAlertsForPlan = (plan: PlanCode): number => {
  return getPlanConfig(plan).maxActiveAlerts
}

