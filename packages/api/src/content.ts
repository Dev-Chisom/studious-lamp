import { api } from './api.service';

export interface ContentMetadata {
	tags: string[]
	categories: string[]
	likes: string[]
	views: number
	shares: number
}

export interface Content {
	_id: string
	title: string
	body: string
	mediaFiles: string[]
	creator: string
	status: string
	visibility: 'public' | 'private' | 'premium'
	price: number
	metadata: ContentMetadata
	createdAt: string
	updatedAt: string
}

export interface ContentListResponse {
	posts: Content[]
	pagination: {
		page: number
		limit: number
		total: number
		pages: number
	}
}

export interface ContentListParams {
	page?: number
	limit?: number
	search?: string
	visibility?: 'public' | 'private' | 'premium'
}

export function createContentApi() {
	return {
		getAllPosts: (params?: Record<string, any>) =>
			api.get<{ success: boolean; data: ContentListResponse; message: string }>('/posts', params),
		getPostById: (id: string) => api.get<Content>(`/posts/${id}`),
		createPost: (data: {
			title: string
			body: string
			mediaFiles?: string[]
			visibility: 'public' | 'private' | 'premium'
			price?: number
			scheduledDate?: string
		}) => api.post<Content>('/posts', data),
		updateContent: (id: string, data: Partial<Content>) => api.put<Content>(`/posts/${id}`, data),
		deletePost: (id: string) => api.del<void>(`/posts/${id}`),
	};
}
