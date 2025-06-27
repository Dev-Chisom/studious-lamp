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

export function useProfile() {
  const { accessToken, setProfile } = useAuthStore()

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!accessToken) throw new Error("No access token")
      const authApi = createAuthApi(accessToken)
      const profile = await authApi.getProfile()
      setProfile(profile)
      return profile
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  })
}

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
      console.log("🔐 Login mutation started")
      setLoading(true)
      setError(null)

      try {
        console.log("🔐 Setting tokens in store")
        setTokens(accessToken, refreshToken)

        console.log("🔐 Creating auth API client")
        const authApi = createAuthApi(accessToken)

        console.log("🔐 Fetching user profile")
        const profile = await authApi.getProfile()

        console.log("🔐 Profile fetched successfully:", profile)
        return profile
      } catch (error) {
        console.log("🔐 Primary login failed, trying refresh token")

        if (refreshToken) {
          try {
            const authApi = createAuthApi()
            console.log("🔐 Attempting token refresh")
            const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken)

            console.log("🔐 Token refresh successful")
            setTokens(newAccessToken, refreshToken)

            const newAuthApi = createAuthApi(newAccessToken)
            const profile = await newAuthApi.getProfile()

            console.log("🔐 Profile fetched with new token:", profile)
            return profile
          } catch (refreshError) {
            console.error("🔐 Token refresh failed:", refreshError)
            throw refreshError
          }
        }

        console.error("🔐 Login failed:", error)
        throw error
      }
    },
    onSuccess: (profile) => {
      console.log("🔐 Login mutation success")
      setProfile(profile)
      setLoading(false)
      toast.success("Login successful!")
    },
    onError: (error: Error) => {
      console.error("🔐 Login mutation error:", error)
      setError(error.message)
      setLoading(false)
      toast.error(error.message || "Login failed")
    },
  })
}

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
      window.location.href = "/auth"
    },
    onError: (error: Error) => {
      logout()
      toast.error("Logout failed, but local session cleared")
      window.location.href = "/auth"
    },
  })
}
