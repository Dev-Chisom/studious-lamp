<template>
  <Modal v-if="isOpen" @close="close" size="xl">
    <div class="w-full max-w-2xl mx-auto p-0">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 pt-6 pb-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ t('mediaLibrary.title') || 'Media' }}
        </h2>
        <!-- <button 
          type="button"
          @click="close"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Icon name="lucide:x" class="h-5 w-5" />
        </button> -->
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 py-3 text-center font-medium transition',
            activeTab === tab.key
              ? 'border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800'
              : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
          ]"
        >
          {{ t(tab.label) || (tab.key === 'library' ? 'Media Library' : 'From Device') }}
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="p-6">
        <!-- Media Library Tab -->
        <div v-if="activeTab === 'library'">
          <!-- <div class="mb-4 flex items-center gap-2">
            <DebouncedInput v-model="search" :placeholder="t('mediaLibrary.search') || 'Search media...'" class="w-full" />
          </div> -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <Icon name="lucide:loader-2" class="animate-spin h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div v-else-if="filteredMedia.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            {{ t('mediaLibrary.noMedia') || 'No media found' }}
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="media in filteredMedia"
              :key="media.id"
              @click="toggleSelect(media)"
              :class="[
                'relative rounded-lg border transition cursor-pointer overflow-hidden',
                selectedIds.includes(media.id)
                  ? 'border-primary-600 dark:border-primary-400 ring-2 ring-primary-500 dark:ring-primary-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-400'
              ]"
            >
              <img v-if="media.type === 'image'" :src="media.url" class="w-full h-32 object-cover" />
              <div v-else-if="media.type === 'video'" class="relative w-full h-32">
                <video :src="media.url" class="w-full h-full object-cover" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="bg-black/50 rounded-full p-2">
                    <Icon name="lucide:play" class="h-5 w-5 text-white" />
                  </div>
                </div>
                <div v-if="media.duration" class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {{ formatDuration(media.duration) }}
                </div>
              </div>
              <div v-if="selectedIds.includes(media.id)" class="absolute top-2 left-2 bg-primary-600 dark:bg-primary-400 text-white rounded-full p-1">
                <Icon name="lucide:check" class="h-4 w-4" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-xs text-white px-2 py-1 truncate">
                {{ media.name }}
              </div>
              <!-- <button 
                type="button" 
                @click.stop="removeMedia(media)" 
                class="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full p-1 text-error-600 dark:text-error-200 hover:bg-error-200 dark:hover:bg-error-600"
              >
                <Icon name="lucide:trash-2" class="h-4 w-4" />
              </button> -->
            </div>
          </div>
        </div>
        
        <!-- From Device Tab -->
        <div v-else>
          <!-- Pick from device button -->
          <button
            type="button"
            class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors mt-3"
            @click="() => deviceFileInput?.click()"
          >
            Pick from device & continue
          </button>
          
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
            Maximum {{ MAX_FILES }} files allowed
          </p>
          
          <!-- Selected files list -->
          <div v-if="selectedFiles.length > 0" class="space-y-3 mb-6">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                  <Icon 
                    :name="file.type === 'image' ? 'lucide:image' : 'lucide:video'" 
                    class="h-6 w-6 text-gray-500 dark:text-gray-400" 
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="removeSelectedFile(index)"
                class="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Icon name="lucide:x" class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <input
            ref="deviceFileInput"
            type="file"
            accept="image/*,video/*"
            multiple
            class="hidden"
            @change="onFilesSelected"
          />
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex justify-end border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
          :disabled="!canProceed"
          :class="{'opacity-50 cursor-not-allowed': !canProceed}"
          @click="handleNext"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <MediaPreviewModal
        v-if="showPreviewModal"
        :is-open="showPreviewModal"
        :media-items="previewMediaItems"
        :current-index="previewCurrentIndex"
        :enable-video-edit="true"
        :show-edit="true"
        :show-next-button="true"
        :max-files="MAX_FILES"
        :is-uploading="isUploading"
        :upload-progress="uploadProgress"
        @close="closePreviewModal"
        @add-media="onAddMedia"
        @update:currentIndex="updatePreviewIndex"
        @next="handleBatchUpload"
      />
    </Teleport>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'
import DebouncedInput from './DebouncedInput.vue'
import MediaPreviewModal from './MediaPreviewModal.vue'

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', files: any[]): void
  (e: 'upload-complete', results: any[]): void
}>()

const { t } = useI18n()

interface MediaItem {
  id: string
  url: string
  name: string
  type: 'image' | 'video'
  size?: number
  duration?: number
  file?: File
}

const MAX_FILES = 10

const tabs = [
  { key: 'library', label: 'mediaLibrary.tabLibrary' },
  { key: 'device', label: 'mediaLibrary.tabDevice' }
]
const activeTab = ref<'library' | 'device'>('device')
const search = ref('')
const loading = ref(false)
const mediaFiles = ref<MediaItem[]>([])
const selectedIds = ref<string[]>([])
const selectedFiles = ref<MediaItem[]>([])
const deviceFileInput = ref<HTMLInputElement | null>(null)

// Preview modal state
const showPreviewModal = ref(false)
const previewFiles = ref<File[]>([])
const previewCurrentIndex = ref(0)
const isUploading = ref(false)
const uploadProgress = ref({ completed: 0, total: 0 })

// Add dummy media files for the library tab
onMounted(() => {
  mediaFiles.value = [
    {
      id: '1',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Beach sunset.jpg',
      type: 'image',
      size: 1240000
    },
    {
      id: '2',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Product demo.mp4',
      type: 'video',
      size: 8500000,
      duration: 125
    },
    {
      id: '3',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Team photo.jpg',
      type: 'image',
      size: 2800000
    },
    {
      id: '4',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Office tour.mp4',
      type: 'video',
      size: 15000000,
      duration: 210
    },
    {
      id: '5',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Conference presentation.jpg',
      type: 'image',
      size: 3500000
    },
    {
      id: '6',
      url: '/placeholder.svg?height=300&width=400',
      name: 'Product showcase.jpg',
      type: 'image',
      size: 2100000
    }
  ]
})

// Reset when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedIds.value = []
    selectedFiles.value = []
    previewFiles.value = []
    loading.value = false
    isUploading.value = false
    uploadProgress.value = { completed: 0, total: 0 }
  }
})

const filteredMedia = computed(() => {
  if (!search.value) return mediaFiles.value
  return mediaFiles.value.filter(m => m.name.toLowerCase().includes(search.value.toLowerCase()))
})

const canProceed = computed(() => {
  if (activeTab.value === 'library') {
    return selectedIds.value.length > 0
  } else {
    return selectedFiles.value.length > 0
  }
})

const previewMediaItems = computed(() =>
  previewFiles.value.map((file, index) => ({
    id: `preview-${index}`,
    url: URL.createObjectURL(file),
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    file
  }))
)

function toggleSelect(media: MediaItem) {
  if (selectedIds.value.includes(media.id)) {
    selectedIds.value = selectedIds.value.filter(id => id !== media.id)
  } else {
    selectedIds.value.push(media.id)
  }
}

function removeMedia(media: MediaItem) {
  mediaFiles.value = mediaFiles.value.filter(m => m.id !== media.id)
  selectedIds.value = selectedIds.value.filter(id => id !== media.id)
}

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const files = Array.from(input.files)
  const remainingSlots = MAX_FILES - previewFiles.value.length
  
  if (remainingSlots <= 0) {
    alert(`Maximum ${MAX_FILES} files allowed`)
    return
  }
  
  const filesToAdd = files.slice(0, remainingSlots)
  if (filesToAdd.length < files.length) {
    alert(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`)
  }
  
  previewFiles.value.push(...filesToAdd)
  previewCurrentIndex.value = previewFiles.value.length - filesToAdd.length
  showPreviewModal.value = true
  
  // Reset input
  if (deviceFileInput.value) {
    deviceFileInput.value.value = ''
  }
}

function removeSelectedFile(index: number) {
  const file = selectedFiles.value[index]
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url)
  }
  selectedFiles.value.splice(index, 1)
}

function closePreviewModal() {
  // Revoke object URLs to prevent memory leaks
  previewMediaItems.value.forEach(item => {
    URL.revokeObjectURL(item.url)
  })
  showPreviewModal.value = false
  previewCurrentIndex.value = 0
  previewFiles.value = []
}

// Handle adding new media to the preview
async function onAddMedia(files: File[]) {
  if (!files || files.length === 0) return
  
  const remainingSlots = MAX_FILES - previewFiles.value.length
  if (remainingSlots <= 0) {
    alert(`Maximum ${MAX_FILES} files allowed`)
    return
  }
  
  const filesToAdd = files.slice(0, remainingSlots)
  if (filesToAdd.length < files.length) {
    alert(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`)
  }
  
  previewFiles.value.push(...filesToAdd)
}

// Handle preview index updates
function updatePreviewIndex(newIndex: number) {
  previewCurrentIndex.value = newIndex
}

// Handle batch upload from preview modal
async function handleBatchUpload(mediaData: any[]) {
  if (mediaData.length === 0) return
  
  isUploading.value = true
  uploadProgress.value = { completed: 0, total: mediaData.length }
  
  const uploadResults = []
  
  try {
    for (let i = 0; i < mediaData.length; i++) {
      const media = mediaData[i]
      
      try {
        // Simulate upload process - replace with your actual upload logic
        const result = await uploadFile(media)
        uploadResults.push({ success: true, data: result, originalMedia: media })
        
        uploadProgress.value.completed = i + 1
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`Failed to upload ${media.name}:`, error)
        uploadResults.push({ success: false, error, originalMedia: media })
        uploadProgress.value.completed = i + 1
      }
    }
    
    // Process successful uploads and add to selected files
    const successfulUploads = uploadResults.filter(result => result.success)
    const newSelectedFiles = successfulUploads.map(result => ({
      id: result.data.id || `uploaded-${Date.now()}-${Math.random()}`,
      url: result.data.url || result.originalMedia.url,
      name: result.originalMedia.name,
      type: result.originalMedia.type,
      size: result.originalMedia.file?.size || 0,
      cover: result.originalMedia.cover,
      duration: result.originalMedia.type === 'video' ? result.originalMedia.trimEnd - result.originalMedia.trimStart : undefined
    }))
    
    selectedFiles.value = [...selectedFiles.value, ...newSelectedFiles]
    
    // Close preview modal
    closePreviewModal()
    
    // Emit completion event
    emit('upload-complete', uploadResults)
    
  } catch (error) {
    console.error('Batch upload failed:', error)
  } finally {
    isUploading.value = false
  }
}

// Mock upload function - replace with your actual upload implementation
async function uploadFile(mediaData: any): Promise<any> {
  const formData = new FormData()
  formData.append('file', mediaData.file)
  
  // Add video editing metadata if it's a video
  if (mediaData.type === 'video') {
    formData.append('cover', mediaData.cover || '')
    formData.append('trimStart', mediaData.trimStart?.toString() || '0')
    formData.append('trimEnd', mediaData.trimEnd?.toString() || '0')
    formData.append('muted', mediaData.muted?.toString() || 'false')
  }
  
  // Replace this with your actual upload endpoint
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
  
  return await response.json()
}

function handleNext() {
  if (!canProceed.value) return
  
  if (activeTab.value === 'library') {
    const selected = mediaFiles.value.filter(m => selectedIds.value.includes(m.id))
    emit('select', selected)
  } else {
    emit('select', selectedFiles.value)
  }
  
  close()
}

function close() {
  // Clean up any blob URLs
  selectedFiles.value.forEach(file => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
  })
  
  // Clean up preview URLs
  previewMediaItems.value.forEach(item => {
    URL.revokeObjectURL(item.url)
  })
  
  emit('close')
}

// Format file size
function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format video duration
function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>