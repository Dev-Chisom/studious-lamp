<template>
  	 	 	
  <div class="max-w-6xl mx-auto px-4 py-8">
    		 		 		
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      			<!-- Main Feed -->
      			 			 			
      <div class="lg:col-span-2">
        				 				 				
        <div class="space-y-6">
          					 					 					
          <div v-for="post in posts" :key="post.id">
            						<post-card
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
        				 				 				
        <div class="sticky top-20">
          					 					 					
          <div
            class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 w-full max-w-xs mx-auto"
          >
            						 						 						
            <div class="mb-4">
              							<input
                v-model="suggestionSearch"
                type="text"
                placeholder="Search posts"
                class="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:ring-primary-500 px-3 py-2 text-sm"
              />
              						 						 						
            </div>
            						 						 						
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">							SUGGESTIONS 						 						</h3>
            						 						 						
            <div class="h-80">
              							<swiper
                v-if="filteredSuggestions.length > 0"
                :modules="[Pagination, Keyboard]"
                :slides-per-view="1"
                :keyboard="{ enabled: true }"
                :pagination="{ clickable: true }"
                :space-between="16"
                :mousewheel="true"
                :speed="500"
                effect="slide"
                class="h-full"
              >
                								<swiper-slide v-for="(userGroup, slideIdx) in chunkedSuggestions" :key="slideIdx">
                  									 									 									
                  <div class="flex flex-col gap-2">
                    										 										 										
                    <div
                      v-for="user in userGroup"
                      :key="user.id"
                      class="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition cursor-pointer"
                    >
                      											<img
                        :src="user.avatar"
                        :alt="user.name"
                        class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      											 											 											
                      <div class="ml-3 flex-1 min-w-0">
                        												 												 												
                        <div class="flex items-center space-x-1">
                          													<span class="font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</span> 												 												 												
                        </div>
                        												<span class="text-xs text-gray-500 dark:text-gray-300 truncate">@{{ user.username }}</span> 											 											 											
                      </div>
                      										 										 										
                    </div>
                    									 									 									
                  </div>
                  								</swiper-slide
                >
                							</swiper
              >
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>
      			<!-- Tip Modal -->
      			<modal v-if="showingTipModal" @close="showingTipModal = false">
        				 				 				
        <div class="p-6">
          					 					 					
          <h2 class="text-xl font-semibold mb-4">						Send Tip to {{ selectedPost?.creator.name }} 					 					</h2>
          					 					 					
          <div class="space-y-4">
            						 						 						
            <div>
              							<label class="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label> 							<input
                v-model="tipAmount"
                type="number"
                class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                min="100"
              />
              						 						 						
            </div>
            						<button :loading="isSendingTip" variant="primary" class="w-full" @click="sendTip">							Send Tip 						 						</button> 					 					 					
          </div>
          				 				 				
        </div>
        			</modal
      >
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Keyboard } from 'swiper/modules'
import { useUserStore } from '~/stores/user'
import Modal from '~/components/ui/Modal.vue'
import Button from '~/components/ui/Button.vue'
import PostCard from '@/components/PostCard.vue'
import 'swiper/css'
import 'swiper/css/pagination'

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
  },
})

interface Creator {
  id: string
  name: string
  avatar: string
}

interface Post {
  id: string
  creator: Creator
  content: string
  image: string
  createdAt: Date
  likes: number
  isPremium: boolean
  comments: any[]
}

interface SuggestionUser {
  id: string
  name: string
  username: string
  avatar: string
}

const userStore = useUserStore()

const posts = ref<Post[]>([
  {
    id: '1',
    creator: {
      id: 'creator1',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    content: 'This is a free post that everyone can see!',
    image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
    createdAt: new Date('2024-03-01'),
    likes: 42,
    isPremium: false,
    comments: [],
  },
  {
    id: '2',
    creator: {
      id: 'creator2',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    content: 'This is a premium post that requires subscription!',
    image: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg',
    createdAt: new Date('2024-03-02'),
    likes: 156,
    isPremium: true,
    comments: [],
  },
])

const showingTipModal = ref(false)
const selectedPost = ref<Post | null>(null)
const tipAmount = ref<number>(1000)
const isSendingTip = ref(false)

const suggestionSearch = ref('')
const suggestions = ref<SuggestionUser[]>([
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
  {
    id: '6',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
  },
  {
    id: '7',
    name: 'Mike Wilson',
    username: 'mikew',
    avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
  {
    id: '8',
    name: 'Emma Davis',
    username: 'emmad',
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
  },
  {
    id: '9',
    name: 'James Brown',
    username: 'jamesb',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    id: '10',
    name: 'Lisa Anderson',
    username: 'lisaa',
    avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
  },
  {
    id: '11',
    name: 'David Miller',
    username: 'davidm',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
  },
  {
    id: '12',
    name: 'Sophie Taylor',
    username: 'sophiet',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
])

const filteredSuggestions = computed<SuggestionUser[]>(() => {
  if (!suggestionSearch.value) {
    return suggestions.value
  }
  return suggestions.value.filter(
    (user) =>
      user.name.toLowerCase().includes(suggestionSearch.value.toLowerCase()) ||
      user.username.toLowerCase().includes(suggestionSearch.value.toLowerCase()),
  )
})

const usersPerSlide = 3
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
const chunkedSuggestions = computed<SuggestionUser[][]>(() => chunkArray(filteredSuggestions.value, usersPerSlide))

const isSubscribedToCreator = (creatorId: string): boolean => {
  return userStore.getSubscriptions.includes(creatorId)
}

const subscribeToCreator = async (creatorId: string): Promise<void> => {
  try {
    await userStore.addSubscription(creatorId)
    toast.success('Successfully subscribed to creator!')
  } catch (error) {
    toast.error('Failed to subscribe to creator')
  }
}

const showTipModal = (post: Post): void => {
  selectedPost.value = post
  showingTipModal.value = true
}

const sendTip = async (): Promise<void> => {
  if (!selectedPost.value || tipAmount.value < 100) {
    return
  }
  isSendingTip.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
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

<style scoped>
::v-deep(.swiper-pagination-bullet) {
  background-color: theme('colors.primary.500') !important;
  opacity: 0.4;
}
::v-deep(.swiper-pagination-bullet-active) {
  background-color: theme('colors.primary.700') !important;
  opacity: 1;
}
</style>
