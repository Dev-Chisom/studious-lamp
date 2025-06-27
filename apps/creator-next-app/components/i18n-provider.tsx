"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/lib/i18n"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Wait for i18n to be ready
        if (!i18n.isInitialized) {
          await i18n.init()
        }

        // Only normalize on client side
        if (typeof window !== "undefined") {
          const currentLang = i18n.language || "en"
          const supportedLanguages = ["en", "es", "fr"]
          const baseLang = currentLang.split("-")[0].toLowerCase()
          const normalizedLang = supportedLanguages.includes(baseLang) ? baseLang : "en"

          if (currentLang !== normalizedLang) {
            console.log(`I18nProvider: Normalizing ${currentLang} to ${normalizedLang}`)
            await i18n.changeLanguage(normalizedLang)
          }
        }

        setIsReady(true)
      } catch (error) {
        console.error("Failed to initialize i18n:", error)
        // Fallback to English
        if (typeof window !== "undefined") {
          await i18n.changeLanguage("en")
        }
        setIsReady(true)
      }
    }

    initializeI18n()
  }, [])

  // Don't show loading on server side to prevent hydration mismatch
  if (!isReady && typeof window !== "undefined") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
