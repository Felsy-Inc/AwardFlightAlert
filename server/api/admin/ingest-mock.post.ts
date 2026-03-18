import { requireUser } from '~lib/auth/guard'
import { ingestMockProvider } from '../../services/providerIngestService'

export default defineEventHandler(async (event) => {
  // dev-only safeguard
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    })
  }

  // require an authenticated user (keeps it from being hit accidentally)
  await requireUser(event)

  const body = await readBody(event).catch(() => ({}))
  const seed =
    typeof body?.seed === 'string'
      ? body.seed
      : typeof body?.seed === 'number'
        ? String(body.seed)
        : undefined
  const observations = typeof body?.observations === 'number' ? body.observations : undefined

  return ingestMockProvider({ seed, observations })
})

