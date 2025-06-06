<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <!-- Navigation Arrows -->
    <button
      v-if="mediaItems.length > 1"
      type="button"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      :disabled="currentIndex === 0"
      @click="goToPrevious"
    >
      <Icon name="lucide:chevron-left" class="w-6 h-6 text-white" />
    </button>

    <button
      v-if="mediaItems.length > 1"
      type="button"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      :disabled="currentIndex === mediaItems.length - 1"
      @click="goToNext"
    >
      <Icon name="lucide:chevron-right" class="w-6 h-6 text-white" />
    </button>

    <!-- Media Display -->
    <div class="max-w-full max-h-full flex items-center justify-center">
      <div
        v-if="currentMedia"
        class="relative max-w-[90vw] rounded-lg overflow-hidden shadow-2xl"
      >
        <!-- Image -->
        <img
          v-if="currentMedia.type === 'image'"
          :src="currentMedia.url"
          :alt="currentMedia.name"
          class="max-w-full max-h-full object-contain"
          @load="onImageLoad"
        />

        <!-- Video -->
        <div v-else-if="currentMedia.type === 'video'" class="relative">
          <video
            ref="videoRef"
            :src="currentMedia.url"
            class="max-w-full object-contain"
            controls
            @play="$emit('play')"
            @pause="$emit('pause')"
            @loadedmetadata="onVideoLoadedMetadata"
            @timeupdate="onVideoTimeUpdate"
          />
          
          <!-- Video Cover Overlay -->
          <div 
            v-if="hasSelectedCover && !isPlaying"
            class="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/20"
            @click="playVideoFromCover"
          >
            <img
              :src="selectedCoverPhoto"
              class="w-full h-full object-contain"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
                <Icon name="lucide:play" class="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Media Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-primary p-4">
          <h3 class="text-white font-medium text-lg">{{ currentMedia.name }}</h3>
          <div class="flex items-center space-x-4 text-white/80 text-sm mt-1">
            <span class="flex items-center space-x-1">
              <Icon :name="currentMedia.type === 'image' ? 'lucide:image' : 'lucide:video'" class="w-4 h-4" />
              <span>{{ currentMedia.type }}</span>
            </span>
            <span v-if="currentMedia.size">{{ formatFileSize(currentMedia.size) }}</span>
            <span v-if="currentMedia.duration">{{ formatDuration(currentMedia.duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  mediaItems: any[]
  currentIndex: number
  isPlaying: boolean
}>()

const emit = defineEmits<{
  (e: 'update:current-index', index: number): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'video-loaded', event: Event, index: number): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

const currentMedia = computed(() => props.mediaItems[props.currentIndex])
const hasSelectedCover = computed(() => false) // This would be passed from parent
const selectedCoverPhoto = computed(() => null) // This would be passed from parent

function goToPrevious() {
  if (props.currentIndex > 0) {
    emit('update:current-index', props.currentIndex - 1)
  }
}

function goToNext() {
  if (props.currentIndex < props.mediaItems.length - 1) {
    emit('update:current-index', props.currentIndex + 1)
  }
}

function onImageLoad() {
  // Handle image load if needed
}

function onVideoLoadedMetadata(event: Event) {
  emit('video-loaded', event, props.currentIndex)
}

function onVideoTimeUpdate() {
  // Handle video time update if needed
}

function playVideoFromCover() {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

function formatFileSize(bytes: number): string {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>