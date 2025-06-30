"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "./auth-api"

interface AuthProviderProps {
  children: React.ReactNode
}

// Cookie utilities
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
}

export const useProfile = () => {
  const { isAuthenticated, accessToken } = useAuthStore()
  return useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated() && !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setProfile, clearAuth } = useAuthStore()
  const { isAuthenticated } = useAuthStore()
  const profileQuery = isAuthenticated() ? useProfile() : { data: null, isSuccess: false, isError: false }

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data) {
      setProfile(profileQuery.data)
    }
    if (profileQuery.isError) {
      clearAuth()
    }
  }, [profileQuery.isSuccess, profileQuery.isError, profileQuery.data, setProfile, clearAuth])

  return <>{children}</>
}
