<template>
  <div class="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-l border-white/20 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-white/10">
      <div class="flex items-center justify-between">
        <h3 class="text-base text-gray-900 dark:text-white">Media Details</h3>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentIndex + 1 }} of {{ totalItems }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- File Information -->
      <div class="p-4 border-b border-white/10">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">File Information</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Name:</span>
            <span class="text-gray-900 dark:text-white font-medium truncate ml-2">{{ currentMedia?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Type:</span>
            <span class="text-gray-900 dark:text-white flex items-center space-x-1">
              <Icon :name="currentMedia?.type === 'image' ? 'lucide:image' : 'lucide:video'" class="w-4 h-4" />
              <span>{{ currentMedia?.type }}</span>
            </span>
          </div>
          <div v-if="currentMedia?.size" class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Size:</span>
            <span class="text-gray-900 dark:text-white">{{ formatFileSize(currentMedia.size) }}</span>
          </div>
        </div>
      </div>

      <!-- Video Cover Selection -->
      <div v-if="enableVideoEdit && currentMedia?.type === 'video'" class="p-4 border-b border-white/10">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Cover Photo</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Select a thumbnail to use as the cover photo
        </p>

        <!-- Thumbnails Grid -->
        <div v-if="!isGeneratingThumbs" class="grid grid-cols-3 gap-2 mb-3">
          <button
            v-for="(thumb, i) in videoThumbnails"
            :key="i"
            class="relative aspect-video rounded border-2 overflow-hidden transition-all duration-200 hover:scale-105"
            :class="i === selectedCoverIndex && !customCover ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'"
            @click="$emit('select-cover', i)"
          >
            <img :src="thumb" class="w-full h-full object-cover" />
            <div v-if="i === selectedCoverIndex && !customCover" class="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1">
              <Icon name="lucide:check" class="w-3 h-3" />
            </div>
          </button>

          <!-- Custom Cover Display -->
          <div 
            v-if="customCover" 
            class="relative aspect-video rounded border-2 border-pink-500 ring-2 ring-pink-500/20 overflow-hidden cursor-pointer"
            @click="$emit('clear-cover')"
          >
            <img :src="customCover" class="w-full h-full object-cover" />
            <div class="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1">
              <Icon name="lucide:check" class="w-3 h-3" />
            </div>
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Icon name="lucide:x" class="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="grid grid-cols-3 gap-2 mb-3">
          <div v-for="i in 6" :key="i" class="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>

        <!-- Cover Actions -->
        <div class="flex items-center justify-between">
          <button 
            v-if="selectedCoverIndex !== null || customCover"
            type="button"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            @click="$emit('clear-cover')"
          >
            Clear cover
          </button>
          <div v-else></div>

          <label class="text-sm text-pink-500 hover:text-pink-600 cursor-pointer transition-colors">
            Upload custom
            <input 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="onCustomCoverChange" 
            />
          </label>
        </div>
      </div>

      <!-- Comments Section -->
      <div v-if="showComments" class="flex-1 flex flex-col">
        <!-- Messages -->
        <div class="flex-1 p-4 space-y-4 overflow-y-auto">
          <div v-for="(message, index) in messages" :key="index" class="flex items-start space-x-3">
            <img :src="message.user.avatar" class="w-8 h-8 rounded-full flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <p class="font-medium text-sm text-gray-900 dark:text-white">{{ message.user.name }}</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ message.text }}</p>
              </div>
              <div class="flex items-center mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{{ formatTimeAgo(message.timestamp) }}</span>
                <button type="button" class="hover:text-gray-700 dark:hover:text-gray-300">Reply</button>
                <button type="button" class="hover:text-gray-700 dark:hover:text-gray-300">Like</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Input -->
        <div class="p-4 border-t border-white/10">
          <div class="flex items-center space-x-3">
            <img :src="currentUser.avatar" class="w-8 h-8 rounded-full flex-shrink-0" />
            <input
              v-model="newComment"
              type="text"
              placeholder="Add a comment..."
              class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              @keydown.enter.prevent="sendComment"
            />
            <button
              class="text-pink-500 hover:text-pink-600 font-medium text-sm disabled:opacity-50 transition-colors"
              type="button"
              :disabled="!newComment.trim()"
              @click="sendComment"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  currentMedia: any
  currentIndex: number
  enableVideoEdit: boolean
  showComments: boolean
  videoThumbnails: string[]
  selectedCoverIndex: number | null
  customCover: string | null
  isGeneratingThumbs: boolean
  messages: any[]
  currentUser: any
}>()

const emit = defineEmits<{
  (e: 'select-cover', index: number): void
  (e: 'clear-cover'): void
  (e: 'custom-cover-change', file: File): void
  (e: 'send-message', message: string): void
}>()

const newComment = ref('')

const totalItems = computed(() => 1) // This would be passed from parent

function onCustomCoverChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    emit('custom-cover-change', file)
  }
}

function sendComment() {
  if (newComment.value.trim()) {
    emit('send-message', newComment.value.trim())
    newComment.value = ''
  }
}

function formatFileSize(bytes: number): string {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}
</script>