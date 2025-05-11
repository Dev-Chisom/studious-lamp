import { defineStore } from 'pinia';

interface User {
	id: string
	email: string
	name: string
	avatar?: string
	walletBalance: number
	subscriptions: string[]
	collections: {
		id: string
		name: string
		posts: string[]
	}[]
}

export const useUserStore = defineStore('user', {
	state: () => ({
		user: null as User | null,
		loading: false,
		error: null as string | null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
		getWalletBalance: (state) => state.user?.walletBalance ?? 0,
		getSubscriptions: (state) => state.user?.subscriptions ?? [],
		getCollections: (state) => state.user?.collections ?? [],
	},

	actions: {
		fetchUser() {
			this.loading = true;
			try {
				const {
					data: { user },
				} = useFetch('/api/user');
				this.user = user;
			} catch (error: any) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},

		updateWalletBalance(amount: number) {
			if (this.user) {
				this.user.walletBalance = amount;
			}
		},

		addSubscription(creatorId: string) {
			if (this.user) {
				this.user.subscriptions.push(creatorId);
			}
		},

		removeSubscription(creatorId: string) {
			if (this.user) {
				this.user.subscriptions = this.user.subscriptions.filter((id) => id !== creatorId);
			}
		},

		addToCollection(collectionId: string, postId: string) {
			if (this.user) {
				const collection = this.user.collections.find((c) => c.id === collectionId);
				if (collection && !collection.posts.includes(postId)) {
					collection.posts.push(postId);
				}
			}
		},

		createCollection(name: string) {
			if (this.user) {
				const newCollection = {
					id: crypto.randomUUID(),
					name,
					posts: [],
				};
				this.user.collections.push(newCollection);
				return newCollection;
			}
		},
	},
});
