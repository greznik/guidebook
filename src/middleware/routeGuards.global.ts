export default defineNuxtRouteMiddleware(async (to, from) => {
  // CUSTOM 404 PAGE
  const { errorCode } = useAuthStore()
  if (errorCode === 403) {
    return navigateTo('/404')
  }
})
