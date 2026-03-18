import type { H3Event } from 'h3'
import { getSupabaseUser } from './supabaseServer'

export const requireUser = async (event: H3Event) => {
  const user = await getSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return user
}

