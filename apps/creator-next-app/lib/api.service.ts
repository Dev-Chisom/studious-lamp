import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios"
import axios from "axios"

// Environment-based configuration for Next.js
let BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://x-zunk.onrender.com"

// For development, you might want to use a local API
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_API_URL) {
  BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL
}

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
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  let currentToken = token
  let isLoggingOut = false

  function setToken(newToken: string) {
    currentToken = newToken
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
    if (onTokenRefresh) onTokenRefresh(newToken)
  }

  // Add response interceptor for refresh logic
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
      if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          // Import auth API dynamically to avoid circular dependencies
          const { createAuthApi } = await import("./auth-api")
          const authApi = createAuthApi()
          const data = await authApi.refreshToken(refreshToken)
          if (data?.accessToken) {
            setToken(data.accessToken)
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${data.accessToken}`,
            }
            return api(originalRequest)
          }
        } catch (refreshError) {
          if (!isLoggingOut) {
            isLoggingOut = true
            if (onAuthError) onAuthError()
          }
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        if (!isLoggingOut) {
          isLoggingOut = true
          if (onAuthError) onAuthError()
        }
      }
      return Promise.reject(error)
    },
  )

  async function get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await api.get<T>(endpoint, { params })
    return response.data
  }

  async function post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.post<T>(endpoint, data)
    return response.data
  }

  async function put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.put<T>(endpoint, data)
    return response.data
  }

  async function del<T>(endpoint: string): Promise<T> {
    const response = await api.delete<T>(endpoint)
    return response.data
  }

  async function patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.patch<T>(endpoint, data)
    return response.data
  }

  return { get, post, put, del, patch, setToken }
}

// Default API instance (can be used for public endpoints)
export const api = createApiService()
