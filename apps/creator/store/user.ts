import { defineStore } from 'pinia';
import { createAuthApi } from '@whispers/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletBalance: number;
  isCreator: boolean;
  subscriptions: string[];
  collections: {
    id: string;
    name: string;
    posts: string[];
  }[];
}

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchProfile(accessToken: string) {
      this.loading = true;
      try {
        const authApi = createAuthApi(accessToken);
        this.profile = await authApi.getProfile();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateWalletBalance(amount: number) {
      if (this.profile) {
        this.profile.walletBalance = amount;
      }
    }
  },

  getters: {
    isCreator: (state) => state.profile?.isCreator || false,
    getWalletBalance: (state) => state.profile?.walletBalance ?? 0,
		getSubscriptions: (state) => state.profile?.subscriptions ?? [],
		getCollections: (state) => state.profile?.collections ?? [],
  }
});