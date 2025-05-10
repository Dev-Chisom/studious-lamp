<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Feed -->
      <div class="lg:col-span-2">
        <div class="space-y-6">
          <div v-for="post in posts" :key="post.id">
            <PostCard 
              :post="post"
              :is-subscribed="isSubscribedToCreator(post.creator.id)"
              @subscribe="subscribeToCreator(post.creator.id)"
              @tip="showTipModal(post)"
            />
          </div>
        </div>
      </div>
      <!-- Suggestions Panel -->
      <div class="hidden lg:block">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 w-full max-w-xs mx-auto">
          <div class="mb-4">
            <input
              v-model="suggestionSearch"
              type="text"
              placeholder="Search posts"
              class="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:ring-primary-500 px-3 py-2 text-sm"
            />
          </div>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">SUGGESTIONS</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
            <div
              v-for="user in filteredSuggestions"
              :key="user.id"
              class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition cursor-pointer"
            >
              <img :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700">
              <div class="ml-3 flex-1 min-w-0">
                <div class="flex items-center space-x-1">
                  <span class="font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</span>
                  <span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full ml-1">Free</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-300 truncate">@{{ user.username }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tip Modal -->
      <Modal v-if="showingTipModal" @close="showingTipModal = false">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Send Tip to {{ selectedPost?.creator.name }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
              <input 
                v-model="tipAmount"
                type="number"
                class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                min="100"
              />
            </div>
            <Button 
              @click="sendTip"
              :loading="isSendingTip"
              variant="primary"
              class="w-full"
            >
              Send Tip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  import { toast } from 'vue3-toastify'
  import Modal from '~/components/ui/Modal.vue'
  import Button from '~/components/ui/Button.vue'
  import PostCard from '@/components/PostCard.vue'

  definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
  }
});
  
  const userStore = useUserStore()
  
  const posts = ref([
    {
      id: '1',
      creator: {
        id: 'creator1',
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      content: 'This is a free post that everyone can see!',
      image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
      createdAt: new Date('2024-03-01'),
      likes: 42,
      isPremium: false,
      comments: []
    },
    {
      id: '2',
      creator: {
        id: 'creator2',
        name: 'Jane Smith',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
      },
      content: 'This is a premium post that requires subscription!',
      image: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg',
      createdAt: new Date('2024-03-02'),
      likes: 156,
      isPremium: true,
      comments: []
    }
  ])
  
  const showingTipModal = ref(false)
  const selectedPost = ref(null)
  const tipAmount = ref(1000)
  const isSendingTip = ref(false)
  
  const suggestionSearch = ref('')
  const suggestions = ref([
    {
      id: '1',
      name: 'Remy Rune',
      username: 'remyunplugged',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '2',
      name: 'Alanna',
      username: 'alannam',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
      id: '3',
      name: 'Gin',
      username: 'ginfit',
      avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    },
    {
      id: '4',
      name: 'Cat',
      username: 'catfit',
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    },
    {
      id: '5',
      name: 'OFTV',
      username: 'oftv',
      avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    },
  ])

  const filteredSuggestions = computed(() => {
    if (!suggestionSearch.value) return suggestions.value
    return suggestions.value.filter(user =>
      user.name.toLowerCase().includes(suggestionSearch.value.toLowerCase()) ||
      user.username.toLowerCase().includes(suggestionSearch.value.toLowerCase())
    )
  })
  
  const isSubscribedToCreator = (creatorId: string) => {
    return userStore.getSubscriptions.includes(creatorId)
  }
  
  const subscribeToCreator = async (creatorId: string) => {
    try {
      await userStore.addSubscription(creatorId)
      toast.success('Successfully subscribed to creator!')
    } catch (error) {
      toast.error('Failed to subscribe to creator')
    }
  }
  
  const showTipModal = (post: any) => {
    selectedPost.value = post
    showingTipModal.value = true
  }
  
  const sendTip = async () => {
    if (!selectedPost.value || tipAmount.value < 100) return
  
    isSendingTip.value = true
    try {
      // Here you would typically make an API call to process the tip
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success(`Successfully sent tip to ${selectedPost.value.creator.name}!`)
      showingTipModal.value = false
    } catch (error) {
      toast.error('Failed to send tip')
    } finally {
      isSendingTip.value = false
    }
  }
  
  onMounted(async () => {
    // Fetch posts from API
  })
  </script>