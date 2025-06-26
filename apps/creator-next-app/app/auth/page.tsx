"use client"

import { useEffect, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

import { useAuthStore } from "@/lib/auth-store"
import { useLogin } from "@/lib/api-hooks"
import OAuthLogin from "@/components/auth/OAuthLogin"

function LoginLogic() {
  const { t } = useTranslation("auth")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const loginMutation = useLogin()

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/")
      return
    }

    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")

    if (accessToken) {
      loginMutation.mutate({ accessToken, refreshToken })
      router.replace("/auth", { scroll: false })
    }
  }, [isAuthenticated, router, searchParams, loginMutation])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg?width=48&height=48" alt="Logo" width={48} height={48} className="mb-2" />
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{t("auth.signInTitle")}</h2>
        </div>
        <OAuthLogin loading={loginMutation.isPending} />

        {loginMutation.isPending && <div className="text-center text-sm text-gray-600">{t("auth.processingLogin")}</div>}

        {loginMutation.error && (
          <div className="text-center text-sm text-red-600">
            {t("auth.loginFailed", { error: loginMutation.error.message })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  const { t } = useTranslation("common")

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div>{t("loading")}</div>
        </div>
      }
    >
      <LoginLogic />
    </Suspense>
  )
}
