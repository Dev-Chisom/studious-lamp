"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "./auth-store"

// Hook to handle route protection logic
export function useRouteGuard() {
  const router = useRouter()
  const pathname = usePathname()
  
  // Get auth state directly from store
  const { user, accessToken } = useAuthStore()
  const isAuth = Boolean(user && accessToken)
  
  const hasCheckedRef = useRef(false)
  const lastPathnameRef = useRef(pathname)

  // Define route patterns
  const creatorRoutePatterns = ["/creator", "/analytics", "/earnings", "/subscribers", "/content/create"]
  const protectedRoutePatterns = ["/dashboard", "/profile", "/settings", "/wallet", "/subscriptions"]
  
  const isCreatorRoute = creatorRoutePatterns.some((pattern) => pathname.startsWith(pattern))
  const isProtectedRoute = protectedRoutePatterns.some((pattern) => pathname.startsWith(pattern)) || isCreatorRoute

  // Only fetch profile if authenticated and on creator route
  const shouldFetchProfile = isAuth && isCreatorRoute
  // Use only Zustand user
  const currentProfile = user

  useEffect(() => {
    // Reset check when pathname changes
    if (lastPathnameRef.current !== pathname) {
      hasCheckedRef.current = false
      lastPathnameRef.current = pathname
    }

    // Prevent multiple checks for the same route
    if (hasCheckedRef.current) return

    const checkRoute = () => {
      console.log("🛡️ RouteGuard checking:", { 
        pathname, 
        isProtectedRoute, 
        isCreatorRoute, 
        isAuth,
        hasProfile: !!currentProfile 
      })

      // Check 1: Protected route needs authentication
      if (isProtectedRoute && !isAuth) {
        console.log("❌ Protected route requires auth, redirecting")
        router.replace("/auth")
        return
      }

      // Check 2: Redirect authenticated users away from auth page
      if (isAuth && pathname === "/auth") {
        console.log("✅ Authenticated user on auth page, redirecting home")
        router.replace("/")
        return
      }

      // Check 3: Creator route requires approved creator status
      if (isCreatorRoute && isAuth) {
        if (shouldFetchProfile) {
          console.log("⏳ Creator route: waiting for profile...")
          return // Don't mark as checked yet
        }

        if (currentProfile) {
          const isApprovedCreator = currentProfile?.creatorProfile?.status === "approved"
          console.log(`${isApprovedCreator ? "✅" : "❌"} Creator status: ${currentProfile?.creatorProfile?.status}`)

          if (!isApprovedCreator) {
            console.log("❌ Not approved creator, redirecting to apply")
            router.replace("/apply")
            return
          }
        }
      }

      console.log("✅ Route guard check passed")
      hasCheckedRef.current = true
    }

    checkRoute()
  }, [
    pathname,
    isProtectedRoute,
    isCreatorRoute,
    isAuth,
    currentProfile,
    shouldFetchProfile,
    router
  ])
}