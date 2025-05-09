<template>
<div class="container mx-auto">
  <div class="max-w-4xl mx-auto px-4 py-8">
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
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  import { toast } from 'vue3-toastify'
  import Modal from '~/components/ui/Modal.vue'
  import Button from '~/components/ui/Button.vue'

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