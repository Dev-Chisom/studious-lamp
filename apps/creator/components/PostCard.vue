<template>
	<div>
		<div
			class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
			<div class="flex items-center justify-between px-4 py-3">
				<div class="flex items-center">
					<NuxtLink to="/@user" class="flex-shrink-0">
						<img
							:src="post.creator.avatar" :alt="post.creator.name"
							class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
					</NuxtLink>

					<div class="ml-3">
						<NuxtLink to="/@user">
							<h3 class="font-semibold text-sm text-gray-900 dark:text-white hover:underline">
								{{ post.creator.name }}
							</h3>
						</NuxtLink>

						<p class="text-xs text-gray-500 dark:text-gray-400">{{ post.location || t('unknownLocation') }}</p>
					</div>
				</div>

				<button class="text-gray-500 dark:text-gray-400">
					<Icon name="lucide:more-vertical" class="w-5 h-5" />
				</button>
			</div>

			<div class="relative aspect-video w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
				<template v-if="post.isPremium && !isSubscribed">
					<div class="absolute inset-0 z-10 flex flex-col justify-center items-center bg-white/70 dark:bg-gray-900/70">
						<button
							class="max-w-md rounded-full btn-primary text-white font-semibold py-4 px-6 text-lg transition-all"
							@click="$emit('subscribe')">
							{{ t('subscribe') }}
						</button>
					</div>

					<div class="absolute inset-0 w-full h-full filter blur-sm pointer-events-none select-none">
						<img v-if="post.image" :src="post.image" class="w-full h-full object-cover" alt="Post content" />
						<video v-else-if="post.video" class="w-full h-full object-cover" :poster="post.image">
							<source :src="post.video" type="video/mp4" />
						</video>
					</div>
				</template>
				<template v-else>
					<div class="absolute inset-0 w-full h-full cursor-pointer" @click="openModal(0)">
						<img v-if="post.image" :src="post.image" class="w-full h-full object-cover" />
						<video v-if="post.video" class="w-full h-full object-cover" :poster="post.image">
							<source :src="post.video" type="video/mp4" />
						</video>
					</div>
				</template>
			</div>

			<div class="px-4 py-3">
				<div class="flex items-center justify-between mb-2">
					<div class="flex items-center space-x-4">
						<Tooltip :text="isLiked ? t('home.unlike') : t('home.like')">
							<button
								:disabled="post.isPremium && !isSubscribed" :class="[
									post.isPremium && !isSubscribed ? 'opacity-50 cursor-not-allowed' : '',
									'text-gray-900 dark:text-white',
								]" @click="toggleLike">
								<Icon
									:name="isLiked ? 'lucide:heart' : 'lucide:heart'" class="w-6 h-6"
									:class="{ 'fill-red-500 text-red-500': isLiked }" />
							</button>
						</Tooltip>
						<Tooltip :text="t('home.comment')">
							<button
								:disabled="post.isPremium && !isSubscribed" :class="[
									post.isPremium && !isSubscribed ? 'opacity-50 cursor-not-allowed' : '',
									'text-gray-900 dark:text-white',
								]" @click="openModal(0, true)">
								<Icon name="lucide:message-circle" class="w-6 h-6" />
							</button>
						</Tooltip>
						<Tooltip :text="t('home.share')">
							<button
								:disabled="post.isPremium && !isSubscribed" :class="[
									post.isPremium && !isSubscribed ? 'opacity-50 cursor-not-allowed' : '',
									'text-gray-900 dark:text-white',
								]">
								<Icon name="lucide:send" class="w-6 h-6" />
							</button>
						</Tooltip>
						<Tooltip :text="t('home.tipCreator')">
							<button
								:disabled="post.isPremium && !isSubscribed" :class="[
									post.isPremium && !isSubscribed ? 'opacity-50 cursor-not-allowed' : '',
									'text-gray-900 dark:text-white',
								]" @click="emitTip">
								<Icon name="lucide:coins" class="w-6 h-6" />
							</button>
						</Tooltip>
					</div>
					<Tooltip :text="t('home.save')">
						<button
							:disabled="post.isPremium && !isSubscribed" :class="[
								post.isPremium && !isSubscribed ? 'opacity-50 cursor-not-allowed' : '',
								'text-gray-900 dark:text-white',
							]">
							<Icon name="lucide:bookmark" class="w-6 h-6" />
						</button>
					</Tooltip>
				</div>

				<p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
					{{ formatNumber(post.likes) }} {{ t('likes') }}
				</p>

				<p class="text-sm text-gray-900 dark:text-white mb-1">
					<span class="font-semibold">{{ post.creator.name }}</span> {{ post.content }}
				</p>

				<button
					v-if="(post.comments.length > 0 || localComments.length > 0) && !(post.isPremium && !isSubscribed)"
					class="text-sm text-gray-500 dark:text-gray-400 mb-1" @click="openModal(0, true)">
					{{ t('viewAllComments', { count: post.comments.length + localComments.length }) }}
				</button>

				<template v-if="!(post.isPremium && !isSubscribed)">
					<div v-for="(comment, index) in localComments" :key="'local-' + index" class="mb-1">
						<p class="text-sm text-gray-900 dark:text-white">
							<span class="font-semibold">{{ currentUser.name }}</span> {{ comment }}
						</p>
					</div>
				</template>

				<p class="text-xs text-gray-400 dark:text-gray-500 uppercase mt-2">{{ formatTimeAgo(post.createdAt) }}</p>
			</div>

			<div
				v-if="!(post.isPremium && !isSubscribed)"
				class="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center">
				<input
					v-model="quickComment" type="text" :placeholder="t('addAComment')"
					class="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0"
					@keyup.enter="addComment" />
				<button
					class="text-primary-600 dark:text-primary-400 font-semibold text-sm disabled:opacity-50"
					:disabled="!quickComment.trim()" @click="addComment">
					{{ t('post') }}
				</button>
			</div>
		</div>

		<MediaPreviewModal
			v-if="showModal" :is-open="showModal" :media-items="mediaItemsForModal"
			:current-index="currentMediaIndex" :show-sidebar="true" :messages="allCommentsForModal"
			:current-user="currentUser" @close="closeModal" @update:current-index="updateMediaIndex"
			@send-message="handleNewComment" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MediaPreviewModal from './ui/Media/MediaPreviewModal.vue';
import Tooltip from './ui/Tooltip.vue';

interface User {
  name: string
  avatar: string
}

interface Comment {
  content: string
  createdAt: Date
  user: User
}

interface Post {
  id: string
  creator: User
  content: string
  location?: string
  image?: string
  video?: string
  createdAt: Date
  likes: number
  isPremium: boolean
  comments: Comment[]
}

interface PostCardProps {
  post: Post
  isSubscribed: boolean
}

interface PostCardEmits {
  (e: 'subscribe'): void
  (e: 'tip'): void
  (e: 'add-comment', comment: string): void
}

interface MediaItem {
  url: string
  type: 'image' | 'video'
}

interface Message {
  text: string
  timestamp: Date
  user: User
  isCurrentUser: boolean
}

// Current user data
const currentUser = ref<User>({
  name: 'YourUsername',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
});

const props = defineProps<PostCardProps>();

const emit = defineEmits<PostCardEmits>();

const showModal = ref(false);
const quickComment = ref('');
const isLiked = ref(false);
const currentMediaIndex = ref(0);
const showComments = ref(false);
const localComments = ref<string[]>([]);

const { t } = useI18n();

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format media items for the modal
const mediaItemsForModal = computed<MediaItem[]>(() => {
  return [
    {
      url: props.post.video || props.post.image || '',
      type: props.post.video ? 'video' : 'image',
    },
  ];
});

// Combine post comments and local comments for modal
const allCommentsForModal = computed<Message[]>(() => {
  const captionMessage: Message = {
    text: props.post.content,
    timestamp: props.post.createdAt,
    user: {
      name: props.post.creator.name,
      avatar: props.post.creator.avatar,
    },
    isCurrentUser: false,
  };

  const postComments: Message[] = props.post.comments.map((comment) => ({
    text: comment.content,
    timestamp: comment.createdAt,
    user: {
      name: comment.user.name,
      avatar: comment.user.avatar,
    },
    isCurrentUser: false,
  }));

  const localCommentMessages: Message[] = localComments.value.map((comment) => ({
    text: comment,
    timestamp: new Date(),
    user: {
      name: currentUser.value.name,
      avatar: currentUser.value.avatar,
    },
    isCurrentUser: true,
  }));

  return [captionMessage, ...postComments, ...localCommentMessages];
});

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t('secondsAgo', { count: diffInSeconds });
  }
  if (diffInSeconds < 3600) {
    return t('minutesAgo', { count: Math.floor(diffInSeconds / 60) });
  }
  if (diffInSeconds < 86400) {
    return t('hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
  }
  return t('daysAgo', { count: Math.floor(diffInSeconds / 86400) });
};

const toggleLike = (): void => {
  isLiked.value = !isLiked.value;
};

const openModal = (index = 0, withComments = false): void => {
  if (props.post.isPremium && !props.isSubscribed) {
    emit('subscribe');
    return;
  }
  currentMediaIndex.value = index;
  showComments.value = withComments;
  showModal.value = true;
};

const closeModal = (): void => {
  showModal.value = false;
  showComments.value = false;
};

const updateMediaIndex = (index: number): void => {
  currentMediaIndex.value = index;
};

const addComment = (): void => {
  if (!quickComment.value.trim()) {
    return;
  }

  localComments.value.push(quickComment.value);
  emit('add-comment', quickComment.value);
  quickComment.value = '';
};

const handleNewComment = (comment: string): void => {
  localComments.value.push(comment);
  emit('add-comment', comment);
};
const emitTip = (): void => {
  if (props.post.isPremium && !props.isSubscribed) {
    emit('subscribe');
    return;
  }
  emit('tip');
};
</script>

<style scoped>
/* Custom styles for the post card */
video {
  background-color: #000;
}
</style>
