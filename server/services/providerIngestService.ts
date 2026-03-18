import { prisma } from '~lib/db/client'
import { getFeatureFlags } from '~lib/config/featureFlags'
import { getActiveProvider } from '~lib/providers'
import { runProvider } from '~lib/providers/run'

type IngestMockOptions = {
  seed?: string
  observations?: number
}

export const ingestMockProvider = async (options?: IngestMockOptions) => {
  const flags = getFeatureFlags()

  if (!flags.useMockProvider) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Mock provider is disabled (USE_MOCK_PROVIDER=false)',
    })
  }

  const provider = getActiveProvider()
  if (provider.name !== 'mock') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Active provider is not mock',
    })
  }

  const startedAt = new Date()
  const requestedMetadata = Object.fromEntries(
    Object.entries({
      seed: options?.seed,
      observations: options?.observations,
    }).filter(([, v]) => v !== undefined),
  )
  const providerRun = await prisma.providerRun.create({
    data: {
      providerName: provider.name,
      status: 'RUNNING',
      startedAt,
      metadata: requestedMetadata,
    },
  })

  const logBase = { provider: provider.name, providerRunId: providerRun.id }
  console.info('[provider-ingest] started', logBase)

  try {
    const ingest = await runProvider(provider, {
      startedAt,
      seed: options?.seed,
      observations: options?.observations,
    })

    const t0 = Date.now()

    // Insert observations with fingerprint-based dedupe.
    // Dedupe is enforced by a DB unique constraint on AwardObservation.fingerprintHash.
    const created = await prisma.awardObservation.createMany({
      data: ingest.observations.map((o) => ({
        providerRunId: providerRun.id,
        sourceProvider: o.sourceProvider,
        program: o.program,
        airline: o.airline,
        flightNumber: o.flightNumber,
        originAirport: o.originAirport,
        destinationAirport: o.destinationAirport,
        destinationRegion: o.destinationRegion,
        departureDatetime: o.departureDatetime,
        arrivalDatetime: o.arrivalDatetime,
        departureDate: o.departureDate,
        cabin: o.cabin,
        pointsCost: o.pointsCost,
        taxesAmount: o.taxesAmount,
        currency: o.currency,
        seatsAvailable: o.seatsAvailable,
        bookingUrl: o.bookingUrl,
        bookingHint: o.bookingHint,
        observedAt: o.observedAt,
        fingerprintHash: o.fingerprintHash,
      })),
      skipDuplicates: true,
    })

    const requested = ingest.observations.length
    const inserted = created.count
    const deduped = requested - inserted
    const completedAt = new Date()

    const completed = await prisma.providerRun.update({
      where: { id: providerRun.id },
      data: {
        status: 'SUCCESS',
        completedAt,
        recordsIngested: inserted,
        metadata: {
          ...(typeof ingest.metadata === 'object' && ingest.metadata ? ingest.metadata : {}),
          requested,
          inserted,
          deduped,
          durationMs: completedAt.getTime() - startedAt.getTime(),
          insertDurationMs: Date.now() - t0,
        },
      },
    })

    console.info('[provider-ingest] success', {
      ...logBase,
      requested,
      inserted,
      deduped,
      durationMs: completedAt.getTime() - startedAt.getTime(),
    })

    return { run: completed, requested, inserted, deduped }
  } catch (e: any) {
    const completedAt = new Date()
    const message = e?.statusMessage || e?.message || String(e)

    await prisma.providerRun.update({
      where: { id: providerRun.id },
      data: {
        status: 'FAILED',
        completedAt,
        errorMessage: message,
      },
    })

    console.error('[provider-ingest] failed', { ...logBase, message })
    throw e
  }
}

