export const ORIGIN_AIRPORTS = ['AMS', 'BRU', 'CDG', 'FRA', 'LHR', 'LGW'] as const

export type OriginAirportCode = (typeof ORIGIN_AIRPORTS)[number]

export const EUROPE_DESTINATION_AIRPORTS = ['MAD', 'BCN', 'FCO', 'LIS', 'ATH', 'VIE'] as const

export type EuropeDestinationAirportCode = (typeof EUROPE_DESTINATION_AIRPORTS)[number]

export const OTHER_SUPPORTED_AIRPORTS = [
  'JFK',
  'EWR',
  'BOS',
  'IAD',
  'MIA',
  'LAX',
  'SFO',
  'HND',
  'NRT',
] as const

export const ALL_AIRPORTS = [
  ...ORIGIN_AIRPORTS,
  ...EUROPE_DESTINATION_AIRPORTS,
  ...OTHER_SUPPORTED_AIRPORTS,
] as const

export type AirportCode = (typeof ALL_AIRPORTS)[number]

export const DESTINATION_REGIONS = ['JAPAN', 'US_EAST', 'US_WEST', 'EUROPE'] as const

export type DestinationRegion = (typeof DESTINATION_REGIONS)[number]

export const AIRPORT_TO_REGION: Record<AirportCode, DestinationRegion | null> = {
  AMS: null,
  BRU: null,
  CDG: null,
  FRA: null,
  LHR: null,
  LGW: null,
  MAD: 'EUROPE',
  BCN: 'EUROPE',
  FCO: 'EUROPE',
  LIS: 'EUROPE',
  ATH: 'EUROPE',
  VIE: 'EUROPE',
  HND: 'JAPAN',
  NRT: 'JAPAN',
  JFK: 'US_EAST',
  EWR: 'US_EAST',
  BOS: 'US_EAST',
  IAD: 'US_EAST',
  MIA: 'US_EAST',
  LAX: 'US_WEST',
  SFO: 'US_WEST',
}

