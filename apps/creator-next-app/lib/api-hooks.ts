// Custom hooks that integrate your API service with TanStack Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuthStore } from "./auth-store"
import { createAuthApi } from "./auth-api"
import { createApiService } from "./api.service"

export function useAuthenticatedApi() {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore()

  return createApiService(
    accessToken || undefined,
    refreshToken || undefined,
    (newToken) => setTokens(newToken, refreshToken), // onTokenRefresh
    () => {
      logout()
      toast.error("Session expired. Please log in again.")
    }, // onAuthError
  )
}

// Hook for fetching user profile
export function useProfile() {
  const { accessToken, setProfile } = useAuthStore()

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!accessToken) throw new Error("No access token")
      const authApi = createAuthApi(accessToken)
      const profile = await authApi.getProfile()
      setProfile(profile) // Update Zustand store
      return profile
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    throwOnError: false, // Handle errors manually
  })
}

// Hook for login mutation - Fixed to handle QueryClient properly
export function useLogin() {
  const { setTokens, setProfile, setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string
      refreshToken: string | null
    }) => {
      setLoading(true)
      setError(null)

      try {
        setTokens(accessToken, refreshToken)
        const authApi = createAuthApi(accessToken)
        const profile = await authApi.getProfile()
        return profile
      } catch (error) {
        if (refreshToken) {
          const authApi = createAuthApi()
          const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken)
          setTokens(newAccessToken, refreshToken)
          const newAuthApi = createAuthApi(newAccessToken)
          const profile = await newAuthApi.getProfile()
          return profile
        }
        throw error
      }
    },
    onSuccess: (profile) => {
      setProfile(profile)
      setLoading(false)
      toast.success("Login successful!")
    },
    onError: (error: Error) => {
      setError(error.message)
      setLoading(false)
      toast.error(error.message || "Login failed")
    },
  })
}

// Hook for logout mutation - Fixed to handle QueryClient properly
export function useLogout() {
  const { accessToken, logout } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      if (accessToken) {
        const authApi = createAuthApi(accessToken)
        await authApi.logout()
      }
    },
    onSuccess: () => {
      logout()
      toast.success("Logged out successfully")
      // Redirect to login page
      window.location.href = "/auth"
    },
    onError: (error: Error) => {
      // Even if logout API call fails, clear local state
      logout()
      toast.error("Logout failed, but local session cleared")
      window.location.href = "/auth"
    },
  })
}
