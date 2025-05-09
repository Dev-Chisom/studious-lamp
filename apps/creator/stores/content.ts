import { defineStore } from 'pinia';

export interface Post {
  id: string;
  creatorId: string;
  title: string;
  content: string;
  mediaUrls: string[];
  visibility: 'public' | 'subscribers' | 'ppv';
  price?: number;
  likes: number;
  comments: number;
  createdAt: string;
  scheduledFor?: string;
}

interface ContentState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const useContentStore = defineStore('content', {
  state: (): ContentState => ({
    posts: [],
    loading: false,
    error: null
  }),

  getters: {
    getPostById: (state) => (id: string) => {
      return state.posts.find(post => post.id === id) || null;
    },
    
    getPostsByCreator: (state) => (creatorId: string) => {
      return state.posts.filter(post => post.creatorId === creatorId);
    },
    
    getPublicPosts: (state) => {
      return state.posts.filter(post => post.visibility === 'public');
    },
    
    getSubscriberPosts: (state) => (creatorId: string) => {
      return state.posts.filter(
        post => post.creatorId === creatorId && 
        (post.visibility === 'public' || post.visibility === 'subscribers')
      );
    }
  },

  actions: {
    async fetchPosts({ creatorId, visibility } = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const url = new URL('/api/posts', window.location.origin);
        // if (creatorId) url.searchParams.append('creatorId', creatorId);
        // if (visibility) url.searchParams.append('visibility', visibility);
        
        // const response = await fetch(url.toString());
        // const data = await response.json();
        
        // Simulate API response with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockPosts: Post[] = [
          {
            id: '1',
            creatorId: '123',
            title: 'Welcome to my page!',
            content: 'Thank you for supporting my content. Here\'s a special post just for my subscribers.',
            mediaUrls: ['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            visibility: 'public',
            likes: 120,
            comments: 23,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            creatorId: '123',
            title: 'Exclusive Content',
            content: 'This is premium content only for my subscribers. I hope you enjoy this exclusive post!',
            mediaUrls: [
              'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              'https://images.pexels.com/photos/4006576/pexels-photo-4006576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ],
            visibility: 'subscribers',
            likes: 85,
            comments: 17,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            creatorId: '123',
            title: 'Premium Masterclass',
            content: 'This masterclass video is available for a small fee. Unlock to access the full content.',
            mediaUrls: ['https://images.pexels.com/photos/5417678/pexels-photo-5417678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
            visibility: 'ppv',
            price: 9.99,
            likes: 45,
            comments: 8,
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        this.posts = mockPosts;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch posts';
      } finally {
        this.loading = false;
      }
    },

    async createPost(postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const response = await fetch('/api/posts', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(postData)
        // });
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newPost: Post = {
          ...postData,
          id: `post-${Math.random().toString(36).substring(2, 9)}`,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString()
        };
        
        this.posts.unshift(newPost);
        return newPost;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create post';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePost(id: string, postData: Partial<Post>) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // const response = await fetch(`/api/posts/${id}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(postData)
        // });
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) {
          throw new Error('Post not found');
        }
        
        const updatedPost = {
          ...this.posts[index],
          ...postData
        };
        
        this.posts[index] = updatedPost;
        return updatedPost;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update post';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - replace with actual API call
        // await fetch(`/api/posts/${id}`, {
        //   method: 'DELETE'
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) {
          throw new Error('Post not found');
        }
        
        this.posts.splice(index, 1);
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete post';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});