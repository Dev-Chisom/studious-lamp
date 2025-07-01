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
  const [isChecking, setIsChecking] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  // Get route config or use props
  const routeConfig = getRouteConfig(pathname)
  const needsAuth = requiresAuth ?? routeConfig?.requiresAuth ?? false
  const needsCreator = requiresCreator ?? routeConfig?.requiresCreator ?? false

  // Use the function to check authentication
  const isAuth = isAuthenticatedFn()
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
        hasAccessToken: !!accessToken,
      })

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
  }, [hasChecked, pathname, needsAuth, needsCreator, isAuth, currentProfile, router, redirectTo, accessToken])

  // Reset checking state when route changes
  useEffect(() => {
    setHasChecked(false)
    setIsChecking(true)
  }, [pathname])

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{t("creator.checkingPermissions")}</span>
      </div>
    )
  }

  return <>{children}</>
}
