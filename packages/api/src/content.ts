import { createApiClient } from './client';
import type { Content } from '@whispers/types';

export interface ContentApiResponse {
  data: Content[];
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