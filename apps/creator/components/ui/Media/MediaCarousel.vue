<template>
  <div class="relative w-full h-full flex items-center justify-center select-none bg-black/95" @contextmenu.prevent>
    <!-- Navigation Arrows -->
    <button
      v-if="mediaItems.length > 1"
      type="button"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
      :disabled="currentIndex === 0"
      @click="goToPrevious"
    >
      <Icon name="lucide:chevron-left" class="w-7 h-7 text-white" />
    </button>

    <button
      v-if="mediaItems.length > 1"
      type="button"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
      :disabled="currentIndex === mediaItems.length - 1"
      @click="goToNext"
    >
      <Icon name="lucide:chevron-right" class="w-7 h-7 text-white" />
    </button>

    <!-- Media Display - Significantly Enhanced Sizing -->
    <div class="flex items-center justify-center w-full h-full p-4">
      <div
        v-if="currentMedia"
        class="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center"
      >
        <!-- Image - Much Larger Display -->
        <div v-if="currentMedia.type === 'image'" class="relative w-full h-full flex items-center justify-center">
          <img
            :src="currentMedia.thumbnailUrl || currentMedia.url"
            :alt="currentMedia.name || 'Image'"
            class="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none rounded-lg shadow-2xl"
            draggable="false"
            @load="onImageLoad"
            @contextmenu.prevent
            @dragstart.prevent
            @selectstart.prevent
            style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
          />
        </div>

        <!-- Video with Enhanced Security -->
        <div v-else-if="currentMedia.type === 'video'" class="relative w-full h-full flex items-center justify-center">
          <!-- Api.video Player with Enhanced Security -->
          <div v-if="currentMedia.apiVideoId" class="relative w-full h-full max-w-full max-h-full">
            <iframe
              ref="apiVideoIframe"
              :src="getApiVideoUrl(currentMedia.apiVideoId)"
              class="w-full h-full min-h-[70vh] max-h-[90vh] aspect-video select-none rounded-lg shadow-2xl"
              frameborder="0"
              scrolling="no"
              :allowfullscreen="false"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              @load="onApiVideoLoad"
              @contextmenu.prevent
              style="user-select: none; -webkit-user-select: none; pointer-events: auto;"
            ></iframe>
            
            <!-- Custom Cover Overlay for Api.video -->
            <div 
              v-if="hasSelectedCover && !isPlaying && currentMedia.coverUrl"
              class="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/20 select-none rounded-lg"
              @click="playApiVideo"
              @contextmenu.prevent
            >
              <img
                :src="currentMedia.coverUrl"
                class="w-full h-full object-contain select-none pointer-events-none rounded-lg"
                :alt="currentMedia.name || 'Video cover'"
                draggable="false"
                @contextmenu.prevent
                @dragstart.prevent
                @selectstart.prevent
                style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-black/60 rounded-full p-6 hover:bg-black/80 transition-colors backdrop-blur-sm">
                  <Icon name="lucide:play" class="w-12 h-12 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Fallback Native Video Player -->
          <div v-else class="relative w-full h-full max-w-full max-h-full">
            <video
              ref="videoRef"
              :src="currentMedia.url"
              class="w-full h-full max-w-full max-h-full object-contain select-none rounded-lg shadow-2xl"
              controls
              controlslist="nodownload nofullscreen noremoteplayback noplaybackrate"
              disablePictureInPicture
              disableRemotePlayback
              @play="onVideoPlay"
              @pause="onVideoPause"
              @loadedmetadata="onVideoLoadedMetadata"
              @timeupdate="onVideoTimeUpdate"
              @contextmenu.prevent
              @selectstart.prevent
              style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
            />
            
            <!-- Native Video Cover Overlay -->
            <div 
              v-if="hasSelectedCover && !isPlaying && currentMedia.coverUrl"
              class="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/20 select-none rounded-lg"
              @click="playVideoFromCover"
              @contextmenu.prevent
            >
              <img
                :src="currentMedia.coverUrl"
                class="w-full h-full object-contain select-none pointer-events-none rounded-lg"
                :alt="currentMedia.name || 'Video cover'"
                draggable="false"
                @contextmenu.prevent
                @dragstart.prevent
                @selectstart.prevent
                style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-black/60 rounded-full p-6 hover:bg-black/80 transition-colors backdrop-blur-sm">
                  <Icon name="lucide:play" class="w-12 h-12 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Media Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
          <div class="flex items-center space-x-6 text-white/90 text-sm"> 
            <span v-if="currentMedia.size" class="bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              {{ formatFileSize(currentMedia.size) }}
            </span>
            <span v-if="currentMedia.duration" class="bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              {{ formatDuration(currentMedia.duration) }}
            </span>
            <span v-if="currentMedia.apiVideoId" class="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              <Icon name="lucide:play-circle" class="w-4 h-4" />
              <span>Api.video</span>
            </span>
            <span v-if="currentMedia.uploadStatus" class="capitalize bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              {{ currentMedia.uploadStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Pagination Dots -->
    <div v-if="mediaItems.length > 1" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
      <button
        v-for="(item, index) in mediaItems"
        :key="item._id"
        class="w-3 h-3 rounded-full transition-all duration-200"
        :class="index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/40 hover:bg-white/60'"
        @click="goToIndex(index)"
      />
    </div>

    <!-- Loading State -->
    <div v-if="!currentMedia" class="flex items-center justify-center">
      <div class="text-white/60 text-lg">Loading media...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface MediaItem {
  _id: string
  url: string
  type: 'image' | 'video'
  ext: string
  size: number
  width?: number
  height?: number
  status: string
  uploadStatus: string
  coverUrl?: string
  apiVideoId?: string
  name?: string
  duration?: number
  thumbnailUrl?: string
}

const props = defineProps<{
  mediaItems: MediaItem[]
  currentIndex: number
  isPlaying: boolean
}>()

const emit = defineEmits<{
  (e: 'update:current-index', index: number): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'video-loaded', event: Event, index: number): void
  (e: 'api-video-loaded', videoId: string): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const apiVideoIframe = ref<HTMLIFrameElement | null>(null)

const currentMedia = computed(() => props.mediaItems[props.currentIndex])
const hasSelectedCover = computed(() => {
  return currentMedia.value?.coverUrl && !props.isPlaying
})

// Enhanced Api.video configuration with maximum security
const API_VIDEO_BASE_URL = 'https://embed.api.video'

function getApiVideoUrl(videoId: string): string {
  const params = new URLSearchParams({
    // Player behavior
    hideControls: 'false',
    autoplay: 'false',
    muted: 'false',
    loop: 'false',
    
    // Hide UI elements for security
    hideTitle: 'true',
    hideCredits: 'true',
    hideFullscreen: 'true',
    hideDownload: 'true',
    hideShare: 'true',
    hideSettings: 'true',
    hidePlaybackRate: 'true',
    hideVolume: 'false',
    hideSeek: 'false',
    hideBigPlayButton: 'false',
    
    // Security parameters
    contextMenu: 'false',
    rightClick: 'false',
    disableRemotePlayback: 'true',
    controlsList: 'nodownload nofullscreen noremoteplayback noplaybackrate',
    
    // Additional security
    allowDownload: 'false',
    allowFullscreen: 'false',
    allowPictureInPicture: 'false',
    
    // Branding and watermark removal
    hideWatermark: 'true',
    hideLogo: 'true'
  })
  
  return `${API_VIDEO_BASE_URL}/vod/${videoId}?${params.toString()}`
}

function goToPrevious() {
  if (props.currentIndex > 0) {
    pauseCurrentVideo()
    emit('update:current-index', props.currentIndex - 1)
  }
}

function goToNext() {
  if (props.currentIndex < props.mediaItems.length - 1) {
    pauseCurrentVideo()
    emit('update:current-index', props.currentIndex + 1)
  }
}

function goToIndex(index: number) {
  if (index !== props.currentIndex) {
    pauseCurrentVideo()
    emit('update:current-index', index)
  }
}

function pauseCurrentVideo() {
  // Pause native video
  if (videoRef.value) {
    videoRef.value.pause()
  }
  
  // For api.video, send pause message with enhanced error handling
  if (apiVideoIframe.value && currentMedia.value?.apiVideoId) {
    try {
      apiVideoIframe.value.contentWindow?.postMessage(
        { type: 'pause' },
        API_VIDEO_BASE_URL
      )
    } catch (error) {
      console.warn('Could not pause api.video player:', error)
    }
  }
}

function onImageLoad() {
  // Handle image load if needed
}

function onVideoPlay() {
  emit('play')
}

function onVideoPause() {
  emit('pause')
}

function onVideoLoadedMetadata(event: Event) {
  emit('video-loaded', event, props.currentIndex)
}

function onVideoTimeUpdate() {
  // Handle video time update if needed
}

function onApiVideoLoad() {
  if (currentMedia.value?.apiVideoId) {
    emit('api-video-loaded', currentMedia.value.apiVideoId)
  }
}

function playVideoFromCover() {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

function playApiVideo() {
  if (apiVideoIframe.value && currentMedia.value?.apiVideoId) {
    try {
      // Send play message to api.video iframe
      apiVideoIframe.value.contentWindow?.postMessage(
        { type: 'play' },
        API_VIDEO_BASE_URL
      )
      emit('play')
    } catch (error) {
      console.warn('Could not play api.video player:', error)
    }
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(seconds: number): string {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Enhanced keyboard navigation
function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      goToPrevious()
      break
    case 'ArrowRight':
      event.preventDefault()
      goToNext()
      break
    case 'Escape':
      event.preventDefault()
      // You can emit a close event here if needed
      break
    case ' ':
      event.preventDefault()
      // Toggle play/pause for videos
      if (currentMedia.value?.type === 'video') {
        if (props.isPlaying) {
          pauseCurrentVideo()
        } else if (videoRef.value) {
          videoRef.value.play()
        } else if (currentMedia.value?.apiVideoId) {
          playApiVideo()
        }
      }
      break
  }
}

// Enhanced message handling for api.video iframe
function handleApiVideoMessage(event: MessageEvent) {
  // Only accept messages from api.video domain
  if (!event.origin.includes('api.video')) return
  
  const { type, data } = event.data
  
  switch (type) {
    case 'play':
      emit('play')
      break
    case 'pause':
      emit('pause')
      break
    case 'ended':
      emit('pause')
      break
    case 'loadedmetadata':
      if (data?.duration && currentMedia.value) {
        // Update duration if not already set
        currentMedia.value.duration = data.duration
      }
      break
    case 'error':
      console.warn('Api.video player error:', data)
      break
  }
}

// Prevent context menu globally on the component
function preventContextMenu(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

// Prevent drag and drop
function preventDragStart(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

// Watch for media changes to reset player state
watch(() => props.currentIndex, () => {
  pauseCurrentVideo()
})

onMounted(() => {
  // Add event listeners
  window.addEventListener('message', handleApiVideoMessage)
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('contextmenu', preventContextMenu)
  document.addEventListener('dragstart', preventDragStart)
  document.addEventListener('selectstart', preventContextMenu)
  
  // Disable text selection on the entire component
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('message', handleApiVideoMessage)
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('contextmenu', preventContextMenu)
  document.removeEventListener('dragstart', preventDragStart)
  document.removeEventListener('selectstart', preventContextMenu)
  
  // Restore text selection
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
  
  // Pause any playing media
  pauseCurrentVideo()
})
</script>

<style scoped>
/* Additional security styles */
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* Prevent image dragging */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  pointer-events: none;
}

/* Prevent video controls manipulation */
video::-webkit-media-controls-download-button {
  display: none;
}

video::-webkit-media-controls-fullscreen-button {
  display: none;
}

video::-webkit-media-controls-picture-in-picture-button {
  display: none;
}

/* Enhanced iframe security */
iframe {
  pointer-events: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
button:hover {
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>