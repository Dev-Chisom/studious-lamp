import { defineStore } from 'pinia'

export const useCreatorsStore = defineStore('creators', {
  state: () => ({
    creators: [
      // Example creator
      {
        id: 1,
        displayName: 'Sarah Johnson',
        username: 'sarahj',
        bio: 'Fitness instructor and wellness coach.',
        categories: ['Fitness', 'Wellness'],
        contentDescription: 'Workout routines and nutrition plans.',
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        social: {
          instagram: 'sarahfit',
          twitter: 'sarahj',
          tiktok: 'sarahmoves'
        },
        isVerified: true
      }
    ]
  }),
  actions: {
    applyCreator(application) {
      this.creators.push({
        ...application,
        id: Date.now(),
        isVerified: false
      })
    },
    getByUsername(username) {
      return this.creators.find(c => c.username === username)
    }
  }
}) 