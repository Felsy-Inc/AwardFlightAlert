import type { AirportCode, DestinationRegion } from '~lib/constants/airports'
import type { CabinCode } from '~lib/constants/cabins'
import type { ProgramCode } from '~lib/constants/programs'

export type ProviderName = 'mock'

export type ProviderObservation = {
  sourceProvider: ProviderName
  program: ProgramCode
  airline: string
  flightNumber: string
  originAirport: AirportCode
  destinationAirport: AirportCode
  destinationRegion: DestinationRegion
  departureDatetime: Date
  arrivalDatetime: Date
  departureDate: Date
  cabin: CabinCode
  pointsCost: number
  taxesAmount: number
  currency: string
  seatsAvailable: number
  bookingUrl: string | null
  bookingHint: string | null
  observedAt: Date
  fingerprintHash: string
}

export type ProviderNormalizedIngestResult = {
  providerName: ProviderName
  observations: ProviderObservation[]
  metadata?: Record<string, unknown>
}

export type ProviderRawIngestResult<TRawObservation> = {
  providerName: ProviderName
  raw: TRawObservation[]
  metadata?: Record<string, unknown>
}

