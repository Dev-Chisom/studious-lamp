import { api } from "./../api.service"
import type { AuthResponse, User } from "./../api-types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username: string
  displayName?: string
}

export const authApi = {
  // OAuth flow - get redirect URL for provider
  getOAuthUrl: (provider: "google" | "x") => {
    console.log(`🔗 Getting OAuth URL for ${provider}`)
    return api.post(`/auth/${provider}`)
  },

  // Traditional auth
  login: (credentials: LoginCredentials) => {
    console.log("🔐 Logging in user")
    return api.post<AuthResponse>("/auth/login", credentials)
  },

  register: (data: RegisterData) => {
    console.log("📝 Registering new user")
    return api.post<AuthResponse>("/auth/register", data)
  },

  // Profile management
  getProfile: () => {
    console.log("👤 Fetching user profile")
    return api.get<User>("/auth/profile")
  },

  updateProfile: (data: Partial<User>) => {
    console.log("✏️ Updating user profile")
    return api.put<User>("/auth/profile", data)
  },

  // Token management
  refreshToken: (refreshToken: string) => {
    console.log("🔄 Refreshing token")
    return api.post<{ accessToken: string; refreshToken?: string }>("/auth/refresh-token", { refreshToken })
  },

  logout: () => {
    console.log("🚪 Logging out")
    return api.post("/auth/logout")
  },

  // Password management
  changePassword: (currentPassword: string, newPassword: string) => {
    console.log("🔒 Changing password")
    return api.post("/auth/change-password", { currentPassword, newPassword })
  },

  requestPasswordReset: (email: string) => {
    console.log("📧 Requesting password reset")
    return api.post("/auth/forgot-password", { email })
  },

  resetPassword: (token: string, newPassword: string) => {
    console.log("🔑 Resetting password")
    return api.post("/auth/reset-password", { token, newPassword })
  },
}
