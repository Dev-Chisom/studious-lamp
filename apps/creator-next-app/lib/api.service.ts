import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios"
import axios from "axios"
import { useAuthStore } from "./auth/auth-store"
import { ApiError } from "./api-types"

let BASE_URL = "https://x-zunk.onrender.com"

export function setApiBaseUrl(url: string) {
  BASE_URL = url
}

export function getApiBaseUrl() {
  return BASE_URL
}

export function createApiService(
  token?: string,
  refreshToken?: string,
  onTokenRefresh?: (newToken: string) => void,
  onAuthError?: () => void,
) {
  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  let isLoggingOut = false

  // Request interceptor to add token to every request
  api.interceptors.request.use(
    (config) => {
      // Get current token from auth store
      const { accessToken } = useAuthStore.getState()
      const currentToken = token || accessToken

      console.log("🌐 API REQUEST INTERCEPTOR:", {
        url: config.url,
        method: config.method,
        hasToken: !!currentToken,
        tokenStart: currentToken ? currentToken.substring(0, 20) + "..." : "none",
      })

      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`
        console.log("✅ Added Authorization header to request")
      } else {
        console.warn("⚠️ No token available for API request")
      }

      return config
    },
    (error) => {
      console.error("❌ Request interceptor error:", error)
      return Promise.reject(error)
    },
  )

  // Response interceptor for refresh logic
  api.interceptors.response.use(
    (response) => {
      console.log("✅ API RESPONSE SUCCESS:", {
        url: response.config.url,
        status: response.status,
      })
      return response
    },
    async (error: AxiosError) => {
      console.error("❌ API RESPONSE ERROR:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      })

      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry && !isLoggingOut) {
        originalRequest._retry = true

        console.log("🔄 Attempting token refresh...")

        try {
          // Get refresh token from auth store
          const { refreshToken: currentRefreshToken } = useAuthStore.getState()
          const refreshTokenToUse = refreshToken || currentRefreshToken

          if (!refreshTokenToUse) {
            console.error("❌ No refresh token available")
            throw new Error("No refresh token")
          }

          const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {
              refreshToken: refreshTokenToUse,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          )

          if (refreshResponse.data?.accessToken) {
            const newToken = refreshResponse.data.accessToken
            const newRefreshToken = refreshResponse.data.refreshToken || refreshTokenToUse

            console.log("✅ Token refresh successful")

            // Update tokens in auth store
            useAuthStore.getState().setAuth(newToken, newRefreshToken)

            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }

            if (onTokenRefresh) onTokenRefresh(newToken)

            return api(originalRequest)
          }
        } catch (refreshError) {
          console.error("❌ Token refresh failed:", refreshError)
          if (!isLoggingOut) {
            isLoggingOut = true
            useAuthStore.getState().clearAuth()
            if (onAuthError) onAuthError()
          }
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        if (!isLoggingOut) {
          isLoggingOut = true
          useAuthStore.getState().clearAuth()
          if (onAuthError) onAuthError()
        }
      }

      return Promise.reject(error)
    },
  )

  async function get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      console.log(`🌐 GET ${endpoint}`, { params })
      const response = await api.get<T>(endpoint, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      console.log(`🌐 POST ${endpoint}`, { hasData: !!data })
      const response = await api.post<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      console.log(`🌐 PUT ${endpoint}`, { hasData: !!data })
      const response = await api.put<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function del<T>(endpoint: string): Promise<T> {
    try {
      console.log(`🌐 DELETE ${endpoint}`)
      const response = await api.delete<T>(endpoint)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      console.log(`🌐 PATCH ${endpoint}`, { hasData: !!data })
      const response = await api.patch<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  function handleApiError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return new ApiError({
        message: error.response?.data?.message || error.message || "An error occurred",
        status: error.response?.status || 0,
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      })
    }

    return new ApiError({
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }

  function setToken(newToken: string) {
    console.log("🔑 Setting new token in API service")
    // Update the default authorization header
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
    if (onTokenRefresh) onTokenRefresh(newToken)
  }

  return {
    get,
    post,
    put,
    delete: del,
    patch,
    setToken,
  }
}

// Create the default API instance
export const api = createApiService()
