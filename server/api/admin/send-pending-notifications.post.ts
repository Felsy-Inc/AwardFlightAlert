import { requireUser } from '~lib/auth/guard'
import { sendPendingNotifications } from '../../services/notificationService'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
    })
  }

  await requireUser(event)

  const body = await readBody(event).catch(() => ({}))
  const limit = typeof body?.limit === 'number' ? body.limit : undefined

  return sendPendingNotifications({ limit })
})

