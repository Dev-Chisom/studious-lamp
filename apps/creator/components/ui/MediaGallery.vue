<template>
	<Modal v-if="isOpen" size="xl" @close="close">
		<div class="w-full max-w-2xl mx-auto p-0">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 pt-6 pb-2">
				<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ t('mediaLibrary.title') || 'Media' }}
				</h2>
			</div>

			<!-- Main Tabs -->
			<div class="flex border-b border-gray-200 dark:border-gray-700">
				<button
					v-for="tab in tabs"
					:key="tab.key"
					type="button"
					:class="[
						'flex-1 py-3 text-center font-medium transition',
						activeTab === tab.key
							? 'border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800'
							: 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
					]"
					@click="activeTab = tab.key"
				>
					{{ t(tab.label) || (tab.key === 'library' ? 'Media Library' : 'From Device') }}
				</button>
			</div>

			<!-- Media Library Sub-tabs -->
			<div v-if="activeTab === 'library'" class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
				<button
					v-for="subTab in mediaSubTabs"
					:key="subTab.key"
					type="button"
					:class="[
						'flex-1 py-2 text-center text-sm font-medium transition',
						activeMediaTab === subTab.key
							? 'border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-700'
							: 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
					]"
					@click="activeMediaTab = subTab.key"
				>
					{{ t(subTab.label) || (subTab.key === 'all' ? 'All' : subTab.key === 'images' ? 'Images' : 'Videos') }}
				</button>
			</div>
      
			<!-- Tab Content -->
			<div class="p-6">
				<!-- Media Library Tab -->
				<div v-if="activeTab === 'library'">
					<div v-if="loading" class="flex justify-center items-center py-8">
						<Icon name="lucide:loader-2" class="animate-spin h-6 w-6 text-primary-600 dark:text-primary-400" />
					</div>
					<div v-else-if="filteredMedia.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
						{{ activeMediaTab === 'images' 
							? (t('mediaLibrary.noImages') || 'No images found') 
							: activeMediaTab === 'videos' 
								? (t('mediaLibrary.noVideos') || 'No videos found')
								: (t('mediaLibrary.noMedia') || 'No media found') }}
					</div>
					<div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div
							v-for="media in filteredMedia"
							:key="media.id"
							:class="[
								'relative rounded-lg border transition cursor-pointer overflow-hidden',
								selectedIds.includes(media.id)
									? 'border-primary-600 dark:border-primary-400 ring-2 ring-primary-500 dark:ring-primary-400'
									: 'border-gray-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-400'
							]"
							@click="toggleSelect(media)"
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
						</div>
					</div>
					<Pagination
						v-if="totalPages > 1"
						:current-page="currentPage"
						:per-page="perPage"
						:total-items="totalItems"
						@update:current-page="(val: number) => { currentPage.value = val }"
						@update:per-page="(val: number) => { perPage.value = val }"
					/>
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
								class="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
								@click="removeSelectedFile(index)"
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
				@update:current-index="updatePreviewIndex"
				@next="handleBatchUpload"
			/>
		</Teleport>
	</Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Modal from './Modal.vue';
import MediaPreviewModal from './MediaPreviewModal.vue';
import { createCreatorApi } from '@whispers/api';
import { useNotification } from '../../composables/useNotifications';
import Pagination from './Pagination.vue';

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', files: any[]): void
  (e: 'upload-complete', results: any[]): void
}>();

const { t } = useI18n();

interface MediaItem {
  id: string
  url: string
  name: string
  type: 'image' | 'video'
  size?: number
  duration?: number
  file?: File
}

const MAX_FILES = 10;

const tabs = [
  { key: 'library', label: 'mediaLibrary.tabLibrary' },
  { key: 'device', label: 'mediaLibrary.tabDevice' }
];

const mediaSubTabs = [
  { key: 'images', label: 'mediaLibrary.tabImages' },
  { key: 'videos', label: 'mediaLibrary.tabVideos' }
];

const activeTab = ref<'library' | 'device'>('device');
const activeMediaTab = ref<'all' | 'images' | 'videos'>('all');

const loading = ref(false);
const mediaFiles = ref<MediaItem[]>([]);
const selectedIds = ref<string[]>([]);
const selectedFiles = ref<MediaItem[]>([]);
const deviceFileInput = ref<HTMLInputElement | null>(null);

// Preview modal state
const showPreviewModal = ref(false);
const previewFiles = ref<File[]>([]);
const previewCurrentIndex = ref(0);
const isUploading = ref(false);
const uploadProgress = ref({ completed: 0, total: 0 });

const notification = useNotification();

// Pagination state
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);

const fetchMediaFiles = async () => {
  loading.value = true;
  try {
    const creatorApi = createCreatorApi();
    const params: any = { 
      page: currentPage.value.toString(), 
      limit: perPage.value.toString() 
    };
    
    // Add type filter if on specific sub-tab
    if (activeMediaTab.value === 'images') {
      params.type = 'image';
    } else if (activeMediaTab.value === 'videos') {
      params.type = 'video';
    }
    
    const response = await creatorApi.getMediaFiles(params);
    
    mediaFiles.value = (response.mediaFiles || []).map((file: any) => ({
      id: file._id,
      url: file.url,
      name: file.url.split('/').pop() || 'media',
      type: file.type,
      size: file.size,
      duration: file.duration
    }));
    
    totalItems.value = response.pagination?.total || 0;
    totalPages.value = response.pagination?.pages || 1;
  } catch (error) {
    notification.error(t('notifications.contentLoadFailed'));
    mediaFiles.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMediaFiles);

watch([currentPage, perPage, activeMediaTab], fetchMediaFiles);

watch(() => props.isOpen, (isOpen: boolean) => {
  if (isOpen) {
    selectedIds.value = [];
    selectedFiles.value = [];
    previewFiles.value = [];
    loading.value = false;
    isUploading.value = false;
    uploadProgress.value = { completed: 0, total: 0 };
  }
});

const filteredMedia = computed(() => {
  if (activeMediaTab.value === 'images') {
    return mediaFiles.value.filter(file => file.type === 'image');
  } else if (activeMediaTab.value === 'videos') {
    return mediaFiles.value.filter(file => file.type === 'video');
  }
  return mediaFiles.value;
});

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

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);
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
    selectedFiles.value.push(mediaItem);
    return file;
  });

  previewFiles.value = [...previewFiles.value, ...filesToAdd];
  previewCurrentIndex.value = Math.max(0, previewFiles.value.length - filesToAdd.length);
  showPreviewModal.value = true;

  if (deviceFileInput.value) {
    deviceFileInput.value.value = '';
  }
}

function removeSelectedFile(index: number) {
  const file = selectedFiles.value[index];
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url);
  }
  selectedFiles.value.splice(index, 1);
  
  // Also remove from previewFiles if it exists there
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
  
  // Add to both preview and selected files
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

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// Update the handleBatchUpload function
async function handleBatchUpload(mediaData: any[]) {
  if (mediaData.length === 0) return;

  isUploading.value = true;
  uploadProgress.value = { completed: 0, total: mediaData.length };

  try {
    // 1. Upload covers for videos first, if needed
    const coverUploads: Record<number, string> = {};
    await Promise.all(mediaData.map(async (media, i) => {
      const file = media.file || media.originalData?.file;
      const fileType = file?.type?.startsWith('video') || media.type === 'video' ? 'video' : 'image';
      if (fileType === 'video' && media.cover) {
        let coverFile: File | null = null;
        if (media.cover instanceof File) {
          coverFile = media.cover;
        } else if (typeof media.cover === 'string' && media.cover.startsWith('data:')) {
          const uuid = crypto.randomUUID();
          const coverFileName = `${uuid}.jpg`;
          coverFile = dataURLtoFile(media.cover, coverFileName);
        }
        if (coverFile) {
          // Get a pre-signed URL for the cover upload
          const creatorApi = createCreatorApi();
          const coverPayload = {
            files: [{
              uuid: crypto.randomUUID(),
              fileName: coverFile.name,
              fileType: 'image',
              size: coverFile.size
            }]
          };
          const coverResp = await creatorApi.uploadMediaFile(coverPayload);
          const coverUploadUrl = Array.isArray(coverResp)
            ? coverResp[0]?.uploadUrl
            : coverResp.uploadUrl;
          const coverFileName = Array.isArray(coverResp)
            ? coverResp[0]?.fileName
            : coverResp.fileName;
          if (coverUploadUrl && coverFileName) {
            // Actually upload the cover file to S3
            console.log('Uploading cover to:', coverUploadUrl);
            await fetch(coverUploadUrl, {
              method: 'PUT',
              body: coverFile,
              headers: { 'Content-Type': coverFile.type },
            });
            coverUploads[i] = coverFileName;
          }
        }
      }
    }));

    // 2. Prepare the main payload for videos/images
    const payload = {
      files: mediaData.map((media, i) => {
        const file = media.file || media.originalData?.file;
        const fileType = file?.type?.startsWith('video') || media.type === 'video' ? 'video' : 'image';
        const filePayload: any = {
          uuid: crypto.randomUUID(),
          fileName: file?.name || media.name,
          fileType,
          size: file?.size || 0
        };
        if (fileType === 'video' && coverUploads[i]) {
          filePayload.coverName = coverUploads[i];
        }
        return filePayload;
      })
    };

    // 3. Get pre-signed URLs for main files
    const creatorApi = createCreatorApi();
    const response = await creatorApi.uploadMediaFile(payload);
    console.log('Upload media file response:', response);
    
    // Handle different response formats
    const uploadResponses = Array.isArray(response)
      ? response
      : Array.isArray(response.data)
        ? response.data
        : [response];

    // 4. Upload each file to S3 using the returned uploadUrl
    const uploadedFiles = await Promise.all(
      uploadResponses.map(async (res: any, i: number) => {
        if (!res.uploadUrl) {
          console.error('Missing uploadUrl for file', i, res);
          return null;
        }
        
        const fileToUpload = mediaData[i].file || mediaData[i].originalData?.file;
        if (!fileToUpload) {
          console.error('No file to upload for item', i);
          return null;
        }
        
        console.log(`Uploading file ${i} to S3:`, res.uploadUrl);
        try {
          // This is the critical S3 PUT request that was missing
          const uploadResult = await fetch(res.uploadUrl, {
            method: 'PUT',
            body: fileToUpload,
            headers: { 'Content-Type': fileToUpload.type },
          });
          
          if (!uploadResult.ok) {
            throw new Error(`Upload failed with status: ${uploadResult.status}`);
          }
          
          uploadProgress.value.completed++;
          
          return {
            id: res.mediaFileId || res._id,
            url: res.fileUrl,
            name: fileToUpload.name,
            type: fileToUpload.type.startsWith('image/') ? 'image' : 'video',
            size: fileToUpload.size
          };
        } catch (error) {
          console.error(`Error uploading file ${i}:`, error);
          return null;
        }
      })
    );

    // Filter out failed uploads
    const successfulUploads = uploadedFiles.filter(Boolean);
    
    notification.success(t('notifications.contentCreated'));
    await fetchMediaFiles(); // Refresh the media library
    
    // Don't clear selectedFiles, add the new uploads to it
    selectedFiles.value = [
      ...selectedFiles.value,
      ...successfulUploads
    ];
    
    emit('upload-complete', successfulUploads);
    
    // Only clear preview files, not selected files
    previewFiles.value = [];
    showPreviewModal.value = false;
  } catch (error) {
    notification.error(t('notifications.mediaUploadFailed'));
    console.error('Upload failed:', error);
  } finally {
    isUploading.value = false;
  }
}

// Update the closePreviewModal function
function closePreviewModal() {
  // Clear only preview data, not selected files
  previewMediaItems.value.forEach((item: any) => {
    if (item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });
  
  previewFiles.value = [];
  showPreviewModal.value = false;
  previewCurrentIndex.value = 0;
  
  // Don't clear selectedFiles here - let user keep their selection
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
    URL.revokeObjectURL(item.url);
  });
  selectedFiles.value = [];
  emit('close');
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

onUnmounted(() => {
  // Final cleanup
  selectedFiles.value.forEach((file: any) => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  });
  
  previewMediaItems.value.forEach((item: any) => {
    URL.revokeObjectURL(item.url);
  });
});
</script>
