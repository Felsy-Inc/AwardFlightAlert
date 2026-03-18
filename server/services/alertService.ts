import { alertCreateSchema, alertUpdateSchema, toAlertDto } from '~lib/domain/alerts'
import { canCreateAlert, canUseTwoSeatAlerts, getPlanConfig, getUserEffectivePlan } from '~lib/domain/plans'
import { requireUser } from '~lib/auth/guard'
import { prisma } from '~lib/db/client'
import {
  listAlertsByUserId,
  countActiveAlertsByUserId,
  getAlertByIdForUser,
  createAlertForUser,
  updateAlertForUser,
  deleteAlertForUser,
} from '../repositories/alertRepository'
import type { H3Event } from 'h3'

const getUserPlanContext = async (userId: string) => {
  const [profile, subscription] = await Promise.all([
    prisma.profile.findUnique({ where: { id: userId } }),
    prisma.subscription.findUnique({ where: { userId } }),
  ])

  const planCode = getUserEffectivePlan(
    profile ? { plan: profile.plan as any } : null,
    subscription ? { plan: subscription.plan as any } : null,
  )

  const config = getPlanConfig(planCode)

  return { planCode, config }
}

export const listAlertsForCurrentUser = async (event: H3Event) => {
  const user = await requireUser(event)
  const [alerts, { config }] = await Promise.all([
    listAlertsByUserId(user.id),
    getUserPlanContext(user.id),
  ])

  return {
    alerts: alerts.map(toAlertDto),
    planLimits: {
      maxActiveAlerts: config.maxActiveAlerts,
      allowTwoSeatAlerts: config.allowTwoSeatAlerts,
    },
  }
}

export const createAlertForCurrentUser = async (event: H3Event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const parsed = alertCreateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid alert payload',
      data: parsed.error.flatten(),
    })
  }

  const data = parsed.data
  const { planCode } = await getUserPlanContext(user.id)
  const activeCount = await countActiveAlertsByUserId(user.id)

  if (!canCreateAlert(planCode, activeCount)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Alert limit reached for your plan',
    })
  }

  if (data.seatsNeeded > 1 && !canUseTwoSeatAlerts(planCode)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Two-seat alerts are only available on the Pro plan',
    })
  }

  const alert = await createAlertForUser(user.id, data)
  return toAlertDto(alert)
}

export const getAlertForCurrentUser = async (event: H3Event, id: string) => {
  const user = await requireUser(event)
  const alert = await getAlertByIdForUser(user.id, id)

  if (!alert) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Alert not found',
    })
  }

  return toAlertDto(alert)
}

export const updateAlertForCurrentUser = async (event: H3Event, id: string) => {
  const user = await requireUser(event)
  const existing = await getAlertByIdForUser(user.id, id)

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Alert not found',
    })
  }

  const body = await readBody(event)
  const parsed = alertUpdateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid alert payload',
      data: parsed.error.flatten(),
    })
  }

  const data = parsed.data
  const { planCode } = await getUserPlanContext(user.id)

  const seats = data.seatsNeeded ?? existing.seatsNeeded
  if (seats > 1 && !canUseTwoSeatAlerts(planCode)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Two-seat alerts are only available on the Pro plan',
    })
  }

  const nextStatus = data.status ?? existing.status
  if (nextStatus === 'ACTIVE' && existing.status !== 'ACTIVE') {
    const activeCount = await countActiveAlertsByUserId(user.id)
    if (!canCreateAlert(planCode, activeCount)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Alert limit reached for your plan',
      })
    }
  }

  const result = await updateAlertForUser(user.id, id, data)

  if (result.count === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Alert not found',
    })
  }

  const updated = await getAlertByIdForUser(user.id, id)

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Alert not found',
    })
  }

  return toAlertDto(updated)
}

export const deleteAlertForCurrentUser = async (event: H3Event, id: string) => {
  const user = await requireUser(event)
  const result = await deleteAlertForUser(user.id, id)

  if (result.count === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Alert not found',
    })
  }

  return { success: true }
}

