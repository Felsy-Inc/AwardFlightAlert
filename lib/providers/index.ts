import { getFeatureFlags } from '~lib/config/featureFlags'
import type { ProviderAdapter } from './base'
import { createMockProvider } from './mockProvider'

export const getActiveProvider = (): ProviderAdapter => {
  const flags = getFeatureFlags()

  if (flags.useMockProvider) return createMockProvider()

  throw createError({
    statusCode: 500,
    statusMessage: 'No active provider configured',
  })
}

