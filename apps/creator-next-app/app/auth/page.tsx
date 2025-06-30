"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/ui/icons"
import { OAuthLogin } from "@/components/auth/oauth-login"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth, isAuthenticated } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingRedirect, setPendingRedirect] = useState(false)

  // Handle OAuth callback and set auth state
  useEffect(() => {
    // If user is already authenticated, set pending redirect
    if (isAuthenticated()) {
      setPendingRedirect(true)
      return
    }

    // Check for OAuth tokens in URL parameters
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (error) {
      const errorMessage = errorDescription || error || "Authentication failed"
      setError(errorMessage)
      toast.error(errorMessage)
      // Clean URL parameters
      window.history.replaceState({}, document.title, "/auth")
      return
    }

    if (accessToken && refreshToken) {
      handleOAuthCallback(accessToken, refreshToken)
    }
  }, [searchParams, isAuthenticated])

  // Redirect after authentication state is updated
  useEffect(() => {
    if (isAuthenticated() && pendingRedirect) {
      const redirectTo = sessionStorage.getItem("auth_redirect") || "/"
      sessionStorage.removeItem("auth_redirect")
      window.history.replaceState({}, document.title, "/auth")
      router.replace(redirectTo)
      setPendingRedirect(false)
    }
  }, [isAuthenticated, pendingRedirect, router])

  const handleOAuthCallback = async (accessToken: string, refreshToken: string) => {
    try {
      setIsProcessing(true)
      setError(null)
      setAuth(accessToken, refreshToken)
      setPendingRedirect(true)
      toast.success("Successfully authenticated!")
    } catch (error) {
      console.error("❌ OAuth callback error:", error)
      const errorMessage = error instanceof Error ? error.message : "Authentication failed"
      setError(errorMessage)
      toast.error(errorMessage)
      window.history.replaceState({}, document.title, "/auth")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    window.history.replaceState({}, document.title, "/auth")
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
            <img src="/logo.svg" alt="Logo" className="h-12 w-12 mb-4" />
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

          <OAuthLogin onError={setError} redirectTo={searchParams.get("redirect") || "/"} />

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
