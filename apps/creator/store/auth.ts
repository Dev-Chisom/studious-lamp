import { defineStore } from 'pinia'
import { useCookie } from '#app'

// ~/store/user.ts
export const useAuthStore = defineStore('user', {
	state: () => ({
		profile: null as null | Record<string, any>,
		accessToken: null as null | string,
		refreshToken: null as null | string,
	}),

	actions: {
		// Add these if missing
		setProfile(profile: any) {
			this.profile = profile
		},

		// setRefreshToken(token: string) {
		// 	this.refreshToken = token
		// },
		setTokens(accessToken: string, refreshToken: string) {
			this.accessToken = accessToken
			this.refreshToken = refreshToken

			// Set cookies with proper options
			const accessTokenCookie = useCookie('accessToken', {
				maxAge: 60 * 60 * 24 * 7, // 1 week
				sameSite: 'lax',
				secure: true, // HTTPS only in production
			})
			const refreshTokenCookie = useCookie('refreshToken', {
				maxAge: 60 * 60 * 24 * 30, // 1 month
				sameSite: 'lax',
				secure: true,
			})

			accessTokenCookie.value = accessToken
			refreshTokenCookie.value = refreshToken
		},

		// Logout (clear store and cookies)
		logout() {
			this.accessToken = null
			this.refreshToken = null
			this.profile = null

			const accessTokenCookie = useCookie('accessToken')
			const refreshTokenCookie = useCookie('refreshToken')

			accessTokenCookie.value = null
			refreshTokenCookie.value = null
		},

		// Hydrate store from cookies
		hydrate() {
			const accessTokenCookie = useCookie('accessToken')
			const refreshTokenCookie = useCookie('refreshToken')

			this.accessToken = accessTokenCookie.value
			this.refreshToken = refreshTokenCookie.value
		},
	},

	getters: {
		isAuthenticated: (state) => !!state.accessToken,
	},
})
