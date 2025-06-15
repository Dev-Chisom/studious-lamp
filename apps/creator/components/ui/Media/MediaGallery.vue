<template>
  <Modal v-if="isOpen" size="xl" @close="close">
    <template #header>
      <MediaGalleryHeader :title="t('mediaLibrary.title') || 'Media Library'" />
    </template>
    <div class="overflow-hidden">
      <!-- Main Content -->
      <div class="flex flex-col h-[600px]">
        <!-- Tab Navigation -->
        <MediaGalleryTabs :active-tab="activeTab" :tabs="tabs" @update:active-tab="activeTab = $event" />

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden">
          <!-- Media Library Tab -->
          <MediaLibraryTab v-if="activeTab === 'library'" :loading="loading" :media-files="mediaFiles"
            :selected-ids="selectedIds" :current-page="currentPage" :per-page="perPage" :total-pages="totalPages"
            :total-items="totalItems" :active-media-tab="activeMediaTab"
            @update:active-media-tab="activeMediaTab = $event" @update:current-page="currentPage = $event"
            @update:per-page="perPage = $event" @toggle-select="toggleSelect" @search="handleSearch" />

          <!-- Device Upload Tab -->
          <DeviceUploadTab v-else :selected-files="selectedFiles" :max-files="MAX_FILES"
            @files-selected="onFilesSelected" @remove-file="removeSelectedFile" />
        </div>

        <!-- Footer -->
        <MediaGalleryFooter :can-proceed="canProceed" :is-uploading="isUploading" @next="handleNext" />
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <MediaPreviewModal v-if="showPreviewModal" :is-open="showPreviewModal" :media-items="previewMediaItems"
        :current-index="previewCurrentIndex" :enable-video-edit="true" :show-edit="true" :show-next-button="true"
        :max-files="MAX_FILES" :is-uploading="isUploading" :upload-progress="uploadProgress" @close="closePreviewModal"
        @add-media="onAddMedia" @update:current-index="updatePreviewIndex" @next="handleBatchUpload" />
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
  tempId?: string // Added for temporary ID tracking
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

async function processUploads(mediaData: any[], creatorApi: any) {
  const filesPayload = mediaData.map(file => {
    const payload: any = {
      uuid: file.uuid || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)),
      fileName: file.name,
      fileType: file.type === 'video' ? 'video' : 'image',
      size: file.size
    };
    // For videos, include coverName if coverFile is present
    if (file.type === 'video' && file.coverFile) {
      payload.coverName = file.coverFile.name;
    }
    return payload;
  });
  const response = await creatorApi.uploadMediaFile({ files: filesPayload });
  const uploadResults = [];
  for (let i = 0; i < response.data.length; i++) {
    const { uploadUrl, fileKey, mediaFileId, coverUploadUrl } = response.data[i];
    const fileObj = mediaData[i].file;
    await fetch(uploadUrl, {
      method: 'PUT',
      body: fileObj,
      headers: {
        'Content-Type': fileObj.type
      }
    });
    // For videos, upload the cover image if present
    if (coverUploadUrl && mediaData[i].coverFile) {
      await fetch(coverUploadUrl, {
        method: 'PUT',
        body: mediaData[i].coverFile,
        headers: {
          'Content-Type': mediaData[i].coverFile.type
        }
      });
    }
    uploadResults.push({
      ...response.data[i],
      fileKey,
      mediaFileId
    });
  }
  return uploadResults;
}

onMounted(() => {
  if (props.isOpen) {
    fetchMediaFiles();
  }
});

watch(() => props.isOpen, (isOpen: boolean) => {
  if (isOpen) {
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
    id: (file as any)?._id || (file as any)?.tempId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)),
    url: URL.createObjectURL(file),
    name: file.name || file?.fileName,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    file,
    tempId: (file as any)?.tempId // Include tempId if it exists
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
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Add tempId to the file object for better tracking
    (file as any).tempId = tempId;
    
    const mediaItem = {
      id: file?._id || file?.mediaFileId || tempId,
      url: URL.createObjectURL(file),
      name: file.name || file?.fileName,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      file,
      tempId
    };
    return mediaItem;
  });

  selectedFiles.value.push(...filesToAdd);
  previewFiles.value.push(...filesToAdd.map(item => item.file));
  
  previewCurrentIndex.value = Math.max(0, previewFiles.value.length - filesToAdd.length);
  showPreviewModal.value = true;
}

function removeSelectedFile(index: number) {
  const file = selectedFiles.value[index];
  if (!file) return;
  
  // Clean up blob URL
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url);
  }
  
  // Remove from selectedFiles
  selectedFiles.value.splice(index, 1);
  
  // Find and remove from previewFiles using tempId or file reference
  const previewIndex = previewFiles.value.findIndex(f => {
    // Use tempId for better matching if available
    if (file.tempId && (f as any).tempId) {
      return (f as any).tempId === file.tempId;
    }
    // Fallback to file reference or name comparison
    return f === file.file || f.name === file.name;
  });
  
  if (previewIndex > -1) {
    previewFiles.value.splice(previewIndex, 1);
  }
  
  // Adjust preview index if necessary
  if (previewCurrentIndex.value >= previewFiles.value.length && previewFiles.value.length > 0) {
    previewCurrentIndex.value = previewFiles.value.length - 1;
  } else if (previewFiles.value.length === 0) {
    previewCurrentIndex.value = 0;
  }
}

function updatePreviewIndex(newIndex: number) {
  previewCurrentIndex.value = newIndex;
}

function onAddMedia(files: File[]) {
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
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const mediaItem = {
      id: tempId,
      url: URL.createObjectURL(file),
      name: file.name || file?.fileName,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      file,
      tempId
    };
    selectedFiles.value.push(mediaItem);
  });

  previewFiles.value = [...previewFiles.value, ...filesToAdd];
}

function closePreviewModal() {
  previewMediaItems.value.forEach((item: any) => {
    if (item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });

  previewFiles.value = [];
  showPreviewModal.value = false;
  previewCurrentIndex.value = 0;

  selectedFiles.value.forEach((file: any) => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  });
  selectedFiles.value = [];
}

async function handleBatchUpload(mediaData: any[]) {
  if (mediaData.length === 0) return;

  // Helper to convert base64 to File
  function base64ToFile(base64: string, filename: string, mimeType?: string) {
    const arr = base64.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = mimeType || (match ? match[1] : '');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Convert base64 cover to File for videos
  mediaData.forEach(item => {
    if (item.type === 'video' && item.cover && !item.coverFile) {
      // Use the video file name as a prefix for the cover file name
      const baseName = item.name ? item.name.replace(/\.[^/.]+$/, "") : `cover-${Date.now()}`;
      const coverFileName = `${baseName}-cover.jpg`;
      item.coverFile = base64ToFile(item.cover, coverFileName, 'image/jpeg');
    }
  });

  isUploading.value = true;
  uploadProgress.value = { completed: 0, total: mediaData.length };

  try {
    const creatorApi = createCreatorApi();
    const results = await processUploads(mediaData, creatorApi);

   const emittedResults = results.map((r, index) => {
  // Find the original file object in mediaData
  const original = mediaData[index];
  return {
    id: r.mediaFileId,
    name: original?.name,
    type: original?.type,
    url: r.fileUrl || r.url,
    thumbnailUrl: original?.type === 'image' ? (r.fileUrl || r.url) : undefined,
    coverUrl: original?.type === 'video' ? r.coverUrl : undefined,
  };
});
emit('upload-complete', emittedResults);
    emit('upload-complete', emittedResults);
    previewFiles.value = [];
    showPreviewModal.value = false;

  } catch (error) {
    notification.error(t('notifications.mediaUploadFailed'));
  } finally {
    isUploading.value = false;
  }
}

function handleSearch(query: string) {
  searchQuery.value = query;
  currentPage.value = 1;
}

function handleNext() {
  if (!canProceed.value) return;

  if (activeTab.value === 'library') {
    const selected = mediaFiles.value.filter((m: any) => selectedIds.value.includes(m.id));
    console.log('Emitting library selection:', selected); // Debug log
    emit('select', selected);
  } else {
    console.log('Emitting device files:', selectedFiles.value); // Debug log
    
    // Make sure we're not emitting empty arrays
    if (selectedFiles.value.length === 0) {
      console.warn('Attempting to emit empty selectedFiles array');
      return;
    }
    
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