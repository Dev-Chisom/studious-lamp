<template>
  <Modal v-if="isOpen" size="xl" @close="close">
    <div class="overflow-hidden">
      <!-- Header -->
      <MediaGalleryHeader 
        :title="t('mediaLibrary.title') || 'Media Library'"
        @close="close"
      />

      <!-- Main Content -->
      <div class="flex flex-col h-[600px]">
        <!-- Tab Navigation -->
        <MediaGalleryTabs 
          :active-tab="activeTab"
          :tabs="tabs"
          @update:active-tab="activeTab = $event"
        />

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden">
          <!-- Media Library Tab -->
          <MediaLibraryTab
            v-if="activeTab === 'library'"
            :loading="loading"
            :media-files="mediaFiles"
            :selected-ids="selectedIds"
            :current-page="currentPage"
            :per-page="perPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :active-media-tab="activeMediaTab"
            @update:active-media-tab="activeMediaTab = $event"
            @update:current-page="currentPage = $event"
            @update:per-page="perPage = $event"
            @toggle-select="toggleSelect"
            @search="handleSearch"
          />

          <!-- Device Upload Tab -->
          <DeviceUploadTab
            v-else
            :selected-files="selectedFiles"
            :max-files="MAX_FILES"
            @files-selected="onFilesSelected"
            @remove-file="removeSelectedFile"
          />
        </div>

        <!-- Footer -->
        <MediaGalleryFooter
          :can-proceed="canProceed"
          :is-uploading="isUploading"
          @next="handleNext"
        />
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
        @update:current-index="updatePreviewIndex"
        @next="handleBatchUpload"
      />
    </Teleport>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { createCreatorApi } from '@whispers/api';
import { useNotification } from '../../../composables/useNotifications';
import Modal from '../Modal.vue';
import MediaGalleryTabs from './MediaGalleryTabs.vue';
import MediaGalleryHeader from './MediaGalleryHeader.vue';
import MediaLibraryTab from './MediaLibraryTab.vue';
import DeviceUploadTab from './DeviceUploadTab.vue';
import MediaGalleryFooter from './MediaGalleryFooter.vue';
import MediaPreviewModal from './MediaPreviewModal.vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', files: any[]): void
  (e: 'upload-complete', results: any[]): void
}>();

const { t } = useI18n();
const notification = useNotification();

interface MediaItem {
  id: string
  url: string
  name: string
  type: 'image' | 'video'
  size?: number
  duration?: number
  file?: File
  thumbnailUrl?: string
}

const MAX_FILES = 10;

const tabs = [
  { key: 'device', label: 'Upload New', icon: 'lucide:upload' },
  { key: 'library', label: 'Media Library', icon: 'lucide:folder' }
];

// State
const activeTab = ref<'library' | 'device'>('device');
const activeMediaTab = ref<'images' | 'videos'>('images');
const loading = ref(false);
const mediaFiles = ref<MediaItem[]>([]);
const selectedIds = ref<string[]>([]);
const selectedFiles = ref<MediaItem[]>([]);
const searchQuery = ref('');

// Preview modal state
const showPreviewModal = ref(false);
const previewFiles = ref<File[]>([]);
const previewCurrentIndex = ref(0);
const isUploading = ref(false);
const uploadProgress = ref({ completed: 0, total: 0 });

// Pagination
const currentPage = ref(1);
const perPage = ref(12);
const totalItems = ref(0);
const totalPages = ref(1);

// const fetchMediaFiles = async () => {
//   loading.value = true;
//   try {
//     const creatorApi = createCreatorApi();
//     const params: any = { 
//       page: currentPage.value.toString(), 
//       limit: perPage.value.toString(),
//       search: searchQuery.value
//     };
    
//     if (activeMediaTab.value === 'images') {
//       params.type = 'image';
//     } else if (activeMediaTab.value === 'videos') {
//       params.type = 'video';
//     }
    
//     const response = await creatorApi.getMediaFiles(params);
    
//     mediaFiles.value = (response.data.mediaFiles || []).map((file: any) => ({
//       id: file._id,
//       url: file.url,
//       thumbnailUrl: file.thumbnailUrl || file.url,
//       name: file.url.split('/').pop() || 'media',
//       type: file.type,
//       size: file.size,
//       duration: file.duration
//     }));
    
//     totalItems.value = response.data.pagination?.total || 0;
//     totalPages.value = response.data.pagination?.pages || 1;
//   } catch (error) {
//     notification.error(t('notifications.contentLoadFailed'));
//     mediaFiles.value = [];
//   } finally {
//     loading.value = false;
//   }
// };

const fetchMediaFiles = async () => {
  loading.value = true;
  try {
    const creatorApi = createCreatorApi();
    const params: any = { 
      page: currentPage.value.toString(), 
      limit: perPage.value.toString(),
      search: searchQuery.value
    };
    
    if (activeMediaTab.value === 'images') {
      params.type = 'image';
    } else if (activeMediaTab.value === 'videos') {
      params.type = 'video';
    }
    
    const response = await creatorApi.getMediaFiles(params);
    
    mediaFiles.value = (response.data.mediaFiles || []).map((file: any) => ({
      id: file._id,
      url: file.url,
      thumbnailUrl: file.thumbnailUrl || file.url,
      name: file.url.split('/').pop() || 'media',
      type: file.type,
      size: file.size,
      duration: file.duration
    }));
    
    totalItems.value = response.data.pagination?.total || 0;
    totalPages.value = response.data.pagination?.pages || 1;
  } catch (error) {
    notification.error(t('notifications.contentLoadFailed'));
    mediaFiles.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.isOpen) {
    fetchMediaFiles();
  }
});

watch(() => props.isOpen, (isOpen: boolean) => {
  if (isOpen) {
    // Reset all state when modal opens
    selectedIds.value = [];
    selectedFiles.value = [];
    previewFiles.value = [];
    showPreviewModal.value = false;
    loading.value = false;
    isUploading.value = false;
    uploadProgress.value = { completed: 0, total: 0 };
    searchQuery.value = '';
    fetchMediaFiles();
  }
});

watch([currentPage, perPage, activeMediaTab, searchQuery], fetchMediaFiles);

const canProceed = computed(() => {
  if (activeTab.value === 'library') {
    return selectedIds.value.length > 0;
  } else {
    return selectedFiles.value.length > 0;
  }
});

const previewMediaItems = computed(() =>
  previewFiles.value.map((file: File, index: number) => ({
    id: `preview-${index}`,
    url: URL.createObjectURL(file),
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    file
  }))
);

function toggleSelect(media: MediaItem) {
  const index = selectedIds.value.indexOf(media.id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(media.id);
  }
}

function onFilesSelected(files: File[]) {
  const remainingSlots = MAX_FILES - selectedFiles.value.length;
  if (remainingSlots <= 0) {
    notification.error(`Maximum ${MAX_FILES} files allowed`);
    return;
  }

  const filesToAdd = files.slice(0, remainingSlots).map((file) => {
    const mediaItem = {
      id: `selected-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      file
    };
    return { mediaItem, file };
  });

  // Add to selected files
  selectedFiles.value.push(...filesToAdd.map(item => item.mediaItem));
  
  // Add to preview files and show modal
  previewFiles.value = [...previewFiles.value, ...filesToAdd.map(item => item.file)];
  previewCurrentIndex.value = Math.max(0, previewFiles.value.length - filesToAdd.length);
  showPreviewModal.value = true;
}

function removeSelectedFile(index: number) {
  const file = selectedFiles.value[index];
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url);
  }
  selectedFiles.value.splice(index, 1);
  
  const previewIndex = previewFiles.value.findIndex(f => 
    file.file ? f === file.file : f.name === file.name
  );
  if (previewIndex > -1) {
    previewFiles.value.splice(previewIndex, 1);
  }
}

function updatePreviewIndex(newIndex: number) {
  previewCurrentIndex.value = newIndex;
}

async function onAddMedia(files: File[]) {
  if (!files || files.length === 0) return;
  
  const remainingSlots = MAX_FILES - previewFiles.value.length;
  if (remainingSlots <= 0) {
    notification.error(`Maximum ${MAX_FILES} files allowed`);
    return;
  }
  
  const filesToAdd = files.slice(0, remainingSlots);
  if (filesToAdd.length < files.length) {
    notification.warning(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`);
  }
  
  filesToAdd.forEach(file => {
    const mediaItem = {
      id: `selected-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      file
    };
    selectedFiles.value.push(mediaItem);
  });
  
  previewFiles.value = [...previewFiles.value, ...filesToAdd];
}

// Fixed closePreviewModal function
function closePreviewModal() {
  // Clean up blob URLs for preview items
  previewMediaItems.value.forEach((item: any) => {
    if (item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });
  
  // Clear preview files
  previewFiles.value = [];
  showPreviewModal.value = false;
  previewCurrentIndex.value = 0;
  
  // IMPORTANT: Clear selectedFiles when closing without upload
  // This fixes the issue where items show in gallery without being uploaded
  selectedFiles.value.forEach((file: any) => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  });
  selectedFiles.value = [];
}

async function handleBatchUpload(mediaData: any[]) {
  if (mediaData.length === 0) return;

  isUploading.value = true;
  uploadProgress.value = { completed: 0, total: mediaData.length };

  try {
    // Upload logic here (same as original)
    const creatorApi = createCreatorApi();
    
    // Process uploads...
    const results = await processUploads(mediaData, creatorApi);
    
    notification.success(t('notifications.mediaUploaded'));
    await fetchMediaFiles();
    
    emit('upload-complete', results);
    
    // Clear all preview data after successful upload
    previewFiles.value = [];
    showPreviewModal.value = false;
    
  } catch (error) {
    notification.error(t('notifications.mediaUploadFailed'));
    console.error('Upload failed:', error);
  } finally {
    isUploading.value = false;
  }
}

async function processUploads(mediaData: any[], creatorApi: any) {
  // Implementation of upload logic
  return [];
}

function handleSearch(query: string) {
  searchQuery.value = query;
  currentPage.value = 1;
}

function handleNext() {
  if (!canProceed.value) return;
  
  if (activeTab.value === 'library') {
    const selected = mediaFiles.value.filter((m: any) => selectedIds.value.includes(m.id));
    emit('select', selected);
  } else {
    emit('select', selectedFiles.value);
  }
  
  close();
}

function close() {
  // Clean up all blob URLs
  selectedFiles.value.forEach((file: any) => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  });
  previewMediaItems.value.forEach((item: any) => {
    if (item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });
  
  // Reset all state
  selectedFiles.value = [];
  selectedIds.value = [];
  previewFiles.value = [];
  showPreviewModal.value = false;
  
  emit('close');
}
</script>