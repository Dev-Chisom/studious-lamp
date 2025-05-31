<template>
	<div class="max-w-7xl mx-auto px-2 py-4">
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
			<!-- Main Feed -->

			<div class="lg:col-span-3">
				<div class="space-y-6">
					<div v-for="post in posts" :key="post.id">
						<post-card
							:post="post" :is-subscribed="isSubscribedToCreator(post.creator.id)"
							@subscribe="subscribeToCreator(post.creator.id)" @tip="showTipModal(post)" />
					</div>
				</div>
			</div>
			<!-- Suggestions Panel -->
			<div class="hidden lg:block col-span-2">
				<div class="sticky top-4 z-10 h-[calc(100vh-2rem)] overflow-y-auto pb-4">
					<div
						class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 w-full max-w-xl mx-auto">
						<!-- Search Bar -->
						<div class="mb-4">
							<input
								v-model="suggestionSearch" type="text" :placeholder="$t('searchUsersOrPosts')"
								class="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:ring-primary-500 px-3 py-2 text-sm" />
						</div>

						<UserSwiperList :users="filteredSuggestions" :title="$t('suggestions')" :users-per-slide="3" />
						<div class="mt-8">
							<UserSwiperList :users="expiredSubscriptions" :title="$t('subscriptions.expiredSubscriptions')" :users-per-slide="3" />
						</div>
					</div>
				</div>
			</div>

			<!-- Tip Modal -->
			<modal v-if="showingTipModal" @close="showingTipModal = false">
				<div class="p-6 bg-white dark:bg-gray-900 rounded-lg">
					<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
						{{ $t('home.sendTipTo', { name: selectedPost?.creator.name }) }}
					</h2>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
								{{ $t('home.amount') }}
							</label>
							<input
								v-model="tipAmount" type="number"
								class="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
								min="100" />
						</div>
						<BaseButton :loading="isSendingTip" variant="primary" class="w-full" @click="sendTip">
							{{ $t('home.sendTip') }}
						</BaseButton>
					</div>
				</div>
			</modal>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useUserStore } from '~/store/user';
import Modal from '~/components/ui/Modal.vue';
import BaseButton from '~/components/ui/BaseButton.vue';
import PostCard from '~/components/PostCard.vue';
import UserSwiperList from '~/components/ui/UserSwiperList.vue';

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
  },
});

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
  expired?: boolean
}

const userStore = useUserStore();

const posts = ref<Post[]>([
  {
    id: '1',
    creator: {
      id: 'creator1',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    content: 'This is a free post that everyone can see!',
    image: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
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
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    content: 'This is a premium post that requires subscription!',
    image: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    createdAt: new Date('2024-03-02'),
    likes: 156,
    isPremium: true,
    comments: [],
  },
]);

const showingTipModal = ref(false);
const selectedPost = ref<Post | null>(null);
const tipAmount = ref<number>(1000);
const isSendingTip = ref(false);

const suggestionSearch = ref('');
const suggestions = ref<SuggestionUser[]>([
  {
    id: 'fil-1',
    name: 'Ana Mei',
    username: 'anamei',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', // Woman smiling
    banner: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg' // Portrait background
  },
  {
    id: 'fil-2',
    name: 'Teacher Chloe',
    username: 'teacherchloe',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg', // Woman in glasses
    banner: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg' // Classroom
  },
  {
    id: 'fil-3',
    name: 'Kissa',
    username: 'kugsandkissahy',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', // Woman with curly hair
    banner: 'https://images.pexels.com/photos/3764160/pexels-photo-3764160.jpeg' // Fashion background
  },
  {
    id: 'fil-4',
    name: 'Bryce Adams',
    username: 'bryceadams',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'fil-5',
    name: 'LotusBombo',
    username: 'lotusbombo',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  }
]);

const expiredSubscriptions = ref<SuggestionUser[]>([
  {
    id: 'exp-1',
    name: 'Bryce Adams',
    username: 'bryceadams',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    expired: true
  },
  {
    id: 'exp-2',
    name: 'LotusBombo',
    username: 'lotusbombo',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    banner: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    expired: true
  }
]);

const filteredSuggestions = computed<SuggestionUser[]>(() => {
  if (!suggestionSearch.value) {
    return suggestions.value.filter(user => !expiredSubscriptions.value.some(expired => expired.id === user.id));
  }
  return suggestions.value.filter(
    (user) =>
      (user.name.toLowerCase().includes(suggestionSearch.value.toLowerCase()) ||
        user.username.toLowerCase().includes(suggestionSearch.value.toLowerCase())) &&
      !expiredSubscriptions.value.some(expired => expired.id === user.id)
  );
});

const isSubscribedToCreator = (creatorId: string): boolean => {
  return userStore?.getSubscriptions?.includes(creatorId) || false;
};

const subscribeToCreator = async (creatorId: string): Promise<void> => {
  try {
    await userStore.addSubscription(creatorId);
    toast.success('Successfully subscribed to creator!');
  } catch {
    toast.error('Failed to subscribe to creator');
  }
};

const showTipModal = (post: Post): void => {
  selectedPost.value = post;
  showingTipModal.value = true;
};

const sendTip = async (): Promise<void> => {
  if (!selectedPost.value || tipAmount.value < 100) {
    return;
  }
  isSendingTip.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Successfully sent tip to ${selectedPost.value.creator.name}!`);
    showingTipModal.value = false;
  } catch {
    toast.error('Failed to send tip');
  } finally {
    isSendingTip.value = false;
  }
};

onMounted(async () => {
  // Fetch posts from API
});
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

/* For Webkit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #9ca3af;
  /* gray-400 */
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
  /* gray-500 */
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af transparent;
  /* gray-400 */
}
</style>