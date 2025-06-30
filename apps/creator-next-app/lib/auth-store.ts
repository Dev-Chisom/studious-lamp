import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"
import type { User } from "./api-types"

interface JWTPayload {
  userId: string
  email: string
  name?: string
  isCreator?: boolean
  creatorProfile?: {
    status: string
    tier?: string
  }
  exp: number
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

interface AuthActions {
  setAuth: (accessToken: string, refreshToken: string, user?: User) => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: () => boolean
  isTokenValid: (token: string) => boolean
}

// Improved cookie utilities
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

  const cookieValue = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax${
    process.env.NODE_ENV === "production" ? ";Secure" : ""
  }`

  document.cookie = cookieValue
}

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

const getUserFromToken = (accessToken: string): User => {
  try {
    const decoded = jwtDecode<JWTPayload>(accessToken)
    return {
      _id: decoded.userId,
      createdAt: '',
      updatedAt: '',
      email: decoded.email,
      name: decoded.name || decoded.email,
      provider: '',
      providerId: '',
      refreshToken: '',
      status: 'active',
      creatorProfile: undefined,
      referralCode: undefined,
    }
  } catch (error) {
    console.error("Failed to decode JWT:", error)
    throw new Error("Invalid access token")
  }
}

// Check if token is valid and not expired
const isTokenValid = (token: string): boolean => {
  if (!token) return false
  
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}

export const useAuthStore = create<AuthState & AuthActions & {
  getSubscriptions: () => string[]
  logout: () => void
  setProfile: (user: User) => void
}>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,

      // Actions
      setAuth: (accessToken, refreshToken, user) => {
        // Validate token before setting
        if (!isTokenValid(accessToken)) {
          console.error("Invalid or expired access token")
          get().clearAuth()
          return
        }

        // If no user provided, decode from JWT
        let userData = user
        if (!userData) {
          try {
            userData = getUserFromToken(accessToken)
          } catch (error) {
            console.error("Failed to decode user from token:", error)
            get().clearAuth()
            return
          }
        }

        // Set in Zustand store
        set({
          accessToken,
          refreshToken,
          user: userData,
        })

        // Set cookies for middleware access
        setCookie("accessToken", accessToken, 7)
        setCookie("refreshToken", refreshToken, 30)
        setCookie("userProfile", JSON.stringify(userData), 7)
      },

      setUser: (user) => {
        set({ user })
        setCookie("userProfile", JSON.stringify(user), 7)
      },

      setTokens: (accessToken, refreshToken) => {
        // Validate new access token
        if (!isTokenValid(accessToken)) {
          console.error("Invalid or expired access token")
          get().clearAuth()
          return
        }

        set({ accessToken, refreshToken })
        setCookie("accessToken", accessToken, 7)
        setCookie("refreshToken", refreshToken, 30)
      },

      clearAuth: () => {
        // Clear Zustand store
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        })

        // Clear cookies
        deleteCookie("accessToken")
        deleteCookie("refreshToken")
        deleteCookie("userProfile")
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({ user: updatedUser })
          setCookie("userProfile", JSON.stringify(updatedUser), 7)
        }
      },

      isTokenValid: (token: string) => isTokenValid(token),

      isAuthenticated: () => {
        const state = get()
        
        // Check if we have both token and user
        if (!state.accessToken || !state.user) {
          return false
        }

        // Check if token is valid and not expired
        if (!isTokenValid(state.accessToken)) {
          // Token expired, clear auth
          get().clearAuth()
          return false
        }

        return true
      },

      getSubscriptions: () => {
        // Return an array of creator IDs the user is subscribed to (mock)
        return ["creator1", "creator2"]
      },

      logout: () => {
        get().clearAuth()
      },

      setProfile: (user) => {
        set({ user })
        setCookie("userProfile", JSON.stringify(user), 7)
      },
    }),
    {
      name: "auth-storage", 
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // Add version to handle store migration if needed
      version: 1,
    },
  ),
)