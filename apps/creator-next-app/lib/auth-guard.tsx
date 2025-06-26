"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "./auth-store"
import { useProfile } from "./api-hooks"
import { getRouteConfig } from "./route-config"

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
  const { isAuthenticated, profile } = useAuthStore()
  const { data: profileData, isPending, error } = useProfile()
  const [isChecking, setIsChecking] = useState(true)

  // Get route config or use props
  const routeConfig = getRouteConfig(pathname)
  const needsAuth = requiresAuth ?? routeConfig?.requiresAuth ?? false
  const needsCreator = requiresCreator ?? routeConfig?.requiresCreator ?? false

  const currentProfile = profileData || profile

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true)

      if (needsAuth && !isAuthenticated()) {
        router.replace(redirectTo)
        return
      }

      if (isAuthenticated() && pathname === "/auth") {
        router.replace("/")
        return
      }

      if (needsCreator && isAuthenticated()) {
        if (!isPending) {
          if (error) {
            router.replace("/auth")
            return
          }

          if (currentProfile) {
            const isApprovedCreator = currentProfile?.creatorProfile?.status === "approved"
            console.log(isApprovedCreator ? "✅ User is an approved creator" : "🚫 User is not an approved creator ")

            if (!isApprovedCreator) {
              router.replace("/apply")
              return
            }
          }
        }
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, currentProfile, isPending, error, needsAuth, needsCreator, router, redirectTo, pathname])

  // Show loading while checking
  if (isChecking || (needsAuth && !isAuthenticated()) || (needsCreator && isPending)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{t("creator.checkingPermissions")}</span>
      </div>
    )
  }

  return <>{children}</>
}
