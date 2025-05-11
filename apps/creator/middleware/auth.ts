export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore() // If the user is not authenticated and is trying to access a protected route

  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  } // If the user is authenticated and trying to access auth pages

  if (authStore.isAuthenticated && to.path.startsWith('/auth/')) {
    return navigateTo('/')
  } // If the route requires creator role

  if (to.meta.requiresCreator && !authStore.isCreator) {
    return navigateTo('/')
  }
})
