import { defineStore } from 'pinia'
import { createContentApi } from '@whispers/api'
import type { Content, ContentListResponse } from '@whispers/api'

export interface ContentQuery {
	page?: number
	limit?: number
	status?: string
	visibility?: 'public' | 'private' | 'premium'
	search?: string
}

export const useContentStore = defineStore('content', {
	state: (): { content: ContentListResponse | null } => ({
		content: null,
	}),

	actions: {
		// In your content store
		async fetchContent(params?: ContentQuery) {
			try {
				const api = createContentApi()
				const response = await api.getAllPosts(params)
				this.content = response.data
			} catch (error) {
				console.error('Failed to fetch content:', error)
				throw error
			}
		},

		async deleteContent(id: string) {
			const api = createContentApi()
			await api.deletePost(id)
			if (this.content) {
				this.content.posts = this.content.posts.filter((item) => item._id !== id)
			}
		},
	},
})
