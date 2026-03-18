import { requireUser } from '~lib/auth/guard'
import { runMatching } from '../../services/matchingService'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    })
  }

  await requireUser(event)

  const body = await readBody(event).catch(() => ({}))
  const providerRunId =
    typeof body?.providerRunId === 'string' ? body.providerRunId : undefined

  return runMatching({ providerRunId })
})

