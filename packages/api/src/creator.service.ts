import { createApiService } from './api.service';

export interface Creator {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createCreatorApi(token?: string) {
  const api = createApiService(token);

  return {
    setToken: api.setToken,
    getAllCreators: () => api.get<Creator[]>('/creator'),
    getCreatorById: (id: string) => api.get<Creator>(`/creator/${id}`),
    createCreator: (creatorData: Partial<Creator>) => api.post<Creator>('/creator', creatorData),
    updateCreator: (id: string, creatorData: Partial<Creator>) => api.put<Creator>(`/creator/${id}`, creatorData),
    deleteCreator: (id: string) => api.del<void>(`/creator/${id}`),
  };
} 