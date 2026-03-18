export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()

  if (user.value) return

  // Ensure session hydration happened before deciding.
  if (import.meta.client) {
    const client = useSupabaseClient()
    await client.auth.getSession()
    if (useSupabaseUser().value) return
  }

  return navigateTo('/auth/login')
})

