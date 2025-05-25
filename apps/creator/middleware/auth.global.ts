import { api } from '@whispers/api'
import { useAuthStore } from '../store/auth'
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore()

	authStore.hydrate()

	if (to.path === '/auth') return

	const accessToken = useCookie('accessToken').value
	const refreshToken = useCookie('refreshToken').value

	api.setToken(accessToken)

	if (!accessToken) {
		authStore.logout()
		return navigateTo('/auth')
	}

	if (!authStore.profile) {
		try {
			const authApi = authStore.getAuthApi()
			const profile = await authApi.getProfile()
      // console.log(profile, 'profile here')
			authStore.setProfile(profile)
		} catch (e) {
			if (refreshToken) {
				try {
					const authApi = authStore.getAuthApi()
					const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken)
					authStore.setTokens(newAccessToken, refreshToken)
					const profile = await authApi.getProfile()
					authStore.setProfile(profile)
				} catch {
					authStore.logout()
					return navigateTo('/auth', { replace: true })
				}
			} else {
				authStore.logout()
				return navigateTo('/auth', { replace: true })
			}
		}
	}
})
