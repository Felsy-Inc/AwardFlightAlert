import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'

export const getSupabaseServerClient = (event: H3Event) => {
  return serverSupabaseClient(event)
}

export const getSupabaseUser = (event: H3Event) => {
  // serverSupabaseUser can throw (e.g. "Auth session missing!") when no session cookie exists.
  // For our guards we prefer a null user (-> 401) over a 500.
  try {
    return serverSupabaseUser(event)
  } catch {
    return null
  }
}

