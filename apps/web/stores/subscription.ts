import { defineStore } from 'pinia';

export interface Creator {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  subscriberCount: number;
  postCount: number;
  monthlyPrice: number;
  yearlyPrice?: number;
  categories: string[];
  isVerified: boolean;
}

export interface Subscription {
  id: string;
  creatorId: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  price: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

interface SubscriptionState {
  creators: Creator[];
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    creators: [],
    subscriptions: [],
    loading: false,
    error: null
  }),

  getters: {
    getCreatorById: (state) => (id: string) => {
      return state.creators.find(creator => creator.id === id) || null;
    },
    
    getTopCreators: (state) => (limit = 10) => {
      return [...state.creators]
        .sort((a, b) => b.subscriberCount - a.subscriberCount)
        .slice(0, limit);
    },
    
    getSubscribedCreators: (state) => (userId: string) => {
      const subscriptionCreatorIds = state.subscriptions
        .filter(sub => sub.userId === userId && sub.isActive)
        .map(sub => sub.creatorId);
      
      return state.creators.filter(creator => subscriptionCreatorIds.includes(creator.id));
    },
    
    isSubscribed: (state) => (userId: string, creatorId: string) => {
      return state.subscriptions.some(
        sub => sub.userId === userId && sub.creatorId === creatorId && sub.isActive
      );
    }
  },

  actions: {
    async fetchCreators({ category, query } = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const url = new URL('/api/creators', window.location.origin);
        // if (category) url.searchParams.append('category', category);
        // if (query) url.searchParams.append('query', query);
        
        // const response = await fetch(url.toString());
        // const data = await response.json();
        
        // Simulate API response with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockCreators: Creator[] = [
          {
            id: '123',
            displayName: 'Jane Smith',
            username: 'janesmith',
            bio: 'Lifestyle content creator sharing daily vlogs and fitness tips.',
            profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
            coverImage: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            subscriberCount: 5243,
            postCount: 178,
            monthlyPrice: 9.99,
            yearlyPrice: 99.99,
            categories: ['Lifestyle', 'Fitness'],
            isVerified: true
          },
          {
            id: '456',
            displayName: 'Mike Johnson',
            username: 'mikejohnson',
            bio: 'Professional photographer sharing exclusive photo sessions and editing techniques.',
            profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
            subscriberCount: 8754,
            postCount: 312,
            monthlyPrice: 14.99,
            yearlyPrice: 149.99,
            categories: ['Photography'],
            isVerified: true
          },
          {
            id: '789',
            displayName: 'Alex Williams',
            username: 'alexwilliams',
            bio: 'Gamer and tech enthusiast sharing gaming tips and tech reviews.',
            profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
            coverImage: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            subscriberCount: 3298,
            postCount: 145,
            monthlyPrice: 7.99,
            yearlyPrice: 79.99,
            categories: ['Gaming', 'Technology'],
            isVerified: false
          }
        ];
        
        this.creators = mockCreators;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch creators';
      } finally {
        this.loading = false;
      }
    },

    async fetchUserSubscriptions(userId: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const response = await fetch(`/api/users/${userId}/subscriptions`);
        // const data = await response.json();
        
        // Simulate API response with mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockSubscriptions: Subscription[] = [
          {
            id: 'sub-1',
            creatorId: '123',
            userId,
            plan: 'monthly',
            price: 9.99,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            autoRenew: true
          }
        ];
        
        this.subscriptions = mockSubscriptions;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      } finally {
        this.loading = false;
      }
    },

    async subscribe(userId: string, creatorId: string, plan: 'monthly' | 'yearly') {
      this.loading = true;
      this.error = null;
      
      try {
        // Get creator data to determine price
        const creator = this.getCreatorById(creatorId);
        if (!creator) {
          throw new Error('Creator not found');
        }
        
        const price = plan === 'yearly' ? creator.yearlyPrice! : creator.monthlyPrice;
        
        // Mock API call - replace with actual API call
        // const response = await fetch('/api/subscriptions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ userId, creatorId, plan, price })
        // });
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const now = new Date();
        const endDate = new Date(now);
        if (plan === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        
        const newSubscription: Subscription = {
          id: `sub-${Math.random().toString(36).substring(2, 9)}`,
          creatorId,
          userId,
          plan,
          price,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          isActive: true,
          autoRenew: true
        };
        
        this.subscriptions.push(newSubscription);
        return newSubscription;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to subscribe';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelSubscription(subscriptionId: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // await fetch(`/api/subscriptions/${subscriptionId}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ autoRenew: false })
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const index = this.subscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index === -1) {
          throw new Error('Subscription not found');
        }
        
        this.subscriptions[index] = {
          ...this.subscriptions[index],
          autoRenew: false
        };
        
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to cancel subscription';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});