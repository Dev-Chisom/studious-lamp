import { defineStore } from 'pinia';

export interface User {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string;
  isCreator: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isCreator: (state) => state.user?.isCreator || false
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
        console.error('Failed to initialize auth from localStorage', error);
      }
    },

    async login(email: string, password: string, remember: boolean = false) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password })
        // });
        
        // Simulate API call
        if (email === 'demo@example.com' && password === 'password') {
          // Mock successful login
          const userData: User = {
            id: '123',
            email: 'demo@example.com',
            displayName: 'Demo User',
            isCreator: false,
            createdAt: new Date().toISOString()
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

    async register(userData: { email: string; password: string; displayName: string }) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(userData)
        // });
        
        // Simulate API call
        // Mock successful registration
        const newUser: User = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          email: userData.email,
          displayName: userData.displayName,
          isCreator: false,
          createdAt: new Date().toISOString()
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

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // await fetch('/api/auth/forgot-password', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email })
        // });
        
        // Simulate API call
        console.log('Password reset email sent to', email);
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to send password reset email';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // await fetch('/api/auth/reset-password', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token, newPassword })
        // });
        
        // Simulate API call
        console.log('Password reset successfully with token', token);
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
    }
  }
});