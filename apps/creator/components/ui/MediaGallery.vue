<template>
  <Modal v-if="isOpen" @close="close" size="xl">
    <div class="w-full max-w-2xl mx-auto p-0">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 pt-6 pb-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ t('mediaLibrary.title') }}
        </h2>
      </div>
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 px-6">
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
          {{ t(tab.label) }}
        </button>
      </div>
      <!-- Tab Content -->
      <div class="p-6">
        <!-- Media Library Tab -->
        <div v-if="activeTab === 'library'">
          <div class="mb-4 flex items-center gap-2">
            <DebouncedInput v-model="search" :placeholder="t('mediaLibrary.search')" class="w-full" />
          </div>
          <div v-if="loading" class="flex justify-center items-center py-8">
            <Icon name="lucide:loader-2" class="animate-spin h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div v-else-if="filteredMedia.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            {{ t('mediaLibrary.noMedia') }}
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
              <video v-else :src="media.url" class="w-full h-32 object-cover" />
              <div v-if="selectedIds.includes(media.id)" class="absolute top-2 left-2 bg-primary-600 dark:bg-primary-400 text-white rounded-full p-1">
                <Icon name="lucide:check" class="h-4 w-4" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-xs text-white px-2 py-1 truncate">
                {{ media.name }}
              </div>
              <button @click.stop="removeMedia(media)" class="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full p-1 text-error-600 dark:text-error-200 hover:bg-error-200 dark:hover:bg-error-600">
                <Icon name="lucide:trash-2" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <!-- From Device Tab -->
        <div v-else>
          <div class="mb-4">
            <button
              class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition w-full"
              @click="() => deviceFileInput?.click()"
            >
              Pick from device & continue
            </button>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Maximum {{ MAX_FILES }} files allowed
            </p>
          </div>
          
          <!-- Selected files list -->
          <div v-if="previewFiles.length > 0" class="space-y-2 mb-4">
            <div
              v-for="(file, index) in previewFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <Icon 
                    :name="file.type.startsWith('image/') ? 'lucide:image' : 'lucide:video'" 
                    class="w-5 h-5 text-gray-500 dark:text-gray-400" 
                  />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <button
                @click="removeFile(index)"
                type="button"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <input
            ref="deviceFileInput"
            type="file"
            accept="image/*,video/*"
            multiple
            class="hidden"
            @change="e => onDeviceFilesPicked(e.target.files)"
          />
          
          <Teleport to="body">
            <media-preview-modal
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
        </div>
      </div>
      <!-- Footer -->
      <div class="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
        <BaseButton type="button" variant="primary" class="w-full" :disabled="!canSelect" @click="confirmSelection">
          {{ t('mediaLibrary.next') }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'
import BaseButton from './BaseButton.vue'
import DebouncedInput from './DebouncedInput.vue'
import MediaPreviewModal from './MediaPreviewModal.vue'
import { useContentStore } from '../../store/content'

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', files: MediaItem[] | any[]): void
  (e: 'upload-complete', results: any[]): void
}>()

const { t } = useI18n()

interface MediaItem {
  id: string
  url: string
  name: string
  type: 'image' | 'video'
}

const MAX_FILES = 10

const tabs = [
  { key: 'library', label: 'mediaLibrary.tabLibrary' },
  { key: 'device', label: 'mediaLibrary.tabDevice' }
]
const activeTab = ref<'library' | 'device'>('library')
const search = ref('')
const loading = ref(false)
const mediaFiles = ref<MediaItem[]>([])
const selectedIds = ref<string[]>([])
const deviceFiles = ref<any[]>([])
const showPreviewModal = ref(false)
const previewFiles = ref<any[]>([])
const deviceFileInput = ref<HTMLInputElement | null>(null)
const previewCurrentIndex = ref(0)
const isUploading = ref(false)
const uploadProgress = ref({ completed: 0, total: 0 })

const contentStore = useContentStore()

// Only fetch media when the modal is opened
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    fetchMedia()
    // Reset selections when opening
    selectedIds.value = []
    deviceFiles.value = []
    previewFiles.value = []
    isUploading.value = false
    uploadProgress.value = { completed: 0, total: 0 }
  }
})

async function fetchMedia() {
  loading.value = true;
  try {
    await contentStore.fetchContent({ limit: 100 });
    
    mediaFiles.value = (contentStore.content?.posts || [])
      .flatMap((post: any) => {
        if (!post.mediaFiles || !Array.isArray(post.mediaFiles)) {
          return [];
        }
        
        return post.mediaFiles.map((media: any) => {
          const url = typeof media === 'string' ? media : 
                     typeof media?.url === 'string' ? media.url : '';
          
          if (!url) return null;
          
          return {
            id: url,
            url,
            name: url.split('/').pop() || 'unnamed',
            type: url.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
          };
        }).filter(Boolean);
      });
  } catch (error) {
    console.error('Failed to fetch media:', error);
  } finally {
    loading.value = false;
  }
}

const filteredMedia = computed(() => {
  if (!search.value) return mediaFiles.value
  return mediaFiles.value.filter((m: MediaItem) => m.name.toLowerCase().includes(search.value.toLowerCase()))
})

function toggleSelect(media: MediaItem) {
  if (selectedIds.value.includes(media.id)) {
    selectedIds.value = selectedIds.value.filter((id: string) => id !== media.id)
  } else {
    selectedIds.value.push(media.id)
  }
}

function removeMedia(media: MediaItem) {
  mediaFiles.value = mediaFiles.value.filter((m: MediaItem) => m.id !== media.id)
  selectedIds.value = selectedIds.value.filter((id: string) => id !== media.id)
}

function confirmSelection() {
  if (activeTab.value === 'library') {
    const selected = mediaFiles.value.filter((m: MediaItem) => selectedIds.value.includes(m.id))
    emit('select', selected)
  } else {
    emit('select', deviceFiles.value)
  }
  close()
}

function close() { 
  emit('close') 
}

const canSelect = computed(() =>
  (activeTab.value === 'library' && selectedIds.value.length > 0) ||
  (activeTab.value === 'device' && deviceFiles.value.length > 0)
)

function onDeviceFilesPicked(files: FileList | File[]) {
  if (!files || files.length === 0) return
  
  const remainingSlots = MAX_FILES - previewFiles.value.length
  if (remainingSlots <= 0) {
    alert(`Maximum ${MAX_FILES} files allowed`)
    return
  }
  
  const filesToAdd = Array.from(files).slice(0, remainingSlots)
  if (filesToAdd.length < files.length) {
    alert(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`)
  }
  
  previewFiles.value.push(...filesToAdd)
  previewCurrentIndex.value = previewFiles.value.length - filesToAdd.length // Go to first new file
  showPreviewModal.value = true
}

function removeFile(index: number) {
  previewFiles.value.splice(index, 1)
  if (previewCurrentIndex.value >= previewFiles.value.length) {
    previewCurrentIndex.value = Math.max(0, previewFiles.value.length - 1)
  }
}

function closePreviewModal() {
  // Revoke object URLs to prevent memory leaks
  previewMediaItems.value.forEach(item => {
    URL.revokeObjectURL(item.url)
  })
  showPreviewModal.value = false
  previewCurrentIndex.value = 0
}

const previewMediaItems = computed(() =>
  previewFiles.value.map((file, index) => ({
    id: `preview-${index}`, // Add unique ID with prefix
    url: URL.createObjectURL(file),
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    file // Keep reference to original file
  }))
)

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

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Handle batch upload
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
    
    // Emit completion event
    emit('upload-complete', uploadResults)
    
    // Close modal after successful upload
    setTimeout(() => {
      closePreviewModal()
      close()
    }, 1000)
    
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
</script>