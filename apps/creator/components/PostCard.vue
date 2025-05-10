<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <div class="flex items-center">
        <img :src="props.post.creator.avatar" :alt="props.post.creator.name" class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700">
        <div class="ml-3">
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ props.post.creator.name }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(props.post.createdAt) }}</p>
        </div>
      </div>
      <Button v-if="!props.isSubscribed" @click="$emit('subscribe')" variant="outline" class="text-xs px-4 py-1">
        Subscribe
      </Button>
    </div>

    <!-- Media -->
    <BlurredPost v-if="props.post.isPremium && !props.isSubscribed" @subscribe="$emit('subscribe')">
      <div class="relative aspect-video w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img v-if="props.post.image" :src="props.post.image" :alt="props.post.title" class="object-cover w-full h-full rounded-none">
        <video v-if="props.post.video" class="object-cover w-full h-full rounded-none" controls>
          <source :src="props.post.video" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <p class="font-semibold text-lg text-gray-700 dark:text-gray-200">Subscribe to unlock</p>
        </div>
      </div>
    </BlurredPost>
    <div v-else>
      <div v-if="props.post.image || props.post.video" class="relative aspect-video w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img v-if="props.post.image" :src="props.post.image" :alt="props.post.title" class="object-cover w-full h-full">
        <video v-if="props.post.video" class="object-cover w-full h-full" controls>
          <source :src="props.post.video" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 py-4">
      <p class="text-gray-800 dark:text-gray-100 text-base mb-2">{{ props.post.content }}</p>
    </div>

    <!-- Actions -->
    <div class="px-6 pb-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
      <div class="flex items-center space-x-6">
        <button @click="toggleLike" class="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
          <Heart :class="{ 'fill-current text-primary-600 dark:text-primary-400': isLiked }" />
          <span class="text-sm">{{ props.post.likes }}</span>
        </button>
        <button @click="showComments = !showComments" class="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
          <MessageCircle />
          <span class="text-sm">{{ props.post.comments.length }}</span>
        </button>
      </div>
      <Button @click="$emit('tip')" variant="outline" class="text-xs px-4 py-1">
        Send Tip
      </Button>
    </div>

    <!-- Comments -->
    <div v-if="showComments" class="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div v-for="comment in props.post.comments" :key="comment.id" class="mb-4">
        <div class="flex items-start">
          <img :src="comment.user.avatar" :alt="comment.user.name" class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700">
          <div class="ml-3">
            <p class="font-medium text-gray-900 dark:text-white">{{ comment.user.name }}</p>
            <p class="text-gray-700 dark:text-gray-200">{{ comment.content }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(comment.createdAt) }}</p>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
          rows="2"
        ></textarea>
        <Button @click="addComment" variant="primary" class="mt-2">
          Post Comment
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Heart, MessageCircle } from 'lucide-vue-next'
import BlurredPost from '~/components/ui/BlurredPost.vue'
import Button from '~/components/ui/Button.vue'

const props = defineProps<{
  post: {
    id: string
    creator: {
      name: string
      avatar: string
    }
    content: string
    image?: string
    video?: string
    createdAt: Date
    likes: number
    isPremium: boolean
    comments: Array<{
      id: string
      user: {
        name: string
        avatar: string
      }
      content: string
      createdAt: Date
    }>
  }
  isSubscribed: boolean
}>()

defineEmits(['subscribe', 'tip'])

const showComments = ref(false)
const newComment = ref('')
const isLiked = ref(false)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const addComment = () => {
  if (newComment.value.trim()) {
    // Add comment logic here
    newComment.value = ''
  }
}
</script>