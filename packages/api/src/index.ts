import axios from 'axios';

export class ApiClient {
	private baseURL: string;
	private token?: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	setToken(token: string) {
		this.token = token;
	}

	private get headers() {
		return {
			'Content-Type': 'application/json',
			...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
		};
	}

	async get<T>(path: string, params?: Record<string, any>) {
		const response = await axios.get<T>(`${this.baseURL}${path}`, {
			headers: this.headers,
			params,
		});
		return response.data;
	}

	async post<T>(path: string, data?: any) {
		const response = await axios.post<T>(`${this.baseURL}${path}`, data, {
			headers: this.headers,
		});
		return response.data;
	}

	async put<T>(path: string, data?: any) {
		const response = await axios.put<T>(`${this.baseURL}${path}`, data, {
			headers: this.headers,
		});
		return response.data;
	}

	async delete<T>(path: string) {
		const response = await axios.delete<T>(`${this.baseURL}${path}`, {
			headers: this.headers,
		});
		return response.data;
	}
}

// Export a singleton instance
export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');

export * from './auth';
export * from './api.service';
export * from './creator.service';
