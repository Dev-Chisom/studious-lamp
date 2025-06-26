"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { useLogin } from "./api-hooks"
import { createApiService } from "./api.service"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { accessToken, refreshToken, setTokens, setProfile, logout, isAuthenticated } = useAuthStore()
  const loginMutation = useLogin()

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for tokens in cookies (set by middleware or login)
      const cookieAccessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1]

      const cookieRefreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1]

      if (cookieAccessToken && cookieAccessToken !== accessToken) {
        setTokens(cookieAccessToken, cookieRefreshToken || null)
      }

      // If we have tokens but no profile, fetch it
      if (isAuthenticated() && !useAuthStore.getState().profile) {
        try {
          const api = createApiService(
            accessToken || cookieAccessToken,
            refreshToken || cookieRefreshToken,
            (newToken) => setTokens(newToken, refreshToken || cookieRefreshToken),
            () => logout(),
          )

          const profile = await api.get("/auth/profile")
          setProfile(profile)
        } catch (error) {
          // If profile fetch fails, try to refresh token
          if (refreshToken || cookieRefreshToken) {
            try {
              const api = createApiService()
              const { accessToken: newAccessToken } = await api.post("/auth/refresh-token", {
                refreshToken: refreshToken || cookieRefreshToken,
              })

              setTokens(newAccessToken, refreshToken || cookieRefreshToken)

              // Set new token in cookie
              document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${7 * 24 * 60 * 60}`

              // Try to fetch profile again
              const newApi = createApiService(newAccessToken)
              const profile = await newApi.get("/auth/profile")
              setProfile(profile)
            } catch (refreshError) {
              logout()
              // Clear cookies
              document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
              document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
            }
          } else {
            logout()
          }
        }
      }
    }

    initializeAuth()
  }, [accessToken, refreshToken, setTokens, setProfile, logout, isAuthenticated])

  return <>{children}</>
}
