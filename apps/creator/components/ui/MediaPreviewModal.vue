<template>
	<div
		v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
		style="z-index: 400" @click.self="close">
		<div class="relative w-[90vw] h-[90vh] max-w-6xl max-h-[90vh] flex">
			<!-- Close button -->
			<button
				type="button"
				class="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors"
				style="z-index: 300" @click.stop="close">
				<Icon name="lucide:x" class="h-6 w-6" />
			</button>

			<!-- Media -->

			<div
				class="relative flex-1 flex items-center justify-center bg-neutral-900 rounded-l-xl overflow-hidden"
				:class="{ 'rounded-r-xl': !showSidebar }">
				<Swiper
					v-if="mediaItems.length > 0" :modules="[Navigation, Keyboard]" :initial-slide="currentIndex"
					:space-between="30" :centered-slides="true" :keyboard="{ enabled: true }" :navigation="true" :loop="false"
					class="w-full h-full" @swiper="onSwiper" @slide-change="onSlideChange">
					<SwiperSlide v-for="(media, index) in mediaItems" :key="index">
						<div class="w-full h-full flex items-center justify-center">
							<img
								v-if="media.type === 'image'" :src="media.url"
								class="max-w-full max-h-full w-auto h-auto object-contain" />
							<video
								v-else-if="media.type === 'video'" ref="videoPlayer" :src="media.url" controls
								class="max-w-full max-h-full w-auto h-auto" @play="handleVideoPlay" @pause="handleVideoPause"
								@ended="handleVideoEnded" />
						</div>
					</SwiperSlide>
				</swiper>
			</div>

			<!-- Comment sidebar -->

			<div
				v-if="showSidebar"
				class="w-96 bg-white rounded-r-xl dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex">
				<!-- Thread header -->

				<div
					class="p-4 border-b border-gray-200 rounded-r-xl dark:border-gray-800 flex items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
					<Icon name="lucide:message-square" class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
					<h3 class="font-semibold text-gray-900 dark:text-white">Comments</h3>
					<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ messages.length }}</span>
				</div>

				<!-- Thread messages -->

				<div class="flex-1 overflow-y-auto p-4 space-y-4">
					<div v-for="(message, index) in messages" :key="index" class="flex items-start">
						<img :src="message.user.avatar" class="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
						<div class="min-w-0">
							<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 inline-block">
								<p class="font-semibold text-sm text-gray-900 dark:text-white">{{ message.user.name }}</p>

								<p class="text-sm text-gray-800 dark:text-gray-200 break-words">{{ message.text }}</p>
							</div>

							<div class="flex items-center mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-400">
								<span>{{ formatTimeAgo(message.timestamp) }}</span>
								<button class="font-semibold hover:text-gray-700 dark:hover:text-gray-300">Reply</button>
								<button class="font-semibold hover:text-gray-700 dark:hover:text-gray-300">Like</button>
							</div>
						</div>
					</div>
				</div>

				<div
					class="p-4 border-t border-gray-200 rounded-r-xl dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
					<div class="flex items-center">
						<img :src="currentUser.avatar" class="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
						<input
							v-model="newComment" type="text" placeholder="Add a comment..."
							class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
							@keydown.enter.prevent="sendComment" @keydown.stop @click.stop />
						<button
							class="ml-2 text-primary-600 dark:text-primary-400 font-semibold text-sm disabled:opacity-50"
							:disabled="!newComment.trim()" @click.stop="sendComment">
							Post
						</button>
					</div>
				</div>
			</div>

			<!-- Navigation -->

			<div v-if="mediaItems.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
				<button
					v-for="(_, index) in mediaItems" :key="index" type="button"
					class="w-2 h-2 rounded-full transition-colors"
					:class="[index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75']"
					@click.stop="swiper?.slideTo(index)" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  mediaItems: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  showSidebar: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: Array,
    default: () => [],
  },
  currentUser: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      avatar: '',
    }),
  },
});

const emit = defineEmits(['close', 'update:currentIndex', 'send-message']);

const videoPlayer = ref(null);
const isVideoPlaying = ref(false);
const swiper = ref(null);
const newComment = ref('');

// const currentMedia = computed(() => props.mediaItems[props.currentIndex] || {});

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

function onSwiper(swiperInstance) {
  swiper.value = swiperInstance;
}

function onSlideChange() {
  if (swiper.value) {
    emit('update:currentIndex', swiper.value.activeIndex);
  }
}

function close() {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
    isVideoPlaying.value = false;
  }
  emit('close');
}

function handleVideoPlay() {
  isVideoPlaying.value = true;
}

function handleVideoPause() {
  isVideoPlaying.value = false;
}

function handleVideoEnded() {
  isVideoPlaying.value = false;
}

function sendComment() {
  if (newComment.value.trim()) {
    emit('send-message', newComment.value.trim());
    newComment.value = '';
  }
}
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: white !important;
  background: rgba(0, 0, 0, 0.5);
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 20px !important;
}

.dark .swiper-button-next,
.dark .swiper-button-prev {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {

  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
}
</style>