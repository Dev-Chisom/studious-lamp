"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface OAuthButtonsProps {
  onError?: (error: string) => void
  redirectTo?: string
}

export function OAuthLogin({ onError, redirectTo = "/" }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: "google" | "twitter") => {
    try {
      setLoadingProvider(provider)

      // Store redirect URL in session storage
      if (redirectTo && redirectTo !== "/") {
        sessionStorage.setItem("auth_redirect", redirectTo)
      }

      // Redirect to external OAuth endpoint
      const oauthUrl = `https://x-z72i.onrender.com/auth/${provider}`
      console.log(`🔗 Redirecting to ${provider} OAuth:`, oauthUrl)

      window.location.href = oauthUrl
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error)
      const errorMessage = error instanceof Error ? error.message : `${provider} authentication failed`
      onError?.(errorMessage)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleOAuthLogin("google")}
        disabled={!!loadingProvider}
      >
        {loadingProvider === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleOAuthLogin("twitter")}
        disabled={!!loadingProvider}
      >
        {loadingProvider === "twitter" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.twitter className="mr-2 h-4 w-4" />
        )}
        Continue with Twitter
      </Button>
    </div>
  )
}
