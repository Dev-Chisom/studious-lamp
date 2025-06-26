"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "./auth-store"
import { useProfile } from "./api-hooks"

// Hook to handle route protection logic
export function useRouteGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, profile } = useAuthStore()
  const { data: profileData, isPending } = useProfile()

  const currentProfile = profileData || profile

  useEffect(() => {
    // Define route patterns that require creator status
    const creatorRoutePatterns = ["/creator", "/analytics", "/earnings", "/subscribers", "/content/create"]
    const isCreatorRoute = creatorRoutePatterns.some((pattern) => pathname.startsWith(pattern))

    // Define routes that require authentication
    const protectedRoutePatterns = ["/dashboard", "/profile", "/settings", "/wallet", "/subscriptions"]
    const isProtectedRoute = protectedRoutePatterns.some((pattern) => pathname.startsWith(pattern)) || isCreatorRoute

    // Check authentication
    if (isProtectedRoute && !isAuthenticated()) {
      router.replace("/auth")
      return
    }

    // Redirect authenticated users away from auth page
    if (isAuthenticated() && pathname === "/auth") {
      router.replace("/")
      return
    }

    // Check creator status for creator routes
    if (isCreatorRoute && isAuthenticated() && !isPending && currentProfile) {
      const isApprovedCreator = currentProfile?.creatorProfile?.status === "approved"

      if (!isApprovedCreator) {
        router.replace("/apply")
        return
      }
    }
  }, [pathname, isAuthenticated, currentProfile, isPending, router])
}
