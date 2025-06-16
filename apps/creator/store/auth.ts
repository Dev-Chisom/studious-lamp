import { defineStore } from 'pinia';
import { createAuthApi } from '@whispers/api';
import { useCookie } from '#app';
import type { User } from '@/types';

export const useAuthStore = defineStore('user', {
	state: () => ({
		profile: null as null | User,
		accessToken: null as null | string,
		refreshToken: null as null | string,
	}),

	actions: {
		setProfile(profile: User) {
			this.profile = profile;
		},
		setTokens(accessToken: string, refreshToken: string) {
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;

			const accessTokenCookie = useCookie('accessToken', {
				maxAge: 60 * 60 * 24 * 7,
				sameSite: 'lax',
				secure: true,
			});
			const refreshTokenCookie = useCookie('refreshToken', {
				maxAge: 60 * 60 * 24 * 30,
				sameSite: 'lax',
				secure: true,
			});

			accessTokenCookie.value = accessToken;
			refreshTokenCookie.value = refreshToken;
		},

		async logout() {
			try {
				const accessTokenCookie = useCookie('accessToken');
				if (accessTokenCookie.value) {
					const authApi = createAuthApi(accessTokenCookie.value);
					await authApi.logout();
				}
			} catch (e) {
				console.log(e);
			}
			this.accessToken = null;
			this.refreshToken = null;
			this.profile = null;
			const accessTokenCookie = useCookie('accessToken');
			const refreshTokenCookie = useCookie('refreshToken');
			accessTokenCookie.value = null;
			refreshTokenCookie.value = null;

			if (typeof window !== 'undefined') {
				const authChannel = new BroadcastChannel('auth');
				authChannel.postMessage({ type: 'logout' });
				authChannel.close();
			}
		},

		hydrate() {
			const accessTokenCookie = useCookie('accessToken');
			const refreshTokenCookie = useCookie('refreshToken');

			this.accessToken = accessTokenCookie.value;
			this.refreshToken = refreshTokenCookie.value;
		},

		getAuthApi() {
			return createAuthApi(this.accessToken || undefined);
		},
	},

	getters: {
		isAuthenticated: (state) =>
			!!state.accessToken &&
			!!state.profile &&
			typeof state.profile === 'object' &&
			Object.keys(state.profile).length > 0,
	},
});
