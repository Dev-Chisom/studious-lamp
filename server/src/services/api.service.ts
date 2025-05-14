import axios, { AxiosInstance } from 'axios';

export class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://x-zunk.onrender.com';

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access - please check your token');
        }
        return Promise.reject(error);
      }
    );
  }

  // Method to update the token
  setToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Generic GET method
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params });
    return response.data;
  }

  // Generic POST method
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  // Generic PUT method
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    return response.data;
  }

  // Generic DELETE method
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    return response.data;
  }
} 