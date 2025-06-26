import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"

// Define supported languages
const SUPPORTED_LANGUAGES = ["en", "es", "fr"]

// Language normalization function
const normalizeLanguage = (lang: string): string => {
  if (!lang) return "en"

  // Extract base language (en-GB -> en, es-ES -> es, etc.)
  const baseLang = lang.split("-")[0].toLowerCase()

  // Return the base language if supported, otherwise default to English
  return SUPPORTED_LANGUAGES.includes(baseLang) ? baseLang : "en"
}

// Custom language detector that normalizes languages
const customLanguageDetector = {
  name: "customDetector",
  lookup() {
    // Try different detection methods in order
    const sources = [
      () => localStorage.getItem("i18nextLng"),
      () => document.cookie.match(/i18next=([^;]*)/)?.[1],
      () => navigator.language,
      () => navigator.languages?.[0],
    ]

    for (const source of sources) {
      try {
        const detected = source()
        if (detected) {
          const normalized = normalizeLanguage(detected)
          console.log(`Detected language: ${detected} -> normalized: ${normalized}`)
          return normalized
        }
      } catch (e) {
        // Continue to next source
      }
    }

    return "en" // Final fallback
  },
  cacheUserLanguage(lng: string) {
    const normalized = normalizeLanguage(lng)
    localStorage.setItem("i18nextLng", normalized)
    document.cookie = `i18next=${normalized}; path=/; max-age=${7 * 24 * 60 * 60}`
  },
}

i18n
  .use(Backend)
  .use({
    type: "languageDetector",
    init: () => {},
    detect: customLanguageDetector.lookup,
    cacheUserLanguage: customLanguageDetector.cacheUserLanguage,
  })
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    // Only these languages are supported
    supportedLngs: SUPPORTED_LANGUAGES,

    // Preload only supported languages
    preload: SUPPORTED_LANGUAGES,

    // Clean language codes and normalize
    load: "languageOnly",
    cleanCode: true,
    nonExplicitSupportedLngs: false, // Changed to false for stricter control

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/locales/{{lng}}.json",
      requestOptions: {
        cache: "default",
      },
    },

    // Use single namespace
    defaultNS: "translation",
    ns: ["translation"],

    // React specific options
    react: {
      useSuspense: false, // Disable suspense to avoid hydration issues
    },
  })

// Force normalize the current language on initialization
if (typeof window !== "undefined") {
  const currentLang = i18n.language || "en"
  const normalizedLang = normalizeLanguage(currentLang)

  if (currentLang !== normalizedLang) {
    console.log(`Forcing language change from ${currentLang} to ${normalizedLang}`)
    i18n.changeLanguage(normalizedLang)
  }
}

export default i18n
