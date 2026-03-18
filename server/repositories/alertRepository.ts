import { prisma } from '~lib/db/client'
import type { AlertCreateInput, AlertUpdateInput } from '~lib/domain/alerts'

export const listAlertsByUserId = async (userId: string) => {
  return prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export const countActiveAlertsByUserId = async (userId: string) => {
  return prisma.alert.count({
    where: {
      userId,
      status: 'ACTIVE',
    },
  })
}

export const getAlertByIdForUser = async (userId: string, id: string) => {
  return prisma.alert.findFirst({
    where: {
      id,
      userId,
    },
  })
}

export const createAlertForUser = async (userId: string, data: AlertCreateInput) => {
  return prisma.alert.create({
    data: {
      userId,
      originAirport: data.originAirport,
      destinationRegion: data.destinationRegion,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      program: data.program,
      cabin: data.cabin,
      seatsNeeded: data.seatsNeeded,
      maxPoints: data.maxPoints ?? null,
      maxTaxes: data.maxTaxes ?? null,
    },
  })
}

export const updateAlertForUser = async (userId: string, id: string, data: AlertUpdateInput) => {
  return prisma.alert.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      originAirport: data.originAirport,
      destinationRegion: data.destinationRegion,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      program: data.program,
      cabin: data.cabin,
      seatsNeeded: data.seatsNeeded,
      maxPoints: data.maxPoints ?? undefined,
      maxTaxes: data.maxTaxes ?? undefined,
      status: data.status,
    },
  })
}

export const deleteAlertForUser = async (userId: string, id: string) => {
  return prisma.alert.deleteMany({
    where: {
      id,
      userId,
    },
  })
}

