"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Chrome, Twitter } from "lucide-react"
import { getOAuthUrl } from "@/lib/auth-api"
import { cn } from "@/lib/utils"

interface OAuthButtonsProps {
  loading?: boolean
  className?: string
}

export default function OAuthLogin({ loading: parentLoading = false, className }: OAuthButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [twitterLoading, setTwitterLoading] = useState(false)

  const handleLoginWithGoogle = () => {
    if (!parentLoading && !googleLoading) {
      console.log("🔐 Starting Google OAuth flow")
      setGoogleLoading(true)

      try {
        // Add current URL as redirect parameter so OAuth can return here
        const redirectUri = `${window.location.origin}/auth`
        const oauthUrl = `${getOAuthUrl("google")}?redirect_uri=${encodeURIComponent(redirectUri)}`
        console.log("🔐 Redirecting to:", oauthUrl)
        window.location.href = oauthUrl
      } catch (error) {
        console.error("🔐 Failed to get OAuth URL:", error)
        setGoogleLoading(false)
      }
    }
  }

  const handleLoginWithTwitter = () => {
    if (!parentLoading && !twitterLoading) {
      console.log("🔐 Starting Twitter OAuth flow")
      setTwitterLoading(true)

      try {
        // Add current URL as redirect parameter so OAuth can return here
        const redirectUri = `${window.location.origin}/auth`
        const oauthUrl = `${getOAuthUrl("x")}?redirect_uri=${encodeURIComponent(redirectUri)}`
        console.log("🔐 Redirecting to:", oauthUrl)
        window.location.href = oauthUrl
      } catch (error) {
        console.error("🔐 Failed to get OAuth URL:", error)
        setTwitterLoading(false)
      }
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Button
        variant="outline"
        className="w-full"
        disabled={parentLoading || googleLoading}
        onClick={handleLoginWithGoogle}
      >
        {googleLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Chrome className="h-5 w-5 mr-2" />}
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={parentLoading || twitterLoading}
        onClick={handleLoginWithTwitter}
      >
        {twitterLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Twitter className="h-5 w-5 mr-2" />}
        Continue with Twitter
      </Button>
    </div>
  )
}
