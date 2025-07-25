import axios from 'axios';

export function createApiClient() {
	return axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
