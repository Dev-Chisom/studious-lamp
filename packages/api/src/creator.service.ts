import { api } from './api.service';
import type { CreatorApplicationPayload } from './types/creator-apply.types';

export interface Creator {
	id: string
	name: string
	email: string
	bio?: string
	createdAt: Date
	updatedAt: Date
}

export interface CreatorPreference {
	_id: string
	discount: number
	cycle: string
	createdAt: string
	updatedAt: string
}

export interface MediaFile {
	_id: string;
	url: string;
	type: 'image' | 'video';
	ext: string;
	size: number;
	width: number;
	height: number;
	creator: string;
	status: 'active' | 'inactive';
	uploadStatus: 'pending' | 'uploaded' | 'failed';
	uploadStartedAt: string;
	uploadCompletedAt: string;
	coverUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface MediaFilesResponse {
	mediaFiles: MediaFile[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

interface ApiResponse {
	data: CreatorPreference[]
}

export function createCreatorApi() {
	return {
		createCreator: (creatorData: Partial<CreatorApplicationPayload>) => api.post('/creators', creatorData),
		getAllCreators: () => api.get<Creator[]>('/creators'),
		getCreatorById: (id: string) => api.get<Creator>(`/creator/${id}`),
		updateCreator: (id: string, creatorData: Partial<Creator>) => api.put<Creator>(`/creator/${id}`, creatorData),
		deleteCreator: (id: string) => api.del<void>(`/creator/${id}`),
		getCreatorPreferences: () => api.get<ApiResponse>('/preferences/pricing-models'),
		uploadMediaFile: (payload: { files: Array<{ uuid: string; fileName: string; fileType: string; size: number }> }) =>
			api.post<{ uploadUrl: string, fileKey: string, fileUrl: string, mediaFileId: string, status: string }>(
				'/media-files',
				payload
			),
		createPost: (data: { title: string, body: string, mediaFiles?: string[], visibility: string }) => api.post<any>('/posts', data),
		getMediaFiles: (params?: {
			page?: string;
			limit?: string;
			type?: 'image' | 'video';
			status?: 'active' | 'inactive';
			uploadStatus?: 'pending' | 'uploaded' | 'failed';
			search?: string;
		}) => api.get('/media-files', { params }),
	};
}
