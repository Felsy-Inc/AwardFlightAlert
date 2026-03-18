export const CABINS = ['BUSINESS', 'PREMIUM_ECONOMY', 'ECONOMY', 'FIRST'] as const

export type CabinCode = (typeof CABINS)[number]

export const DEFAULT_CABIN: CabinCode = 'BUSINESS'

