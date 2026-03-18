import { createHash } from 'node:crypto'
import {
  AIRPORT_TO_REGION,
  DESTINATION_REGIONS,
  ORIGIN_AIRPORTS,
  EUROPE_DESTINATION_AIRPORTS,
  OTHER_SUPPORTED_AIRPORTS,
  type AirportCode,
  type DestinationRegion,
} from '~lib/constants/airports'
import { DEFAULT_CABIN } from '~lib/constants/cabins'
import { PROGRAMS, type ProgramCode } from '~lib/constants/programs'

export type MockRawObservation = {
  program: ProgramCode
  airline: string
  flightNumber: string
  originAirport: AirportCode
  destinationAirport: AirportCode
  destinationRegion: DestinationRegion
  departureDatetime: Date
  arrivalDatetime: Date
  cabin: typeof DEFAULT_CABIN
  pointsCost: number
  taxesAmount: number
  currency: string
  seatsAvailable: number
  bookingUrl: string | null
  bookingHint: string | null
  observedAt: Date
}

type MockProviderOptions = {
  seed: string
  observations: number
  startDaysFromNow: number
  dateWindowDays: number
}

const DEFAULT_OPTIONS: MockProviderOptions = {
  seed: 'awardflightalert',
  observations: 120,
  startDaysFromNow: 2,
  dateWindowDays: 90,
}

// Small deterministic PRNG
const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hashSeed = (seed: string) =>
  createHash('sha256').update(seed).digest().readUInt32LE(0)

const pick = <T>(rnd: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rnd() * arr.length)] as T

const clampInt = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.trunc(n)))

const regionDestinations = (region: DestinationRegion): AirportCode[] => {
  if (region === 'EUROPE') return [...EUROPE_DESTINATION_AIRPORTS]
  // For JAPAN/US_* we use OTHER_SUPPORTED_AIRPORTS filtered by region map
  return OTHER_SUPPORTED_AIRPORTS.filter((a) => AIRPORT_TO_REGION[a] === region) as AirportCode[]
}

export const createMockRawObservations = (
  options?: Partial<MockProviderOptions>,
): { raw: MockRawObservation[]; metadata: Record<string, unknown> } => {
  const opts: MockProviderOptions = {
    ...DEFAULT_OPTIONS,
    ...(options
      ? Object.fromEntries(
          Object.entries(options).filter(([, v]) => v !== undefined),
        )
      : {}),
  } as MockProviderOptions
  const rnd = mulberry32(hashSeed(opts.seed))

  const now = new Date()
  const base = new Date(now.getTime())
  base.setUTCDate(base.getUTCDate() + opts.startDaysFromNow)

  const raw: MockRawObservation[] = []

  for (let i = 0; i < opts.observations; i++) {
    const originAirport = pick(rnd, ORIGIN_AIRPORTS)
    const destinationRegion = pick(rnd, DESTINATION_REGIONS)
    const dests = regionDestinations(destinationRegion)
    const destinationAirport = pick(rnd, dests)

    const program = pick(rnd, PROGRAMS) as ProgramCode
    const airline = program === 'FLYING_BLUE' ? 'KL' : program === 'MILES_AND_MORE' ? 'LH' : 'BA'
    const flightNumber = `${airline}${clampInt(100 + rnd() * 900, 100, 999)}`

    const dayOffset = clampInt(rnd() * opts.dateWindowDays, 0, opts.dateWindowDays - 1)
    const dep = new Date(base.getTime())
    dep.setUTCDate(dep.getUTCDate() + dayOffset)

    // depart between 06:00 and 22:00 UTC
    dep.setUTCHours(clampInt(6 + rnd() * 16, 6, 22), clampInt(rnd() * 12, 0, 55), 0, 0)

    const durationHours = destinationRegion === 'EUROPE'
      ? 2 + rnd() * 2.5
      : destinationRegion === 'JAPAN'
        ? 11 + rnd() * 2.5
        : 8 + rnd() * 3

    const arr = new Date(dep.getTime() + durationHours * 60 * 60 * 1000)

    const seatsAvailable = pick(rnd, [1, 1, 1, 2, 2, 3, 4] as const)
    const pointsCost =
      destinationRegion === 'EUROPE'
        ? clampInt(18000 + rnd() * 22000, 15000, 45000)
        : destinationRegion === 'US_EAST'
          ? clampInt(45000 + rnd() * 35000, 35000, 90000)
          : destinationRegion === 'US_WEST'
            ? clampInt(55000 + rnd() * 40000, 45000, 110000)
            : clampInt(65000 + rnd() * 50000, 50000, 140000)

    const taxesAmount =
      destinationRegion === 'EUROPE'
        ? clampInt(25 + rnd() * 90, 10, 180)
        : clampInt(120 + rnd() * 280, 80, 550)

    const observedAt = new Date(now.getTime() - clampInt(rnd() * 6, 0, 6) * 60 * 60 * 1000)

    raw.push({
      program,
      airline,
      flightNumber,
      originAirport,
      destinationAirport,
      destinationRegion,
      departureDatetime: dep,
      arrivalDatetime: arr,
      cabin: DEFAULT_CABIN,
      pointsCost,
      taxesAmount,
      currency: 'EUR',
      seatsAvailable,
      bookingUrl: null,
      bookingHint: null,
      observedAt,
    })
  }

  return {
    raw,
    metadata: {
      seed: opts.seed,
      observations: opts.observations,
    },
  }
}

