import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CreatorProfile {
  status: "pending" | "approved" | "rejected"
  // Add other creator profile fields as needed
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
  creatorProfile?: CreatorProfile // Add this field
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,
      loading: false,
      error: null,

      // Actions
      isAuthenticated: () => !!get().accessToken,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken: refreshToken ?? get().refreshToken }),
      setProfile: (profile) => set({ profile, error: null }),
      updateWalletBalance: (amount) => {
        const state = get()
        if (state.profile) {
          set({ profile: { ...state.profile, walletBalance: amount } })
        }
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          profile: null,
          loading: false,
          error: null,
        }),

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
    },
  ),
)
