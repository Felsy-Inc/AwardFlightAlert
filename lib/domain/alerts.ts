import { z } from 'zod'
import { ORIGIN_AIRPORTS, DESTINATION_REGIONS } from '../constants/airports'
import { PROGRAMS } from '../constants/programs'
import { CABINS, DEFAULT_CABIN } from '../constants/cabins'
import type { Alert } from './types'

export const alertBaseSchema = z.object({
  originAirport: z.enum(ORIGIN_AIRPORTS),
  destinationRegion: z.enum(DESTINATION_REGIONS),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  program: z.enum(PROGRAMS),
  cabin: z.enum(CABINS).default(DEFAULT_CABIN),
  seatsNeeded: z.number().int().min(1).max(2),
  maxPoints: z.number().int().positive().nullable().optional(),
  maxTaxes: z.number().int().nonnegative().nullable().optional(),
})

export const alertCreateSchema = alertBaseSchema.refine(
  (val) => new Date(val.endDate) >= new Date(val.startDate),
  {
    path: ['endDate'],
    message: 'End date must be on or after start date',
  },
)

export const alertUpdateSchema = alertBaseSchema
  .partial()
  .extend({
    status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
  })
  .refine(
    (val) => {
      if (!val.startDate || !val.endDate) return true
      return new Date(val.endDate) >= new Date(val.startDate)
    },
    {
      path: ['endDate'],
      message: 'End date must be on or after start date',
    },
  )

export type AlertCreateInput = z.infer<typeof alertCreateSchema>
export type AlertUpdateInput = z.infer<typeof alertUpdateSchema>

export const toAlertDto = (alert: any): Alert => ({
  id: alert.id,
  userId: alert.userId,
  originAirport: alert.originAirport,
  destinationRegion: alert.destinationRegion,
  startDate: alert.startDate.toISOString(),
  endDate: alert.endDate.toISOString(),
  program: alert.program,
  cabin: alert.cabin,
  seatsNeeded: alert.seatsNeeded,
  maxPoints: alert.maxPoints ?? null,
  maxTaxes: alert.maxTaxes ?? null,
  status: alert.status,
  createdAt: alert.createdAt.toISOString(),
  updatedAt: alert.updatedAt.toISOString(),
})

