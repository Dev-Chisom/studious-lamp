import { createApiClient } from './client';

export interface ContentApiResponse {
  data: [];
}

export interface ContentApi {
  getContent: () => Promise<ContentApiResponse>;
  deleteContent: (id: string) => Promise<void>;
}

export function createContentApi(): ContentApi {
	const client = createApiClient();

	return {
		async getContent() {
			const response = await client.get('/api/content');
			return response.data;
		},

		async deleteContent(id: string) {
			await client.delete(`/api/content/${id}`);
		}
	};
} 