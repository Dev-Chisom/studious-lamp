"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "./auth-api"

interface AuthProviderProps {
  children: React.ReactNode
}

export const useProfile = () => {
  const { isAuthenticatedFn, accessToken } = useAuthStore()

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      console.log("🔍 Profile query function called")
      return authApi.getProfile()
    },
    enabled: isAuthenticatedFn() && !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      console.log("🔄 Profile query retry:", { failureCount, error: error?.message })
      // Don't retry on 401 errors
      if (error?.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearAuth, isAuthenticatedFn, user } = useAuthStore()
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      console.log("🔍 Profile query function called")
      return authApi.getProfile()
    },
    enabled: isAuthenticatedFn() && !!user && (!user?.email || !user?.name),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      console.log("🔄 Profile query retry:", { failureCount, error: error?.message })
      // Don't retry on 401 errors
      if (error?.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })

  console.log("🔍 AuthProvider render:", {
    isAuthenticated: isAuthenticatedFn(),
    hasUser: !!user,
    hasEmail: !!user?.email,
    hasName: !!user?.name,
    shouldFetchProfile: isAuthenticatedFn() && (!user?.email || !user?.name),
  })

  useEffect(() => {
    console.log("🔍 AuthProvider profile query effect:", {
      isSuccess: profileQuery.isSuccess,
      isError: profileQuery.isError,
      hasData: !!profileQuery.data,
      error: profileQuery.error,
    })

    if (profileQuery.isSuccess && profileQuery.data) {
      console.log("✅ Profile fetched successfully, updating user")
      setUser(profileQuery.data)
    }

    if (profileQuery.isError) {
      console.error("❌ Profile fetch failed:", profileQuery.error)
      // Only clear auth if it's a real auth error, not a network error
      const error = profileQuery.error as any
      if (error?.status === 401 || error?.status === 403) {
        console.log("🚪 Clearing auth due to profile fetch error")
        clearAuth()
      }
    }
  }, [profileQuery.isSuccess, profileQuery.isError, profileQuery.data, profileQuery.error, setUser, clearAuth])

  return <>{children}</>
}
