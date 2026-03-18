import { z } from 'zod'

// Basic enums aligned with Prisma schema
export const AirportCodeSchema = z.enum([
  'AMS',
  'BRU',
  'CDG',
  'FRA',
  'LHR',
  'LGW',
  'MAD',
  'BCN',
  'FCO',
  'LIS',
  'ATH',
  'VIE',
  'JFK',
  'EWR',
  'BOS',
  'IAD',
  'MIA',
  'LAX',
  'SFO',
  'HND',
  'NRT',
])

export const DestinationRegionSchema = z.enum([
  'JAPAN',
  'US_EAST',
  'US_WEST',
  'EUROPE',
])

export const ProgramSchema = z.enum(['FLYING_BLUE', 'MILES_AND_MORE', 'AVIOS'])

export const CabinSchema = z.enum([
  'BUSINESS',
  'PREMIUM_ECONOMY',
  'ECONOMY',
  'FIRST',
])

export const AlertStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'CANCELLED'])

// Core create/update payloads
export const AlertBaseInputSchema = z.object({
  originAirport: AirportCodeSchema,
  destinationRegion: DestinationRegionSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  program: ProgramSchema,
  cabin: CabinSchema.default('BUSINESS'),
  seatsNeeded: z
    .number()
    .int()
    .min(1)
    .max(2),
  maxPoints: z.number().int().positive().nullable().optional(),
  maxTaxes: z.number().int().nonnegative().nullable().optional(),
  status: AlertStatusSchema.default('ACTIVE'),
}).refine((val) => val.endDate >= val.startDate, {
  path: ['endDate'],
  message: 'End date must be on or after start date',
})

export const AlertCreateInputSchema = AlertBaseInputSchema

export const AlertUpdateInputSchema = AlertBaseInputSchema.partial()

// Response / DB-shaped schema
export const AlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  originAirport: AirportCodeSchema,
  destinationRegion: DestinationRegionSchema,
  startDate: z.date(),
  endDate: z.date(),
  program: ProgramSchema,
  cabin: CabinSchema,
  seatsNeeded: z.number().int(),
  maxPoints: z.number().int().nullish(),
  maxTaxes: z.number().int().nullish(),
  status: AlertStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type AirportCode = z.infer<typeof AirportCodeSchema>
export type DestinationRegion = z.infer<typeof DestinationRegionSchema>
export type Program = z.infer<typeof ProgramSchema>
export type Cabin = z.infer<typeof CabinSchema>
export type AlertStatus = z.infer<typeof AlertStatusSchema>
export type AlertCreateInput = z.infer<typeof AlertCreateInputSchema>
export type AlertUpdateInput = z.infer<typeof AlertUpdateInputSchema>
export type Alert = z.infer<typeof AlertSchema>

