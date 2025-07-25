import { defineStore } from 'pinia';

export interface User {
	id: string
	email: string
	displayName: string
	profileImage?: string
	isCreator: boolean
	createdAt: string
}

interface AuthState {
	user: User | null
	token: string | null
	loading: boolean
	error: string | null
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		user: null,
		token: null,
		loading: false,
		error: null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,
		isCreator: (state) => state.user?.isCreator || false,
	},

	actions: {
		initAuth() {
			// Initialize auth from localStorage
			try {
				const token = localStorage.getItem('token');
				const userData = localStorage.getItem('user');

				if (token && userData) {
					this.token = token;
					this.user = JSON.parse(userData);
				}
			} catch (error) {
				console.log('Failed to initialize auth from localStorage', error);
			}
		},

		login(email: string, password: string, remember: boolean = false) {
			this.loading = true;
			this.error = null;

			try {
				if (email === 'demo@example.com' && password === 'password') {
					const userData: User = {
						id: '123',
						email: 'demo@example.com',
						displayName: 'Demo User',
						isCreator: false,
						createdAt: new Date().toISOString(),
					};

					const token = 'mock-jwt-token';

					this.setAuth(userData, token);

					if (remember) {
						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(userData));
					}

					return true;
				} else {
					throw new Error('Invalid email or password');
				}
			} catch (error) {
				this.error = error instanceof Error ? error.message : 'Authentication failed';
				return false;
			} finally {
				this.loading = false;
			}
		},

		register(userData: { email: string; password: string; displayName: string }) {
			this.loading = true;
			this.error = null;

			try {
				const newUser: User = {
					id: `user-${Math.random().toString(36).substring(2, 9)}`,
					email: userData.email,
					displayName: userData.displayName,
					isCreator: false,
					createdAt: new Date().toISOString(),
				};

				const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 9)}`;

				this.setAuth(newUser, token);
				localStorage.setItem('token', token);
				localStorage.setItem('user', JSON.stringify(newUser));

				return true;
			} catch (error) {
				this.error = error instanceof Error ? error.message : 'Registration failed';
				return false;
			} finally {
				this.loading = false;
			}
		},

		forgotPassword(email: string) {
			this.loading = true;
			this.error = null;

			try {
				console.log('Password reset email sent to', email);
				return true;
			} catch (error) {
				this.error = error instanceof Error ? error.message : 'Failed to send password reset email';
				return false;
			} finally {
				this.loading = false;
			}
		},

		resetPassword(token: string) {
			this.loading = true;
			this.error = null;

			try {
				return true;
			} catch (error) {
				this.error = error instanceof Error ? error.message : 'Failed to reset password';
				return false;
			} finally {
				this.loading = false;
			}
		},

		setAuth(user: User, token: string) {
			this.user = user;
			this.token = token;
		},

		logout() {
			this.user = null;
			this.token = null;
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		},
	},
});
