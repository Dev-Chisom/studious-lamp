"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/auth/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/ui/icons"
import { OAuthLogin } from "@/components/auth/oauth-login"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, isAuthenticatedFn, isHydrated, getCookie } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOAuthCallback = async (accessToken: string, refreshToken: string) => {
    try {
      console.log("🔐 ===== OAUTH CALLBACK STARTED =====")
      console.log("📝 TOKENS RECEIVED:", {
        accessTokenLength: accessToken.length,
        refreshTokenLength: refreshToken.length,
        accessTokenStart: accessToken.substring(0, 20),
        refreshTokenStart: refreshToken.substring(0, 20),
      })

      setIsProcessing(true)
      setError(null)

      // Call setAuth - this should set cookies
      console.log("🚀 CALLING SETAUTH...")
      setAuth(accessToken, refreshToken)

      // Check cookies immediately after setAuth
      setTimeout(() => {
        const accessCookie = getCookie("accessToken")
        const refreshCookie = getCookie("refreshToken")
        const userCookie = getCookie("userProfile")

        console.log("🔍 COOKIES AFTER SETAUTH:", {
          accessToken: !!accessCookie,
          refreshToken: !!refreshCookie,
          userProfile: !!userCookie,
        })
      }, 50)

      // Clean URL parameters
      console.log("🧹 CLEANING URL...")
      window.history.replaceState({}, document.title, "/auth")

      toast.success("Successfully authenticated!")

      // Check auth status multiple times
      const checkAuthStatus = () => {
        const isAuth = isAuthenticatedFn()
        const accessCookie = getCookie("accessToken")
        const refreshCookie = getCookie("refreshToken")

        console.log("🔍 AUTH STATUS CHECK:", {
          isAuthenticated: isAuth,
          hasAccessCookie: !!accessCookie,
          hasRefreshCookie: !!refreshCookie,
        })

        return isAuth
      }

      // Check immediately
      setTimeout(() => {
        console.log("🔍 AUTH CHECK AT 100ms:")
        checkAuthStatus()
      }, 100)

      // Check again at 500ms
      setTimeout(() => {
        console.log("🔍 AUTH CHECK AT 500ms:")
        checkAuthStatus()
      }, 500)

      // Final check and redirect at 1000ms
      setTimeout(() => {
        console.log("🔍 FINAL AUTH CHECK AT 1000ms:")
        const isAuth = checkAuthStatus()

        if (isAuth) {
          console.log("✅ AUTHENTICATION SUCCESSFUL, REDIRECTING...")
          const redirectTo = sessionStorage.getItem("auth_redirect") || "/"
          sessionStorage.removeItem("auth_redirect")
          router.replace(redirectTo)
        } else {
          console.error("❌ AUTHENTICATION FAILED - NOT AUTHENTICATED AFTER SETAUTH")
          setError("Authentication failed - please try again")
        }

        setIsProcessing(false)
      }, 1000)
    } catch (error) {
      console.error("❌ OAUTH CALLBACK ERROR:", error)
      const errorMessage = error instanceof Error ? error.message : "Authentication failed"
      setError(errorMessage)
      toast.error(errorMessage)
      window.history.replaceState({}, document.title, "/auth")
      setIsProcessing(false)
    }
  }

  // Handle OAuth callback
  useEffect(() => {
    if (!isHydrated) {
      console.log("⏳ WAITING FOR HYDRATION...")
      return
    }

    console.log("🔍 CHECKING URL PARAMS...")
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    console.log("📋 URL PARAMS:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasError: !!error,
    })

    if (error) {
      const errorMessage = errorDescription || error || "Authentication failed"
      setError(errorMessage)
      toast.error(errorMessage)
      window.history.replaceState({}, document.title, "/auth")
      return
    }

    if (accessToken && refreshToken) {
      console.log("🎯 FOUND TOKENS IN URL, PROCESSING...")
      handleOAuthCallback(accessToken, refreshToken)
    } else {
      console.log("ℹ️ NO TOKENS IN URL")
    }
  }, [searchParams, isHydrated])

  // Redirect if already authenticated (but don't interfere during processing)
  useEffect(() => {
    if (isHydrated && isAuthenticatedFn() && !isProcessing) {
      console.log("🔄 USER ALREADY AUTHENTICATED, REDIRECTING...")
      const redirectTo = sessionStorage.getItem("auth_redirect") || "/"
      sessionStorage.removeItem("auth_redirect")
      router.replace(redirectTo)
    }
  }, [isHydrated, isAuthenticatedFn, isProcessing, router])

  const handleRetry = () => {
    setError(null)
    window.history.replaceState({}, document.title, "/auth")
  }

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Icons.spinner className="h-8 w-8 animate-spin mb-4" />
            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
            <p className="text-sm text-muted-foreground text-center">Initializing authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Icons.spinner className="h-8 w-8 animate-spin mb-4" />
            <h2 className="text-lg font-semibold mb-2">Completing authentication...</h2>
            <p className="text-sm text-muted-foreground text-center">Please wait while we set up your account.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.user className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Choose your preferred authentication method to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <Icons.alertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={handleRetry} className="ml-2 h-auto p-1">
                  <Icons.refresh className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <OAuthLogin />

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
