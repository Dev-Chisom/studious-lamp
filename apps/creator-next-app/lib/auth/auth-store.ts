import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"

interface User {
  _id: string
  createdAt: string
  updatedAt: string
  email: string
  name: string
  provider: string
  providerId: string
  refreshToken: string
  status: string
  creatorProfile?: any
  referralCode?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isHydrated: boolean
}

interface AuthActions {
  setAuth: (accessToken: string, refreshToken: string, user?: User) => void
  setUser: (user: User) => void
  logout: () => void
  clearAuth: () => void
  setHydrated: () => void
  syncWithCookies: () => void
  isAuthenticatedFn: () => boolean
  getSubscriptions: () => string[]
  setCookie: (name: string, value: string, days?: number) => void
  getCookie: (name: string) => string | null
  deleteCookie: (name: string) => void
}

type AuthStore = AuthState & AuthActions

interface JWTPayload {
  userId: string
  iat: number
  exp: number
}

// Improved cookie utilities with better error handling
const setCookie = (name: string, value: string, days = 30) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("🍪 Cannot set cookie - not in browser environment")
    return false
  }

  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    // Use a simpler cookie format
    const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`

    console.log(`🍪 SETTING COOKIE ${name}:`, {
      name,
      valueLength: value.length,
      expires: expires.toUTCString(),
      cookieString: cookieString.substring(0, 100) + "...",
    })

    document.cookie = cookieString

    // Immediate verification
    const verification = document.cookie.includes(`${name}=`)
    console.log(`🔍 IMMEDIATE COOKIE VERIFICATION for ${name}:`, verification)

    return verification
  } catch (error) {
    console.error(`❌ ERROR SETTING COOKIE ${name}:`, error)
    return false
  }
}

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null
  }

  try {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length))
        console.log(`🍪 RETRIEVED COOKIE ${name}:`, value.substring(0, 20) + "...")
        return value
      }
    }
    console.log(`🍪 COOKIE ${name} NOT FOUND`)
    return null
  } catch (error) {
    console.error(`❌ ERROR GETTING COOKIE ${name}:`, error)
    return null
  }
}

const deleteCookie = (name: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return
  }

  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
    console.log(`🗑️ DELETED COOKIE: ${name}`)

    // Verify deletion
    const stillExists = document.cookie.includes(`${name}=`)
    console.log(`🔍 COOKIE ${name} STILL EXISTS AFTER DELETION:`, stillExists)
  } catch (error) {
    console.error(`❌ ERROR DELETING COOKIE ${name}:`, error)
  }
}

const getUserFromToken = (accessToken: string): User => {
  try {
    const decoded = jwtDecode<JWTPayload>(accessToken)
    console.log("🔍 DECODED JWT:", decoded)
    return {
      _id: decoded.userId,
      createdAt: "",
      updatedAt: "",
      email: "", // Will be filled by profile API call
      name: "", // Will be filled by profile API call
      provider: "",
      providerId: "",
      refreshToken: "",
      status: "active",
      creatorProfile: undefined,
      referralCode: undefined,
    }
  } catch (error) {
    console.error("❌ FAILED TO DECODE JWT:", error)
    throw new Error("Invalid access token")
  }
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    console.log("🔍 TOKEN VALIDATION: No token provided")
    return false
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    const isValid = decoded && decoded.exp && decoded.exp > currentTime

    console.log("🔍 TOKEN VALIDATION:", {
      hasDecoded: !!decoded,
      exp: decoded?.exp,
      currentTime,
      isValid,
      timeUntilExpiry: decoded?.exp ? decoded.exp - currentTime : 0,
    })

    return isValid
  } catch (error) {
    console.error("❌ TOKEN VALIDATION ERROR:", error)
    return false
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (accessToken, refreshToken, user) => {
        console.log("🔐 ===== SETAUTH CALLED =====")
        console.log("📝 TOKENS RECEIVED:", {
          hasAccessToken: !!accessToken,
          accessTokenLength: accessToken?.length,
          hasRefreshToken: !!refreshToken,
          refreshTokenLength: refreshToken?.length,
          hasUser: !!user,
        })

        // Add stack trace to see who called setAuth
        console.log("📍 SETAUTH CALLED FROM:", new Error().stack)

        // Validate token before setting
        if (!isTokenValid(accessToken)) {
          console.error("❌ INVALID TOKEN - CALLING CLEARAUTH")
          get().clearAuth()
          return
        }

        // If no user provided, create minimal user from JWT
        let userData = user
        if (!userData) {
          try {
            userData = getUserFromToken(accessToken)
            console.log("📝 CREATED USER FROM JWT:", userData)
          } catch (error) {
            console.error("❌ FAILED TO CREATE USER - CALLING CLEARAUTH")
            get().clearAuth()
            return
          }
        }

        console.log("💾 SETTING AUTH STATE IN ZUSTAND...")

        // Set in Zustand store first
        set({
          accessToken,
          refreshToken,
          user: userData,
          isAuthenticated: true,
        })

        console.log("🍪 SETTING COOKIES...")

        // Set cookies with verification
        const accessCookieSet = setCookie("accessToken", accessToken, 7)
        const refreshCookieSet = setCookie("refreshToken", refreshToken, 30)
        const userCookieSet = setCookie("userProfile", JSON.stringify(userData), 7)

        console.log("🔍 COOKIE SETTING RESULTS:", {
          accessCookieSet,
          refreshCookieSet,
          userCookieSet,
        })

        // Verify all cookies are set
        setTimeout(() => {
          const accessCheck = getCookie("accessToken")
          const refreshCheck = getCookie("refreshToken")
          const userCheck = getCookie("userProfile")

          console.log("🔍 COOKIE VERIFICATION AFTER 100ms:", {
            accessToken: !!accessCheck,
            refreshToken: !!refreshCheck,
            userProfile: !!userCheck,
          })
        }, 100)

        console.log("✅ SETAUTH COMPLETED SUCCESSFULLY")

        // Log current state
        const currentState = get()
        console.log("📊 CURRENT AUTH STATE:", {
          hasUser: !!currentState.user,
          hasAccessToken: !!currentState.accessToken,
          isAuthenticated: currentState.isAuthenticated,
        })
      },

      setUser: (user: User) => {
        console.log("👤 SETTING USER:", user)
        set({ user })
        setCookie("userProfile", JSON.stringify(user), 7)
      },

      logout: () => {
        console.log("🚪 ===== LOGOUT CALLED =====")
        console.log("📍 LOGOUT CALLED FROM:", new Error().stack)

        // Delete cookies first
        deleteCookie("accessToken")
        deleteCookie("refreshToken")
        deleteCookie("userProfile")

        // Clear state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      clearAuth: () => {
        console.log("🧹 ===== CLEARAUTH CALLED =====")
        console.log("📍 CLEARAUTH CALLED FROM:", new Error().stack)

        // Delete cookies first
        deleteCookie("accessToken")
        deleteCookie("refreshToken")
        deleteCookie("userProfile")

        // Clear state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      setHydrated: () => {
        console.log("💧 SETTING HYDRATED TO TRUE")
        set({ isHydrated: true })
      },

      syncWithCookies: () => {
        console.log("🔄 ===== SYNC WITH COOKIES CALLED =====")
        console.log("📍 SYNC CALLED FROM:", new Error().stack)

        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        const userProfile = getCookie("userProfile")

        console.log("🔍 FOUND COOKIES:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUserProfile: !!userProfile,
        })

        if (accessToken && refreshToken) {
          const tokenIsValid = isTokenValid(accessToken)
          console.log("🔍 TOKEN VALIDITY CHECK:", tokenIsValid)

          if (tokenIsValid) {
            let user = null
            if (userProfile) {
              try {
                user = JSON.parse(decodeURIComponent(userProfile))
                console.log("📝 PARSED USER FROM COOKIE:", user)
              } catch (error) {
                console.error("❌ FAILED TO PARSE USER PROFILE FROM COOKIE:", error)
              }
            }

            if (!user) {
              try {
                user = getUserFromToken(accessToken)
                console.log("📝 CREATED USER FROM TOKEN:", user)
              } catch (error) {
                console.error("❌ FAILED TO CREATE USER FROM TOKEN - CALLING CLEARAUTH")
                get().clearAuth()
                return
              }
            }

            set({
              accessToken,
              refreshToken,
              user,
              isAuthenticated: true,
            })

            console.log("✅ SYNCED AUTH STATE FROM COOKIES")
          } else {
            console.log("❌ INVALID TOKEN - CALLING CLEARAUTH")
            get().clearAuth()
          }
        } else {
          console.log("❌ NO VALID TOKENS IN COOKIES - CALLING CLEARAUTH")
          get().clearAuth()
        }
      },

      isAuthenticatedFn: () => {
        const state = get()
        const tokenValid = state.accessToken ? isTokenValid(state.accessToken) : false
        const isAuth = state.isAuthenticated && !!state.accessToken && !!state.user && tokenValid

        console.log("🔍 ISAUTHENTICATED CHECK:", {
          isAuthenticated: state.isAuthenticated,
          hasAccessToken: !!state.accessToken,
          hasUser: !!state.user,
          tokenValid,
          result: isAuth,
        })

        return isAuth
      },

      getSubscriptions: () => {
        // Mock subscriptions for now - replace with actual API call later
        console.log("📋 Getting user subscriptions (mock data)")
        return ["creator1", "creator2", "fil-1", "fil-2"]
      },

      setCookie,
      getCookie,
      deleteCookie,
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        console.log("💧 ===== HYDRATING AUTH STORE =====")
        if (state) {
          state.setHydrated()
        }
      },
    },
  ),
)
