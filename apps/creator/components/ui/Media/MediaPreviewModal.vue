<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm"
    @click.self="handleBackdropClick"
  >
    <div class="relative w-full h-full flex flex-col md:flex-row">
      <!-- Mobile Header -->
      <div class="md:hidden flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <button
          v-if="showEdit && mediaItems.length < maxFiles"
          type="button"
          class="w-10 h-10 btn-primary rounded-full flex items-center justify-center shadow-lg"
          @click="triggerAddMedia"
        >
          <Icon name="lucide:plus" class="w-5 h-5 text-white" />
        </button>
        
        <div v-else-if="showEdit && mediaItems.length >= maxFiles" class="bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
          Max {{ maxFiles }} files
        </div>
        
        <div v-else></div>
        
        <button
          type="button"
          class="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
          @click="handleClose"
        >
          <Icon name="lucide:x" class="w-5 h-5 text-white" />
        </button>
      </div>

      <!-- Desktop Close Button -->
      <button
        type="button"
        class="hidden md:block absolute top-2 right-6 z-50 w-12 h-12 bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-900/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        @click="handleClose"
      >
        <Icon name="lucide:x" class="w-6 h-6 text-gray-900 dark:text-white" />
      </button>

      <!-- Desktop Add Media Button -->
      <button
        v-if="showEdit && mediaItems.length < maxFiles"
        type="button"
        class="hidden md:block absolute top-6 left-6 z-50 w-12 h-12 btn-primary rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
        @click="triggerAddMedia"
      >
        <Icon name="lucide:plus" class="w-6 h-6 text-white" />
      </button>

      <!-- Desktop File Limit Warning -->
      <div 
        v-if="showEdit && mediaItems.length >= maxFiles"
        class="hidden md:block absolute top-6 left-6 z-50 bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
      >
        Maximum {{ maxFiles }} files reached
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col md:flex-row min-h-0">
        <!-- Media Display Area -->
        <div class="flex-1 relative flex items-center justify-center p-3 md:p-6 min-h-0">
          <MediaCarousel
            v-if="mediaItems.length > 0"
            :media-items="mediaItems"
            :current-index="internalCurrentIndex"
            :is-playing="isVideoPlaying"
            @update:current-index="updateCurrentIndex"
            @play="onVideoPlay"
            @pause="onVideoPause"
            @video-loaded="onVideoLoaded"
          />
          
          <!-- Empty State -->
          <div v-else class="text-center text-white/60">
            <Icon name="lucide:image-off" class="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 opacity-50" />
            <h3 class="text-lg md:text-xl font-medium mb-2">No media selected</h3>
            <p class="text-sm md:text-base">Add some files to get started</p>
          </div>
        </div>

        <!-- Sidebar - Mobile: Bottom Sheet, Desktop: Right Sidebar -->
        <div
          v-if="showSidebar || (enableVideoEdit && currentMedia?.type === 'video')"
          class="w-full md:w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t md:border-l md:border-t-0 border-white/20 flex flex-col max-h-[40vh] md:max-h-none"
        >
          <!-- Mobile Sidebar Handle -->
          <div class="md:hidden flex justify-center py-2 border-b border-white/10">
            <div class="w-12 h-1 bg-gray-400 rounded-full"></div>
          </div>
          
          <MediaPreviewSidebar
            :current-media="currentMedia"
            :current-index="internalCurrentIndex"
            :enable-video-edit="enableVideoEdit"
            :show-comments="showSidebar"
            :video-thumbnails="getVideoThumbnails(internalCurrentIndex)"
            :selected-cover-index="getSelectedCoverIndex(internalCurrentIndex)"
            :custom-cover="getCustomCover(internalCurrentIndex)"
            :is-generating-thumbs="isGeneratingThumbs"
            :title="title"
            :messages="messages"
            :current-user="currentUser"
            @select-cover="selectCover"
            @clear-cover="clearCover"
            @custom-cover-change="onCustomCoverChange"
            @send-message="sendMessage"
          />
        </div>
      </div>

      <!-- Bottom Controls -->
      <div class="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
        <!-- Navigation Dots -->
        <div v-if="mediaItems.length > 1" class="flex space-x-2">
          <button
            v-for="(_, index) in mediaItems"
            :key="index"
            type="button"
            :class="[
              'w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200',
              index === internalCurrentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            ]"
            @click="goToSlide(index)"
          />
        </div>

        <!-- Upload Button -->
        <button
          v-if="showNextButton"
          type="button"
          :disabled="mediaItems.length === 0 || isUploading"
          class="btn-primary disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 md:py-3 md:px-8 rounded-full transition-all duration-200 hover:scale-105 shadow-lg text-sm md:text-base"
          @click="handleUpload"
        >
          <span v-if="isUploading" class="flex items-center space-x-2">
            <Icon name="lucide:loader-2" class="animate-spin w-4 h-4 md:w-5 md:h-5" />
            <span class="hidden sm:inline">Uploading {{ uploadProgress.completed }}/{{ uploadProgress.total }}...</span>
            <span class="sm:hidden">{{ uploadProgress.completed }}/{{ uploadProgress.total }}</span>
          </span>
          <span v-else class="flex items-center space-x-2">
            <Icon name="lucide:upload" class="w-4 h-4 md:w-5 md:h-5" />
            <span class="hidden sm:inline">Upload & Continue</span>
            <span class="sm:hidden">Upload</span>
          </span>
        </button>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="addMediaInput"
        type="file"
        accept="image/*,video/*"
        multiple
        class="hidden"
        @change="onAddMedia"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotification } from '../../../composables/useNotifications';
import MediaPreviewSidebar from '../../../components/ui/Media/MediaPreviewSidebar.vue';
import MediaCarousel from './MediaCarousel.vue';

const props = defineProps({
  isOpen: Boolean,
  mediaItems: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  showSidebar: {
    type: Boolean,
    default: false
  },
  messages: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: Object,
    default: () => ({ name: '', avatar: '' })
  },
  enableVideoEdit: {
    type: Boolean,
    default: false
  },
  showEdit: {
    type: Boolean,
    default: false
  },
  showNextButton: {
    type: Boolean,
    default: false
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  isUploading: {
    type: Boolean,
    default: false
  },
  uploadProgress: {
    type: Object,
    default: () => ({ completed: 0, total: 0 })
  },
  title: {
    type: String,
    default: 'Media Preview'
  }
})

const emit = defineEmits([
  'close',
  'update:current-index',
  'send-message',
  'update:cover',
  'update:trim',
  'update:sound',
  'add-media',
  'next',
  'remove-media'
])

const { t } = useI18n()
const notification = useNotification()

// Internal state
const internalCurrentIndex = ref(props.currentIndex)
const isVideoPlaying = ref(false)
const newComment = ref('')
const addMediaInput = ref<HTMLInputElement | null>(null)
const isGeneratingThumbs = ref(false)

// Video editing state per video
const videoStates = ref<Map<number, {
  coverThumbnails: string[]
  selectedCoverIndex: number | null
  customCover: string | null
  trimStart: number
  trimEnd: number
  videoDuration: number
  isGeneratingThumbs: boolean
}>>(new Map())

// Computed properties
const currentMedia = computed(() => props.mediaItems?.[internalCurrentIndex.value] || {})

// Watch for external currentIndex changes
watch(() => props.currentIndex, (newIndex) => {
  if (newIndex !== internalCurrentIndex.value) {
    internalCurrentIndex.value = newIndex
  }
})

// Watch for mediaItems changes
watch(() => props.mediaItems.length, async (newLength, oldLength) => {
  if (newLength > oldLength) {
    const firstNewItemIndex = oldLength
    await nextTick()
    internalCurrentIndex.value = firstNewItemIndex
    emit('update:current-index', firstNewItemIndex)
  }
})

// Helper functions for video state
function getVideoState(index: number) {
  if (!videoStates.value.has(index)) {
    videoStates.value.set(index, {
      coverThumbnails: [],
      selectedCoverIndex: null,
      customCover: null,
      trimStart: 0,
      trimEnd: 10,
      videoDuration: 10,
      isGeneratingThumbs: false
    })
  }
  return videoStates.value.get(index)!
}

function getVideoThumbnails(index: number) {
  return getVideoState(index).coverThumbnails
}

function getSelectedCoverIndex(index: number) {
  return getVideoState(index).selectedCoverIndex
}

function getCustomCover(index: number) {
  return getVideoState(index).customCover
}

function hasSelectedCover(index: number) {
  const state = getVideoState(index)
  return state.selectedCoverIndex !== null || state.customCover !== null
}

function getSelectedCoverPhoto(index: number) {
  const state = getVideoState(index)
  if (state.customCover) return state.customCover
  if (state.selectedCoverIndex !== null && state.coverThumbnails[state.selectedCoverIndex]) {
    return state.coverThumbnails[state.selectedCoverIndex]
  }
  return null
}

// Event handlers
function updateCurrentIndex(newIndex: number) {
  internalCurrentIndex.value = newIndex
  emit('update:current-index', newIndex)
}

function goToSlide(index: number) {
  internalCurrentIndex.value = index
  emit('update:current-index', index)
}

function onVideoPlay() {
  isVideoPlaying.value = true
}

function onVideoPause() {
  isVideoPlaying.value = false
}

function onVideoLoaded(event: Event, index: number) {
  const video = event.target as HTMLVideoElement
  if (!video) return
  
  const state = getVideoState(index)
  state.videoDuration = video.duration
  state.trimStart = 0
  state.trimEnd = video.duration
  
  if (state.selectedCoverIndex === null && state.customCover === null) {
    state.selectedCoverIndex = 0
  }
  
  generateThumbnails(video, index)
}

async function generateThumbnails(video: HTMLVideoElement, index: number) {
  if (!video) return
  
  const state = getVideoState(index)
  state.coverThumbnails = []
  state.isGeneratingThumbs = true
  
  try {
    const count = 6
    const interval = video.duration / count
    const canvas = document.createElement('canvas')
    
    const videoWidth = video.videoWidth || 640
    const videoHeight = video.videoHeight || 360
    canvas.width = videoWidth
    canvas.height = videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Could not get canvas context')
      state.isGeneratingThumbs = false
      return
    }
    
    for (let i = 0; i < count; i++) {
      const time = i * interval
      video.currentTime = time
      
      await new Promise<void>(resolve => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked)
          
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          const thumbnail = canvas.toDataURL('image/jpeg', 0.9)
          state.coverThumbnails.push(thumbnail)
          
          if (i === 0 && state.selectedCoverIndex === null && state.customCover === null) {
            state.selectedCoverIndex = 0
            emit('update:cover', { index, cover: thumbnail })
          }
          
          resolve()
        }
        
        video.addEventListener('seeked', onSeeked, { once: true })
      })
    }
    
    video.currentTime = 0
  } catch (error) {
    console.error('Error generating thumbnails:', error)
  } finally {
    state.isGeneratingThumbs = false
  }
}

function selectCover(index: number) {
  const state = getVideoState(internalCurrentIndex.value)
  state.selectedCoverIndex = index
  state.customCover = null
  const coverPhoto = state.coverThumbnails[index]
  emit('update:cover', { index: internalCurrentIndex.value, cover: coverPhoto })
}

function onCustomCoverChange(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const state = getVideoState(internalCurrentIndex.value)
    state.customCover = reader.result as string
    state.selectedCoverIndex = null
    emit('update:cover', { index: internalCurrentIndex.value, cover: state.customCover })
  }
  reader.readAsDataURL(file)
}

function clearCover() {
  const state = getVideoState(internalCurrentIndex.value)
  
  if (state.coverThumbnails.length > 0 && state.selectedCoverIndex === 0 && !state.customCover) {
    return
  }
  
  state.selectedCoverIndex = null
  state.customCover = null
  emit('update:cover', { index: internalCurrentIndex.value, cover: null })
}

function sendMessage(message: string) {
  emit('send-message', message)
  newComment.value = ''
}

function triggerAddMedia() {
  addMediaInput.value?.click()
}

async function onAddMedia(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  
  const remainingSlots = props.maxFiles - props.mediaItems.length
  if (remainingSlots <= 0) {
    notification.error(`Maximum ${props.maxFiles} files allowed`)
    return
  }
  
  const filesToAdd = Array.from(files).slice(0, remainingSlots)
  if (filesToAdd.length < files.length) {
    notification.warning(`Only ${filesToAdd.length} files added. Maximum ${props.maxFiles} files allowed.`)
  }
  
  emit('add-media', filesToAdd)
  
  if (addMediaInput.value) {
    addMediaInput.value.value = ''
  }
}

function handleUpload() {
  if (props.mediaItems.length === 0) return

  const mediaData = props.mediaItems.map((media, index) => {
    const baseData = {
      id: media.id || `temp-${index}`,
      name: media.name || media.file?.name || `media-${index}`,
      size: media.size || media.file?.size || 0,
      type: media.type || (media.file?.type?.startsWith('image/') ? 'image' : 'video'),
      url: media.url,
      file: media.file
    }

    if (baseData.type === 'video') {
      const state = getVideoState(index)
      return {
        ...baseData,
        cover: getSelectedCoverPhoto(index),
        trimStart: state.trimStart,
        trimEnd: state.trimEnd
      }
    }

    return baseData
  })

  emit('next', mediaData)
}

function handleClose() {
  // Clean up blob URLs
  props.mediaItems.forEach((item: any) => {
    if (item.url?.startsWith('blob:')) {
      URL.revokeObjectURL(item.url)
    }
  })
  
  emit('close')
}

function handleBackdropClick() {
  handleClose()
}
</script>