import { useAuthStore } from '../store/auth'

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()

	if (!authStore.isAuthenticated && to.path !== '/auth') {
		return navigateTo('/auth')
	}

	// if authenticated and trying to access /auth page
	if (authStore.isAuthenticated && to.path === '/auth') {
		return navigateTo('/')
	}
})
