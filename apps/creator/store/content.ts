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
	state: (): { content: ContentListResponse | null, loading: boolean } => ({
		content: null,
		loading: false,
	}),

	actions: {
		// In your content store
		async fetchContent(params?: ContentQuery) {
			this.loading = true
			const api = createContentApi()
			const response = await api.getAllPosts(params)
			this.content = response.data
			this.loading = false
		},

		async updateContent(id: string, data: Partial<Content>) {
			const api = createContentApi()
			const updated = await api.updateContent(id, data)
			if (this.content) {
				const idx = this.content.posts.findIndex((p) => p._id === id)
				if (idx !== -1) this.content.posts[idx] = updated
			}
			return updated
		},

		async deleteContent(id: string) {
			const api = createContentApi()
			await api.deletePost(id)
			if (this.content) {
				this.content.posts = this.content.posts.filter((item) => item._id !== id)
			}
		},

		async getContentById(id: string) {
			const api = createContentApi()
			return await api.getPostById(id)
		},
	},
})
