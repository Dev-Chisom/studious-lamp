import { defineStore } from 'pinia'
import { createContentApi } from '@whispers/api'
import type { Content } from '../types/content'

export const useContentStore = defineStore('content', {
	state: (): { content: Content[] } => ({
		content: [],
	}),

	actions: {
		async fetchContent() {
			const api = createContentApi()
			const response = await api.getContent()
			this.content = response.data
		},

		async deleteContent(id: string) {
			const api = createContentApi()
			await api.deleteContent(id)
			this.content = this.content.filter((item) => item.id !== id)
		},
	},
})
