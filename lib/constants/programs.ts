export const PROGRAMS = ['FLYING_BLUE', 'MILES_AND_MORE', 'AVIOS'] as const

export type ProgramCode = (typeof PROGRAMS)[number]

export const PROGRAM_LABELS: Record<ProgramCode, string> = {
  FLYING_BLUE: 'Flying Blue',
  MILES_AND_MORE: 'Miles & More',
  AVIOS: 'Avios',
}

