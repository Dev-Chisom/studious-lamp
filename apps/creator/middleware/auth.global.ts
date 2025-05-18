import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useAuthStore } from '../store/auth'
import { api, createAuthApi } from '@whispers/api'

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore()

	if (to.path === '/auth') return

	const accessToken = useCookie('accessToken').value
	const refreshToken = useCookie('refreshToken').value

	// Initialize API with tokens
	api.setToken(accessToken)

	if (accessToken) {
		authStore.setTokens(accessToken, refreshToken)

		if (!authStore.profile) {
			try {
				const authApi = createAuthApi(accessToken)
				const profile = await authApi.getProfile()
				authStore.setProfile(profile)
			} catch (e) {
				try {
					const authApi = createAuthApi()
					const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken)
					api.setToken(newAccessToken)
					authStore.setTokens(newAccessToken, refreshToken)
					const profile = await authApi.getProfile()
					authStore.setProfile(profile)
				} catch (refreshError) {
					authStore.logout()
					return navigateTo('/auth')
				}
			}
		}
	} else {
		authStore.logout()
		return navigateTo('/auth')
	}
})
