export const PLANS = ['FREE', 'PRO'] as const

export type PlanCode = (typeof PLANS)[number]

export type PlanConfig = {
  code: PlanCode
  name: string
  maxActiveAlerts: number
  allowTwoSeatAlerts: boolean
  browseEnabled: boolean
  emailAlertsEnabled: boolean
}

export const PLAN_CONFIG: Record<PlanCode, PlanConfig> = {
  FREE: {
    code: 'FREE',
    name: 'Free',
    maxActiveAlerts: 3,
    allowTwoSeatAlerts: false,
    browseEnabled: true,
    emailAlertsEnabled: true,
  },
  PRO: {
    code: 'PRO',
    name: 'Pro',
    maxActiveAlerts: 25,
    allowTwoSeatAlerts: true,
    browseEnabled: true,
    emailAlertsEnabled: true,
  },
}

