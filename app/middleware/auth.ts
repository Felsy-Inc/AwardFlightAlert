export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/pricing', '/browse', '/auth/login', '/auth/confirm']
  if (publicRoutes.includes(to.path)) return

  try {
    const { data } = await useFetch('/api/auth/session')

    if (!data.value?.user) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    const err = error as any
    const status = err?.statusCode || err?.response?.status

    if (status === 401) {
      return navigateTo('/auth/login')
    }

    throw error
  }
})

