import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useAuthStore } from '../store/auth'
import { createAuthApi } from '@whispers/api';

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore()

	if (to.path === '/auth') return

	if (!authStore.isAuthenticated) {
		const accessToken = useCookie('accessToken').value
		const refreshToken = useCookie('refreshToken').value

		if (accessToken) {
			authStore.setTokens(accessToken, refreshToken)

			if (!authStore.profile) {
				try {
					const authApi = createAuthApi(accessToken)
					const profile = await authApi.getProfile()
					authStore.profile = profile
					// return navigateTo({ path: '/', query: {} }, { replace: true })
				} catch (e) {
					authStore.logout()
					return navigateTo('/auth')
				}
			}
		} else {
			return navigateTo('/auth')
		}
	}
})
