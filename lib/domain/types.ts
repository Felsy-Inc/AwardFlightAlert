import type { AirportCode, DestinationRegion } from '../constants/airports'
import type { CabinCode } from '../constants/cabins'
import type { PlanCode } from '../constants/plans'
import type { ProgramCode } from '../constants/programs'

export type AlertStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'

export type AwardObservation = {
  id: string
  sourceProvider: string
  sourceRunId: string | null
  program: ProgramCode
  airline: string
  flightNumber: string
  originAirport: AirportCode
  destinationAirport: AirportCode
  destinationRegion: DestinationRegion
  departureDatetime: string
  arrivalDatetime: string
  departureDate: string
  cabin: CabinCode
  pointsCost: number
  taxesAmount: number
  currency: string
  seatsAvailable: number
  bookingUrl: string | null
  bookingHint: string | null
  observedAt: string
  fingerprintHash: string
  createdAt: string
}

export type Alert = {
  id: string
  userId: string
  originAirport: AirportCode
  destinationRegion: DestinationRegion
  startDate: string
  endDate: string
  program: ProgramCode
  cabin: CabinCode
  seatsNeeded: number
  maxPoints: number | null
  maxTaxes: number | null
  status: AlertStatus
  createdAt: string
  updatedAt: string
}

export type Plan = PlanCode

