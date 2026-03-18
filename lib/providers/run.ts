import type { ProviderAdapter, ProviderRunContext } from './base'
import type { ProviderNormalizedIngestResult, ProviderObservation, ProviderRawIngestResult } from './types'

const isNormalized = (
  r: ProviderNormalizedIngestResult | ProviderRawIngestResult<any>,
): r is ProviderNormalizedIngestResult => 'observations' in r

export const runProvider = async <TRawObservation>(
  provider: ProviderAdapter<TRawObservation>,
  ctx: ProviderRunContext,
): Promise<ProviderNormalizedIngestResult> => {
  const res = await provider.run(ctx)

  if (isNormalized(res)) return res

  if (!provider.normalize) {
    throw createError({
      statusCode: 500,
      statusMessage: `Provider "${provider.name}" returned raw observations but has no normalizer`,
    })
  }

  const observations: ProviderObservation[] = provider.normalize(res.raw, ctx)
  return {
    providerName: res.providerName,
    observations,
    metadata: res.metadata,
  }
}

