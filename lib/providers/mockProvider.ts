import type { ProviderAdapter, ProviderRunContext } from './base'
import type { ProviderNormalizedIngestResult } from './types'
import { createMockRawObservations, type MockRawObservation } from './mock/raw'
import { normalizeMockObservations } from './mock/normalize'

export const createMockProviderIngest = (
  options?: { seed?: string; observations?: number },
): ProviderNormalizedIngestResult => {
  const { raw, metadata } = createMockRawObservations({
    seed: options?.seed,
    observations: options?.observations,
  })
  const observations = normalizeMockObservations(raw)
  return {
    providerName: 'mock',
    observations,
    metadata,
  }
}

export const createMockProvider = (): ProviderAdapter<MockRawObservation> => {
  return {
    name: 'mock',
    run: async (ctx: ProviderRunContext) => {
      const { raw, metadata } = createMockRawObservations({
        seed: ctx.seed,
        observations: ctx.observations,
      })
      return { providerName: 'mock', raw, metadata }
    },
    normalize: (raw) => normalizeMockObservations(raw),
  }
}

