import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CreatorProfile {
  status: "pending" | "approved" | "rejected"
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
  creatorProfile?: CreatorProfile
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  profile: UserProfile | null
  loading: boolean
  error: string | null

  // Actions
  isAuthenticated: () => boolean
  setTokens: (accessToken: string, refreshToken: string | null) => void
  setProfile: (profile: UserProfile) => void
  updateWalletBalance: (amount: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void

  // Getters (computed values)
  getIsCreator: () => boolean
  getIsApprovedCreator: () => boolean
  getWalletBalance: () => number
  getSubscriptions: () => string[]
  getCollections: () => UserProfile["collections"]
}

// Cookie utilities
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure=${location.protocol === "https:"}`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,
      loading: false,
      error: null,

      // Actions
      isAuthenticated: () => {
        const state = get()
        // Check both store and cookies for tokens
        const storeToken = state.accessToken
        const cookieToken = getCookie("accessToken")
        const hasValidToken = !!(storeToken || cookieToken)
        const hasProfile = !!state.profile

        console.log("🔐 Auth check:", {
          hasValidToken,
          hasProfile,
          storeToken: storeToken ? `${storeToken.substring(0, 10)}...` : null,
          cookieToken: cookieToken ? `${cookieToken.substring(0, 10)}...` : null,
          profileId: state.profile?.id,
        })

        return hasValidToken && hasProfile
      },

      setTokens: (accessToken, refreshToken) => {
        console.log("🔐 Setting tokens in both store and cookies:", {
          accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null,
          refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
        })

        // Set in store
        set({ accessToken, refreshToken: refreshToken ?? get().refreshToken })

        // Set in cookies for middleware access
        setCookie("accessToken", accessToken, 7)
        if (refreshToken) {
          setCookie("refreshToken", refreshToken, 30) // Longer expiry for refresh token
        }
      },

      setProfile: (profile) => {
        console.log("🔐 Setting profile:", { id: profile.id, name: profile.name })
        set({ profile, error: null })
      },

      updateWalletBalance: (amount) => {
        const state = get()
        if (state.profile) {
          set({ profile: { ...state.profile, walletBalance: amount } })
        }
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => {
        console.log("🔐 Logging out - clearing all auth state and cookies")

        // Clear store
        set({
          accessToken: null,
          refreshToken: null,
          profile: null,
          loading: false,
          error: null,
        })

        // Clear cookies
        deleteCookie("accessToken")
        deleteCookie("refreshToken")
      },

      // Getters
      getIsCreator: () => get().profile?.isCreator || false,
      getIsApprovedCreator: () => get().profile?.creatorProfile?.status === "approved",
      getWalletBalance: () => get().profile?.walletBalance ?? 0,
      getSubscriptions: () => get().profile?.subscriptions ?? [],
      getCollections: () => get().profile?.collections ?? [],
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist profile, not tokens (tokens go in cookies)
      partialize: (state) => ({
        profile: state.profile,
        // Don't persist tokens in localStorage anymore
      }),
      onRehydrateStorage: () => (state) => {
        console.log("🔐 Rehydrating auth state:", {
          hasProfile: !!state?.profile,
          profileId: state?.profile?.id,
        })

        // After rehydration, sync tokens from cookies
        if (typeof window !== "undefined") {
          const cookieAccessToken = getCookie("accessToken")
          const cookieRefreshToken = getCookie("refreshToken")

          if (cookieAccessToken) {
            console.log("🔐 Syncing tokens from cookies after rehydration")
            // Update store with cookie tokens (but don't set cookies again)
            useAuthStore.setState({
              accessToken: cookieAccessToken,
              refreshToken: cookieRefreshToken,
            })
          }
        }
      },
    },
  ),
)
