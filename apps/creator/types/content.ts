export interface Content {
	id: string
	title: string
	description: string
	thumbnail: string
	visibility: 'public' | 'private' | 'premium'
	views: number
	createdAt: string
}

export interface ContentStore {
	content: Content[]
	fetchContent: () => Promise<void>
	deleteContent: (id: string) => Promise<void>
}
