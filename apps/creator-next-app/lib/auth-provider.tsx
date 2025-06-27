"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { createApiService } from "./api.service"

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

export function AuthProvider({ children }: AuthProviderProps) {
  const { accessToken, refreshToken, setTokens, setProfile, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔐 AuthProvider initializing...")

      // Get tokens from cookies
      const cookieAccessToken = getCookie("accessToken")
      const cookieRefreshToken = getCookie("refreshToken")

      console.log("🔐 Cookie tokens:", {
        cookieAccessToken: cookieAccessToken ? "YES" : "NO",
        cookieRefreshToken: cookieRefreshToken ? "YES" : "NO",
        storeAccessToken: accessToken ? "YES" : "NO",
      })

      // Sync store with cookies if different
      if (cookieAccessToken && cookieAccessToken !== accessToken) {
        console.log("🔐 Syncing tokens from cookies to store")
        useAuthStore.setState({
          accessToken: cookieAccessToken,
          refreshToken: cookieRefreshToken,
        })
      }

      // If we have tokens but no profile, fetch it
      const currentToken = accessToken || cookieAccessToken
      if (currentToken && !useAuthStore.getState().profile) {
        console.log("🔐 Have token but no profile, fetching...")
        try {
          const api = createApiService(
            currentToken,
            refreshToken || cookieRefreshToken,
            (newToken) => setTokens(newToken, refreshToken || cookieRefreshToken),
            () => {
              console.log("🔐 Auth error in provider, logging out")
              logout()
            },
          )

          const profile = await api.get("/auth/profile")
          console.log("🔐 Profile fetched successfully:", profile)
          setProfile(profile)
        } catch (error) {
          console.error("🔐 Failed to fetch profile:", error)

          // If profile fetch fails, try to refresh token
          if (refreshToken || cookieRefreshToken) {
            try {
              console.log("🔐 Trying to refresh token...")
              const api = createApiService()
              const { accessToken: newAccessToken } = await api.post("/auth/refresh-token", {
                refreshToken: refreshToken || cookieRefreshToken,
              })

              setTokens(newAccessToken, refreshToken || cookieRefreshToken)

              // Try to fetch profile again
              const newApi = createApiService(newAccessToken)
              const profile = await newApi.get("/auth/profile")
              setProfile(profile)
              console.log("🔐 Profile fetched after token refresh")
            } catch (refreshError) {
              console.error("🔐 Token refresh failed, logging out")
              logout()
            }
          } else {
            console.log("🔐 No refresh token available, logging out")
            logout()
          }
        }
      }
    }

    initializeAuth()
  }, []) // Remove dependencies to prevent loops

  return <>{children}</>
}
