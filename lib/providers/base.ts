import type { ProviderNormalizedIngestResult, ProviderName, ProviderObservation, ProviderRawIngestResult } from './types'

export type ProviderRunContext = {
  startedAt: Date
  seed?: string
  observations?: number
}

export type ProviderAdapter<TRawObservation = unknown> = {
  name: ProviderName
  run: (
    ctx: ProviderRunContext,
  ) => Promise<ProviderNormalizedIngestResult | ProviderRawIngestResult<TRawObservation>>
  normalize?: (raw: TRawObservation[], ctx: ProviderRunContext) => ProviderObservation[]
}

