import { useSupabaseClient, useSupabaseUser } from '#imports'

export const useSupabaseBrowserClient = () => {
  return useSupabaseClient()
}

export const useSupabaseCurrentUser = () => {
  return useSupabaseUser()
}

