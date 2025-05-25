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
