<template>
  <div
    v-if="isOpen"
    class="fixed z-[900] inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    @click.self="close"
  >
    <div class="relative w-[90vw] h-[90vh] max-w-6xl max-h-[90vh] flex flex-col md:flex-row">
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors"
        style="z-index: 300"
        @click.stop="close"
      >
        <Icon name="lucide:x" class="h-6 w-6" />
      </button>

      <!-- Add Media Button (top-left, only when showEdit is true) -->
      <button
        v-if="showEdit && mediaItems.length < maxFiles"
        @click="triggerAddMedia"
        class="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
        title="Add more media"
      >
        <Icon name="lucide:plus" class="w-6 h-6 text-primary-600" />
      </button>
      <input
        ref="addMediaInput"
        type="file"
        accept="image/*,video/*"
        multiple
        class="hidden"
        @change="onAddMedia"
      />

      <!-- File limit warning -->
      <div 
        v-if="showEdit && mediaItems.length >= maxFiles"
        class="absolute top-4 left-4 z-50 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-lg text-sm"
      >
        Maximum {{ maxFiles }} files allowed
      </div>

      <!-- Main Media Area -->
      <div
        class="relative flex-1 flex items-center justify-center bg-neutral-900 rounded-l-xl overflow-hidden"
        :class="{ 
          'rounded-r-xl': !showSidebar && !showVideoEditSidebar,
        }"
      >
        <Swiper
          v-if="mediaItems.length > 0"
          :modules="[Navigation, Keyboard]"
          :initial-slide="internalCurrentIndex"
          :space-between="30"
          :centered-slides="true"
          :keyboard="{ enabled: true }"
          :navigation="true"
          :loop="false"
          class="w-full h-full"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
          @after-init="onSwiperInit"
        >
          <SwiperSlide v-for="(media, index) in mediaItems" :key="`${media.id || index}-${media.url}`">
            <div class="w-full h-full flex flex-col items-center justify-center">
              <img
                v-if="media.type === 'image'"
                :src="media.url"
                class="max-w-full max-h-full w-auto h-auto object-contain"
              />
              <div v-else-if="media.type === 'video'" class="w-full h-full flex flex-col items-center justify-center relative">
                <video
                  :ref="el => setVideoRef(el, index)"
                  :src="media.url"
                  controls
                  :muted="isMuted"
                  class="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                  @play="onPlay"
                  @pause="onPause"
                  @loadedmetadata="(e) => onVideoLoaded(e, index)"
                  @timeupdate="onVideoTimeUpdate"
                />
                <!-- Cover overlay -->
                <div 
                  v-if="hasSelectedCover(index) && !isVideoPlaying"
                  class="absolute inset-0 flex items-center justify-center cursor-pointer"
                  style="z-index: 10;"
                  @click="playVideoFromCover"
                >
                  <img
                    :src="getSelectedCoverPhoto(index)"
                    class="w-full h-full object-contain"
                  />
                  <!-- Play button overlay -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
                      <Icon name="lucide:play" class="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Empty state when no media -->
        <div v-else class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <Icon name="lucide:image" class="w-16 h-16 mb-4" />
          <p class="text-lg font-medium mb-2">No media selected</p>
          <p class="text-sm">Add some files to get started</p>
        </div>
      </div>

      <!-- Video Edit Sidebar -->
      <div
        v-if="showVideoEditSidebar && currentMedia?.type === 'video'"
        class="w-full md:w-96 bg-white dark:bg-gray-900 border-t md:border-l border-gray-200 dark:border-gray-800 flex flex-col p-4 md:p-6"
      >
        <!-- Cover Photo Selection -->
        <div class="mb-4 md:mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-700 dark:text-gray-200 font-semibold">{{ t('coverPhoto') }}</span>
            <label class="text-xs text-primary-400 cursor-pointer hover:underline">
              {{ t('selectFromComputer') }}
              <input type="file" accept="image/*" class="hidden" @change="onCustomCoverChange" />
            </label>
          </div>
          
          <!-- Show message when no cover is selected -->
          <div v-if="!hasSelectedCover(internalCurrentIndex) && !isGeneratingThumbs" class="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {{ t('selectThumbnailToCover') || 'Select a thumbnail to use as cover photo' }}
          </div>
          
          <div class="flex gap-2 overflow-x-auto pb-2">
            <template v-if="!isGeneratingThumbs">
              <div
                v-for="(thumb, i) in getCurrentThumbnails()"
                :key="i"
                class="relative cursor-pointer rounded border-2 hover:border-primary-300 transition-colors"
                :class="i === getCurrentSelectedIndex() && !getCurrentCustomCover() ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'"
                @click="selectCover(i)"
              >
                <img :src="thumb" class="w-20 h-12 object-cover rounded" />
              </div>
              <div 
                v-if="getCurrentCustomCover()" 
                class="relative rounded border-2 border-primary-500 cursor-pointer"
                @click="clearCover"
              >
                <img :src="getCurrentCustomCover()" class="w-20 h-12 object-cover rounded" />
                <span class="absolute top-1 right-1 bg-primary-500 text-white rounded-full p-1">
                  <Icon name="lucide:check" class="h-3 w-3" />
                </span>
              </div>
            </template>
            <template v-else>
              <div class="w-20 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" v-for="i in 10" :key="i"></div>
            </template>
          </div>
          
          <!-- Clear cover button -->
          <button 
            v-if="hasSelectedCover(internalCurrentIndex)"
            @click="clearCover"
            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
          >
            {{ t('clearCover') || 'Clear cover photo' }}
          </button>
        </div>
        
        <!-- Trim Timeline -->
        <div class="mb-4 md:mb-6">
          <span class="text-xs text-gray-700 dark:text-gray-200 font-semibold">{{ t('trim') }}</span>
          <div class="relative mt-3 mb-2">
            <!-- Timeline Thumbnails -->
            <div id="trim-timeline" class="flex gap-1 overflow-x-auto mb-2 relative select-none" style="height: 40px;" @mousedown.stop.prevent>
              <div v-for="(thumb, i) in getCurrentThumbnails()" :key="'timeline-'+i" class="w-12 h-8 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <img :src="thumb" class="w-full h-full object-cover" />
              </div>
              
              <!-- Highlighted Trim Area -->
              <div
                v-if="getCurrentThumbnails().length > 0"
                class="absolute top-0 h-8 bg-primary-500/20 z-0"
                :style="{
                  left: `${(getCurrentTrimStart() / getCurrentVideoDuration()) * 100}%`,
                  width: `${((getCurrentTrimEnd() - getCurrentTrimStart()) / getCurrentVideoDuration()) * 100}%`
                }"
              ></div>
              
              <!-- Draggable Handles -->
              <div
                v-if="getCurrentThumbnails().length > 0"
                class="absolute top-0 left-0 h-8 w-2 bg-primary-500 rounded cursor-ew-resize z-10"
                :style="{ left: `${(getCurrentTrimStart() / getCurrentVideoDuration()) * 100}%` }"
                @mousedown.stop.prevent="onTimelineMouseDown($event, 'start')"
              ></div>
              <div
                v-if="getCurrentThumbnails().length > 0"
                class="absolute top-0 left-0 h-8 w-2 bg-primary-500 rounded cursor-ew-resize z-10"
                :style="{ left: `${(getCurrentTrimEnd() / getCurrentVideoDuration()) * 100}%` }"
                @mousedown.stop.prevent="onTimelineMouseDown($event, 'end')"
              ></div>
            </div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400">{{ getCurrentTrimStart().toFixed(1) }}s</span>
              <span class="text-xs text-gray-400">{{ getCurrentTrimEnd().toFixed(1) }}s</span>
            </div>
          </div>
        </div>
        
        <!-- Sound Toggle -->
        <div class="flex items-center gap-3 mt-1 md:mt-2">
          <span class="text-xs text-gray-700 dark:text-gray-200 font-semibold">{{ t('soundOn') }}</span>
          <label class="inline-flex items-center cursor-pointer relative">
            <input type="checkbox" v-model="isMuted" @change="onSoundToggle" class="sr-only peer" />
            <div class="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:bg-gray-700 rounded-full peer dark:peer-focus:ring-primary-400 transition-all duration-200"></div>
            <div
              class="absolute left-1 top-1 bg-white border border-gray-300 dark:bg-gray-900 dark:border-gray-700 rounded-full w-4 h-4 transition-all duration-200"
              :class="isMuted ? 'translate-x-0' : 'translate-x-4'"
            ></div>
          </label>
        </div>
      </div>

      <!-- Thread/Comments Sidebar (only if not editing video) -->
      <div
        v-else-if="showSidebar"
        class="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex rounded-r-xl"
      >
        <!-- Thread header -->
        <div
          class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-r-xl"
        >
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
          class="p-4 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900"
        >
          <div class="flex items-center">
            <img :src="currentUser.avatar" class="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
            <input
              v-model="newComment"
              type="text"
              placeholder="Add a comment..."
              class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @keydown.enter.prevent="sendComment"
              @keydown.stop
              @click.stop
            />
            <button
              class="ml-2 text-primary-600 dark:text-primary-400 font-semibold text-sm disabled:opacity-50"
              :disabled="!newComment.trim()"
              @click.stop="sendComment"
            >
              Post
            </button>
          </div>
        </div>
      </div>

  <!-- Navigation and Next Button Container -->
<div class="absolute bottom-4 w-full flex justify-between items-center px-4 z-20">
  <!-- Navigation dots - centered -->
  <div class="flex-1 flex justify-center">
    <div v-if="mediaItems.length > 1" class="flex space-x-2">
      <button
        v-for="(_, index) in mediaItems"
        :key="index"
        type="button"
        class="w-2 h-2 rounded-full transition-colors"
        :class="[index === internalCurrentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75']"
        @click.stop="goToSlide(index)"
      />
    </div>
  </div>
  
  <!-- Next button - positioned to the right -->
  <div v-if="showNextButton" class="ml-4">
    <button
      @click="handleNext"
      type="button"
      :disabled="mediaItems.length === 0 || isUploading"
      class="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
    >
      <span v-if="isUploading" class="flex items-center justify-center">
        <Icon name="lucide:loader-2" class="animate-spin w-4 h-4 mr-2" />
        Uploading {{ uploadProgress.completed }}/{{ uploadProgress.total }}...
      </span>
      <span v-else>Next</span>
    </button>
  </div>
</div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation as SwiperNavigation, Keyboard as SwiperKeyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useI18n } from 'vue-i18n'

const Navigation = SwiperNavigation
const Keyboard = SwiperKeyboard

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
    default: false,
  },
  messages: {
    type: Array,
    default: () => [],
  },
  currentUser: {
    type: Object,
    default: () => ({ name: '', avatar: '' }),
  },
  enableVideoEdit: {
    type: Boolean,
    default: false,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
  showNextButton: {
    type: Boolean,
    default: false,
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
  uploadProgress: {
    type: Object,
    default: () => ({ completed: 0, total: 0 })
  }
})

const emit = defineEmits([
  'close', 
  'update:currentIndex', 
  'send-message', 
  'update:cover', 
  'update:trim', 
  'update:sound', 
  'add-media',
  'next',
  'remove-media'
])
const { t } = useI18n()

// Internal state management
const internalCurrentIndex = ref(props.currentIndex)
const swiper = ref<any>(null)
const swiperInitialized = ref(false)
const videoRefs = ref<Map<number, HTMLVideoElement>>(new Map())
const isVideoPlaying = ref(false)
const newComment = ref('')
const isMuted = ref(false)
const addMediaInput = ref<HTMLInputElement | null>(null)

// Video editing state - now per video index
const videoStates = ref<Map<number, {
  coverThumbnails: string[]
  selectedCoverIndex: number | null
  customCover: string | null
  trimStart: number
  trimEnd: number
  videoDuration: number
  isGeneratingThumbs: boolean
}>>(new Map())

const draggingHandle = ref<'start' | 'end' | null>(null)

// Computed properties
const currentMedia = computed(() => props.mediaItems?.[internalCurrentIndex.value] || {})
const showVideoEditSidebar = computed(() => props.enableVideoEdit && currentMedia.value.type === 'video')

// Helper functions to get current video state
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

function getCurrentThumbnails() {
  return getVideoState(internalCurrentIndex.value).coverThumbnails
}

function getCurrentSelectedIndex() {
  return getVideoState(internalCurrentIndex.value).selectedCoverIndex
}

function getCurrentCustomCover() {
  return getVideoState(internalCurrentIndex.value).customCover
}

function getCurrentTrimStart() {
  return getVideoState(internalCurrentIndex.value).trimStart
}

function getCurrentTrimEnd() {
  return getVideoState(internalCurrentIndex.value).trimEnd
}

function getCurrentVideoDuration() {
  return getVideoState(internalCurrentIndex.value).videoDuration
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

// Watch for external currentIndex changes
watch(() => props.currentIndex, (newIndex) => {
  if (newIndex !== internalCurrentIndex.value) {
    internalCurrentIndex.value = newIndex
    if (swiperInitialized.value && swiper.value) {
      swiper.value.slideTo(newIndex)
    }
  }
})

// Watch for mediaItems changes (when new media is added)
watch(() => props.mediaItems.length, async (newLength, oldLength) => {
  if (newLength > oldLength && swiperInitialized.value) {
    // New media was added
    const firstNewItemIndex = oldLength // Index of the first newly added item
    
    // Update swiper and navigate to the first new item
    await nextTick()
    if (swiper.value) {
      swiper.value.update()
      // Navigate to the first newly added item
      swiper.value.slideTo(firstNewItemIndex)
      internalCurrentIndex.value = firstNewItemIndex
      emit('update:currentIndex', firstNewItemIndex)
    }
  }
})

// Format time for comments
const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Swiper handlers
function onSwiper(swiperInstance: any) {
  swiper.value = swiperInstance
}

function onSwiperInit() {
  swiperInitialized.value = true
  // Ensure we're on the correct slide after initialization
  if (swiper.value && internalCurrentIndex.value !== swiper.value.activeIndex) {
    swiper.value.slideTo(internalCurrentIndex.value)
  }
}

function onSlideChange() {
  if (swiper.value && swiperInitialized.value) {
    const newIndex = swiper.value.activeIndex
    if (newIndex !== internalCurrentIndex.value) {
      internalCurrentIndex.value = newIndex
      emit('update:currentIndex', newIndex)
    }
  }
}

function goToSlide(index: number) {
  if (swiper.value) {
    swiper.value.slideTo(index)
  }
}

// Video ref management
function setVideoRef(el: HTMLVideoElement | null, index: number) {
  if (el) {
    videoRefs.value.set(index, el)
  } else {
    videoRefs.value.delete(index)
  }
}

function getCurrentVideoRef() {
  return videoRefs.value.get(internalCurrentIndex.value) || null
}

// Close modal
function close() {
  // Pause all videos
  videoRefs.value.forEach(video => {
    video.pause()
  })
  isVideoPlaying.value = false
  emit('close')
}

// Video event handlers
function onPlay() {
  isVideoPlaying.value = true
  const video = getCurrentVideoRef()
  if (video) {
    const state = getVideoState(internalCurrentIndex.value)
    // Ensure video plays from trim start
    if (video.currentTime < state.trimStart || video.currentTime > state.trimEnd) {
      video.currentTime = state.trimStart
    }
  }
}

function onPause() {
  isVideoPlaying.value = false
}

function onVideoTimeUpdate() {
  const video = getCurrentVideoRef()
  if (!video) return
  
  const state = getVideoState(internalCurrentIndex.value)
  // Loop video within trim boundaries
  if (video.currentTime >= state.trimEnd) {
    video.currentTime = state.trimStart
  }
}

// Handle video loaded event
function onVideoLoaded(event: Event, index: number) {
  const video = event.target as HTMLVideoElement
  if (!video) return
  
  const state = getVideoState(index)
  state.videoDuration = video.duration
  state.trimStart = 0
  state.trimEnd = video.duration
  
  // Generate thumbnails once video is loaded
  generateThumbnails(video, index)
}

// Play video when cover is clicked
function playVideoFromCover() {
  const video = getCurrentVideoRef()
  if (video) {
    video.play()
  }
}

// Comments
function sendComment() {
  if (newComment.value.trim()) {
    emit('send-message', newComment.value.trim())
    newComment.value = ''
  }
}

// Cover photo selection
function selectCover(index: number) {
  const state = getVideoState(internalCurrentIndex.value)
  state.selectedCoverIndex = index
  state.customCover = null
  const coverPhoto = state.coverThumbnails[index]
  emit('update:cover', { index: internalCurrentIndex.value, cover: coverPhoto })
}

function onCustomCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = () => {
    const state = getVideoState(internalCurrentIndex.value)
    state.customCover = reader.result as string
    state.selectedCoverIndex = null
    emit('update:cover', { index: internalCurrentIndex.value, cover: state.customCover })
  }
  reader.readAsDataURL(file)
}

// Clear cover selection
function clearCover() {
  const state = getVideoState(internalCurrentIndex.value)
  state.selectedCoverIndex = null
  state.customCover = null
  emit('update:cover', { index: internalCurrentIndex.value, cover: null })
}

// Improved thumbnail generation
async function generateThumbnails(video: HTMLVideoElement, index: number) {
  if (!video) return
  
  const state = getVideoState(index)
  state.coverThumbnails = []
  state.isGeneratingThumbs = true
  
  try {
    const count = 10
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
    
    // Generate thumbnails at regular intervals
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
          
          resolve()
        }
        
        video.addEventListener('seeked', onSeeked, { once: true })
      })
    }
    
    // Reset video position
    video.currentTime = 0
  } catch (error) {
    console.error('Error generating thumbnails:', error)
  } finally {
    state.isGeneratingThumbs = false
  }
}

// Trim functionality
function onTimelineMouseDown(e: MouseEvent, handle: 'start' | 'end') {
  e.preventDefault()
  e.stopPropagation()
  draggingHandle.value = handle
  
  document.addEventListener('mousemove', onTimelineMouseMove)
  document.addEventListener('mouseup', onTimelineMouseUp)
}

function onTimelineMouseMove(e: MouseEvent) {
  if (!draggingHandle.value) return
  
  const timeline = document.getElementById('trim-timeline')
  if (!timeline) return
  
  const rect = timeline.getBoundingClientRect()
  let percent = (e.clientX - rect.left) / rect.width
  percent = Math.max(0, Math.min(1, percent))
  
  const state = getVideoState(internalCurrentIndex.value)
  const time = percent * state.videoDuration
  const minGap = 0.5
  
  if (draggingHandle.value === 'start') {
    state.trimStart = Math.min(time, state.trimEnd - minGap)
    const video = getCurrentVideoRef()
    if (video) {
      video.currentTime = state.trimStart
    }
  } else if (draggingHandle.value === 'end') {
    state.trimEnd = Math.max(time, state.trimStart + minGap)
    const video = getCurrentVideoRef()
    if (video) {
      video.currentTime = state.trimEnd
    }
  }
}

function onTimelineMouseUp() {
  if (!draggingHandle.value) return
  
  draggingHandle.value = null
  document.removeEventListener('mousemove', onTimelineMouseMove)
  document.removeEventListener('mouseup', onTimelineMouseUp)
  
  const state = getVideoState(internalCurrentIndex.value)
  emit('update:trim', { 
    index: internalCurrentIndex.value, 
    start: state.trimStart, 
    end: state.trimEnd 
  })
}

function onSoundToggle() {
  const video = getCurrentVideoRef()
  if (video) {
    video.muted = isMuted.value
  }
  emit('update:sound', { index: internalCurrentIndex.value, muted: isMuted.value })
}

function triggerAddMedia() {
  addMediaInput.value?.click()
}

async function onAddMedia(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  
  // Check file limit
  const remainingSlots = props.maxFiles - props.mediaItems.length
  if (remainingSlots <= 0) {
    alert(`Maximum ${props.maxFiles} files allowed`)
    return
  }
  
  const filesToAdd = Array.from(files).slice(0, remainingSlots)
  if (filesToAdd.length < files.length) {
    alert(`Only ${filesToAdd.length} files added. Maximum ${props.maxFiles} files allowed.`)
  }
  
  emit('add-media', filesToAdd)
  
  // Clear the input
  if (addMediaInput.value) {
    addMediaInput.value.value = ''
  }
}

function handleNext() {
  if (props.mediaItems.length === 0) return
  
  // Collect all video editing data
  const mediaData = props.mediaItems.map((media, index) => {
    const baseData = {
      ...media,
      index
    }
    
    if (media.type === 'video') {
      const state = getVideoState(index)
      return {
        ...baseData,
        cover: getSelectedCoverPhoto(index),
        trimStart: state.trimStart,
        trimEnd: state.trimEnd,
        muted: isMuted.value
      }
    }
    
    return baseData
  })
  
  emit('next', mediaData)
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