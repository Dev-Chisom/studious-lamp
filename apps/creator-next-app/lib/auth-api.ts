import { createApiService, getApiBaseUrl } from "./api.service"

interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  walletBalance: number
  isCreator: boolean
  subscriptions: string[]
  collections: {
    id: string
    name: string
    posts: string[]
  }[]
}

export function getOAuthUrl(provider: "google" | "x") {
  return `${getApiBaseUrl()}/auth/${provider}`
}

export function createAuthApi(token?: string) {
  const api = createApiService(token)

  return {
    setToken: api.setToken,
    getProfile: (): Promise<UserProfile> => api.get("/auth/profile"),
    refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
      api.post<RefreshTokenResponse>("/auth/refresh-token", { refreshToken }),
    logout: () => api.patch("/auth/logout"),
  }
}

// Standalone functions for convenience (optional)
export async function getProfile(token: string): Promise<UserProfile> {
  const authApi = createAuthApi(token)
  return authApi.getProfile()
}

export async function refreshTokenApi(refreshToken: string): Promise<RefreshTokenResponse> {
  const authApi = createAuthApi()
  return authApi.refreshToken(refreshToken)
}
