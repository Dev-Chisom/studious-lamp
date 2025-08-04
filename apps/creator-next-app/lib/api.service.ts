import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios"
import axios from "axios"
import { useAuthStore } from "./auth/auth-store"
import { ApiError } from "./api-types"

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

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

  const currentToken = token || useAuthStore.getState().accessToken
  let isLoggingOut = false

  // Request interceptor to add token to every request
  api.interceptors.request.use(
    (config) => {
      // Get the latest token from auth store
      const latestToken = useAuthStore.getState().accessToken

      if (latestToken) {
        config.headers.Authorization = `Bearer ${latestToken}`
        console.log(`🔑 API REQUEST: Adding token to ${config.method?.toUpperCase()} ${config.url}`, {
          hasToken: !!latestToken,
          tokenLength: latestToken.length,
          url: config.url,
        })
      } else {
        console.log(`⚠️ API REQUEST: No token available for ${config.method?.toUpperCase()} ${config.url}`)
      }

      return config
    },
    (error) => {
      console.error("❌ REQUEST INTERCEPTOR ERROR:", error)
      return Promise.reject(error)
    },
  )

  // Response interceptor for refresh logic
  api.interceptors.response.use(
    (response) => {
      console.log(
        `✅ API RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
        {
          status: response.status,
          url: response.config.url,
        },
      )
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      console.error(
        `❌ API ERROR: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - ${error.response?.status}`,
        {
          status: error.response?.status,
          url: originalRequest.url,
          message: error.message,
        },
      )

      if (error.response?.status === 401 && refreshToken && !originalRequest._retry && !isLoggingOut) {
        originalRequest._retry = true

        console.log("🔄 Attempting token refresh...")

        try {
          const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          )

          if (refreshResponse.data?.accessToken) {
            const newToken = refreshResponse.data.accessToken
            const newRefreshToken = refreshResponse.data.refreshToken || refreshToken

            console.log("✅ Token refresh successful")

            // Update auth store with new tokens
            useAuthStore.getState().setAuth(newToken, newRefreshToken)

            if (onTokenRefresh) onTokenRefresh(newToken)

            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }

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
          console.log("🚪 Clearing auth due to 401/403 error")
          useAuthStore.getState().clearAuth()
          if (onAuthError) onAuthError()
        }
      }

      return Promise.reject(error)
    },
  )

  async function get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await api.get<T>(endpoint, { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.post<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.put<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function del<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.delete<T>(endpoint)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async function patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
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

  return {
    get,
    post,
    put,
    delete: del,
    patch,
  }
}

// Create default API instance
export const api = createApiService(
  undefined,
  undefined,
  (newToken) => {
    console.log("🔄 Token refreshed via API service")
  },
  () => {
    console.log("🚪 Auth error - redirecting to login")
    if (typeof window !== "undefined") {
      window.location.href = "/auth"
    }
  },
)
