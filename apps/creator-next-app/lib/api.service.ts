import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useAuthStore } from "./auth-store"
import { ApiError } from "./api-types"

let BASE_URL = 'https://x-zunk.onrender.com';

export function setApiBaseUrl(url: string) {
  BASE_URL = url;
}

export function getApiBaseUrl() {
  return BASE_URL;
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
      'Content-Type': 'application/json',
    },
    // Only include credentials if you need cookies
    // withCredentials: true,
  });

  let currentToken = token || useAuthStore.getState().accessToken;
  let isLoggingOut = false;

  // Set initial token if available
  if (currentToken) {
    api.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
  }

  function setToken(newToken: string) {
    currentToken = newToken;
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    if (onTokenRefresh) onTokenRefresh(newToken);
  }

  // Add response interceptor for refresh logic
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status === 401 && refreshToken && !originalRequest._retry && !isLoggingOut) {
        originalRequest._retry = true;
        
        try {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken
          }, {
            headers: { 'Content-Type': 'application/json' }
          });

          if (refreshResponse.data?.accessToken) {
            const newToken = refreshResponse.data.accessToken;
            setToken(newToken);
            
            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          if (!isLoggingOut) {
            isLoggingOut = true;
            if (onAuthError) onAuthError();
          }
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        if (!isLoggingOut) {
          isLoggingOut = true;
          if (onAuthError) onAuthError();
        }
      }
      
      return Promise.reject(error);
    },
  );

  async function get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await api.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function del<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  function handleApiError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return new ApiError({
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 0,
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      });
    }
    
    return new ApiError({
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }

  return { 
    get, 
    post, 
    put, 
    delete: del, 
    patch, 
    setToken 
  };
}

export const api = createApiService();