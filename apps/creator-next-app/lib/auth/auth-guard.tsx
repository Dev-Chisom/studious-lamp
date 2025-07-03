"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "./auth-store"
import { getRouteConfig } from "./../route-config"

interface AuthGuardProps {
  children: React.ReactNode
  requiresAuth?: boolean
  requiresCreator?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requiresAuth, requiresCreator, redirectTo = "/auth" }: AuthGuardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  // Get auth state directly from store
  const { user, accessToken, isAuthenticatedFn } = useAuthStore()
  const isAuth = isAuthenticatedFn()

  const [isChecking, setIsChecking] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  // Get route config or use props
  const routeConfig = getRouteConfig(pathname)
  const needsAuth = requiresAuth ?? routeConfig?.requiresAuth ?? false
  const needsCreator = requiresCreator ?? routeConfig?.requiresCreator ?? false

  // Use only Zustand user
  const currentProfile = user

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked) return

    const checkAuth = () => {
      console.log("🔍 AUTH GUARD CHECKING:", {
        pathname,
        needsAuth,
        needsCreator,
        isAuth,
        hasProfile: !!currentProfile,
      })

      // Skip auth checks for auth page during processing
      if (pathname === "/auth") {
        console.log("⏭️ Skipping auth guard for auth page")
        setIsChecking(false)
        setHasChecked(true)
        return
      }

      // Check 1: Route needs auth but user is not authenticated
      if (needsAuth && !isAuth) {
        console.log("❌ Auth required but not authenticated, redirecting to", redirectTo)
        router.replace(redirectTo)
        return
      }

      // Check 2: User is authenticated but on auth page
      if (isAuth && pathname === "/auth") {
        console.log("✅ Authenticated user on auth page, redirecting to home")
        router.replace("/")
        return
      }

      // Check 3: Creator route checks
      if (needsCreator && isAuth) {
        if (currentProfile) {
          const isApprovedCreator = currentProfile?.creatorProfile?.status === "approved"
          console.log(isApprovedCreator ? "✅ User is an approved creator" : "🚫 User is not an approved creator")

          if (!isApprovedCreator) {
            console.log("❌ Not approved creator, redirecting to apply")
            router.replace("/apply")
            return
          }
        }
      }

      console.log("✅ Auth check passed")
      setIsChecking(false)
      setHasChecked(true)
    }

    checkAuth()
  }, [hasChecked, pathname, needsAuth, needsCreator, isAuth, currentProfile, router, redirectTo])

  // Reset checking state when route changes
  useEffect(() => {
    setHasChecked(false)
    setIsChecking(true)
  }, [pathname])

  // Enhanced loading with logo and branding
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>

          {/* Logo */}
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t("creator.checkingPermissions")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Verifying your access permissions...</p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2 mt-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
