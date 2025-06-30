"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/lib/i18n"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(typeof window === "undefined" ? true : false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const initializeI18n = async () => {
      try {
        if (!i18n.isInitialized) {
          await i18n.init()
        }
        const currentLang = i18n.language || "en"
        const supportedLanguages = ["en", "es", "fr"]
        const baseLang = currentLang.split("-")[0].toLowerCase()
        const normalizedLang = supportedLanguages.includes(baseLang) ? baseLang : "en"
        if (currentLang !== normalizedLang) {
          await i18n.changeLanguage(normalizedLang)
        }
        setIsReady(true)
      } catch (error) {
        if (typeof window !== "undefined") {
          await i18n.changeLanguage("en")
        }
        setIsReady(true)
      }
    }
    initializeI18n()
  }, [])

  // Always render the provider, but optionally show a loading spinner on client if not ready
  if (typeof window !== "undefined" && !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
