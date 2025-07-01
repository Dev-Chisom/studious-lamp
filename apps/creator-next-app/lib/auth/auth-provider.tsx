"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "./auth-api"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearAuth, isAuthenticatedFn, user, syncWithCookies } = useAuthStore()

  // Only fetch profile if authenticated but don't have complete user data
  const shouldFetchProfile = isAuthenticatedFn() && (!user?.email || !user?.name)

  console.log("🔍 AUTH PROVIDER - SHOULD FETCH PROFILE:", {
    isAuthenticated: isAuthenticatedFn(),
    hasUser: !!user,
    hasEmail: !!user?.email,
    hasName: !!user?.name,
    shouldFetch: shouldFetchProfile,
  })

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: shouldFetchProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  useEffect(() => {
    console.log("🔄 AUTH PROVIDER: SYNCING WITH COOKIES ON MOUNT...")
    // Re-enable syncWithCookies now that API is fixed
    syncWithCookies()
  }, [syncWithCookies])

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data) {
      console.log("👤 PROFILE FETCHED, UPDATING USER DATA:", profileQuery.data)
      setUser(profileQuery.data)
    }

    if (profileQuery.isError) {
      console.error("❌ PROFILE FETCH FAILED:", profileQuery.error)
      // Only clear auth if it's a real auth error, not a network error
      if (profileQuery.error && "status" in profileQuery.error && profileQuery.error.status === 401) {
        console.log("🧹 Clearing auth due to 401 error")
        clearAuth()
      }
    }
  }, [profileQuery.isSuccess, profileQuery.isError, profileQuery.data, setUser, clearAuth])

  return <>{children}</>
}
