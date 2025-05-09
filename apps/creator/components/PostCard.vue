<template>
    <Card class="mb-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center">
          <img :src="post.creator.avatar" :alt="post.creator.name" class="w-10 h-10 rounded-full">
          <div class="ml-3">
            <h3 class="font-semibold">{{ post.creator.name }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
          </div>
        </div>
        <Button v-if="!isSubscribed" @click="$emit('subscribe')" variant="outline" class="text-sm">
          Subscribe
        </Button>
      </div>
  
      <BlurredPost v-if="post.isPremium && !isSubscribed" @subscribe="$emit('subscribe')">
        <div class="space-y-4 blur-lg">
          <p>{{ post.content }}</p>
          <img v-if="post.image" :src="post.image" :alt="post.title" class="rounded-lg w-full">
          <video v-if="post.video" class="rounded-lg w-full" controls>
            <source :src="post.video" type="video/mp4">
          </video>
        </div>
      </BlurredPost>
  
      <div v-else class="space-y-4">
        <p>{{ post.content }}</p>
        <img v-if="post.image" :src="post.image" :alt="post.title" class="rounded-lg w-full">
        <video v-if="post.video" class="rounded-lg w-full" controls>
          <source :src="post.video" type="video/mp4">
        </video>
      </div>
  
      <div class="mt-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="toggleLike" class="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
            <Heart :class="{ 'fill-current text-primary-600': isLiked }" />
            <span>{{ post.likes }}</span>
          </button>
          <button @click="showComments = !showComments" class="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
            <MessageCircle />
            <span>{{ post.comments.length }}</span>
          </button>
        </div>
        <Button @click="$emit('tip')" variant="outline" class="text-sm">
          Send Tip
        </Button>
      </div>
  
      <div v-if="showComments" class="mt-6 border-t pt-4">
        <div v-for="comment in post.comments" :key="comment.id" class="mb-4">
          <div class="flex items-start">
            <img :src="comment.user.avatar" :alt="comment.user.name" class="w-8 h-8 rounded-full">
            <div class="ml-3">
              <p class="font-medium">{{ comment.user.name }}</p>
              <p class="text-gray-600">{{ comment.content }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <textarea
            v-model="newComment"
            placeholder="Add a comment..."
            class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            rows="2"
          ></textarea>
          <Button @click="addComment" variant="primary" class="mt-2">
            Post Comment
          </Button>
        </div>
      </div>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Heart, MessageCircle } from 'lucide-vue-next'
  import Card from '~/components/ui/Card.vue'
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
  
  const emit = defineEmits(['subscribe', 'tip'])
  
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