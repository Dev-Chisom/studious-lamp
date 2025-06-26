"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Loader2, Chrome, Twitter } from "lucide-react"
import { getOAuthUrl } from "@/lib/auth-api" // Updated: Use the correct import
import { cn } from "@/lib/utils"

interface OAuthButtonsProps {
  loading?: boolean
  className?: string
}

export default function OAuthLogin({ loading: parentLoading = false, className }: OAuthButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [twitterLoading, setTwitterLoading] = useState(false)
  const { t } = useTranslation("auth")

  const handleLoginWithGoogle = () => {
    if (!parentLoading && !googleLoading) {
      setGoogleLoading(true)
      // Updated: Use the real OAuth URL from your API
      window.location.href = getOAuthUrl("google")
    }
  }

  const handleLoginWithTwitter = () => {
    if (!parentLoading && !twitterLoading) {
      setTwitterLoading(true)
      // Updated: Use the real OAuth URL from your API
      window.location.href = getOAuthUrl("x")
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
        {t("auth.continueWithGoogle")}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={parentLoading || twitterLoading}
        onClick={handleLoginWithTwitter}
      >
        {twitterLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Twitter className="h-5 w-5 mr-2" />}
        {t("auth.continueWithTwitter")}
      </Button>
    </div>
  )
}
