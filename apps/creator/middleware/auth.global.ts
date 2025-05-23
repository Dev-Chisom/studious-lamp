import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useAuthStore } from '../store/auth'
import { api } from '@whispers/api'

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore()

	if (to.path === '/auth') return

	const accessToken = useCookie('accessToken').value
	const refreshToken = useCookie('refreshToken').value

	api.setToken(accessToken)

	if (!accessToken) {
		authStore.logout()
		return navigateTo('/auth')
	}

	authStore.setTokens(accessToken, refreshToken)

	if (!authStore.profile) {
		try {
			const authApi = authStore.getAuthApi()
			const profile = await authApi.getProfile()
			authStore.setProfile(profile)
		} catch (e) {
			authStore.logout()
			return navigateTo('/auth', { replace: true })
		}
	}
})
