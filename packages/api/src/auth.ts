import { createApiService, getApiBaseUrl } from './api.service'

interface RefreshTokenResponse {
	accessToken: string
	refreshToken?: string
}

export function getOAuthUrl(provider: 'google' | 'x') {
	return `${getApiBaseUrl()}/auth/${provider}`
}

export function createAuthApi(token?: string) {
	const api = createApiService(token)

	return {
		getProfile: () => api.get('/auth/profile'),
		refreshToken: (refreshToken: string) => api.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken }),
	}
}
