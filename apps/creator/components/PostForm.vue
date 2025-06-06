<template>
	<Form v-slot="{ errors, meta, values, setFieldValue }" :validation-schema="schema" :initial-values="initialFormValues" @submit="onSubmit">
		<div class="p-6 space-y-6">
			<!-- Title -->
			<div>
				<Field v-slot="{ field, errorMessage }" name="title">
					<form-input
						:model-value="field.value" 
						@update:model-value="field.onChange"
						:label="t('postTitle')" 
						:placeholder="t('enterPostTitle')"
						:error="errorMessage" 
						:required="true" />
				</Field>
			</div>

			<!-- Content Field -->
			<div>
				<Field v-slot="{ field, errorMessage }" name="content">
					<label class="form-label">
						{{ t('postContent') }} <span class="text-error-500 ml-1">*</span>
					</label>
					<textarea
						:value="field.value"
						@input="field.onChange"
						@blur="field.onBlur"
						rows="5" 
						:placeholder="t('writePostContent')"
						class="form-input"
						:class="errorMessage ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''" 
						required />
					<p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
				</Field>
			</div>

			<!-- Media upload -->
			<div>
				<Field v-slot="{ field, errorMessage }" name="mediaFiles">
					<div class="mt-2">
						<!-- Show uploaded media in clean grid layout -->
						<div v-if="uploadedMediaFiles.length > 0">
							<div class="flex items-center justify-between mb-4">
								<h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
									{{ t('mediaFiles') || 'Media Files' }}
								</h3>
								<button
									type="button"
									class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
									@click="showMediaGallery = true"
								>
									{{ t('addMore') || 'Add More' }}
								</button>
							</div>
              
							<!-- Clean Grid for uploaded media -->
							<div class="media-grid mb-4">
								<div
									v-for="(media, index) in uploadedMediaFiles"
									:key="media.id"
									class="media-item group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  @click="openMediaPreview(index)"
								>
									<!-- Image Display -->
									<img
										v-if="media.type === 'image'"
										:src="media.url"
										:alt="media.name"
										class="w-full h-full object-cover"
									/>
                  
									<!-- Video Display with Cover -->
									<div v-else-if="media.type === 'video'" class="relative w-full h-full">
										<img
											v-if="media.cover"
											:src="media.cover"
											:alt="media.name"
											class="w-full h-full object-cover"
										/>
										<video
											v-else
											:src="media.url"
											class="w-full h-full object-cover"
											muted
											preload="metadata"
										/>
                    
										<!-- Video Play Overlay -->
										<div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											<div class="bg-white/90 dark:bg-gray-900/90 rounded-full p-3 shadow-lg">
												<Icon name="lucide:play" class="w-5 h-5 text-gray-900 dark:text-white" />
											</div>
										</div>
                    
										<!-- Video Duration Badge -->
										<div v-if="media.duration" class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
											{{ formatDuration(media.duration) }}
										</div>
									</div>
                  
									<!-- Remove Button -->
                  <button
                    type="button"
                    class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg flex items-center justify-center p-0"
                    @click.stop="removeMediaFile(index, setFieldValue)"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
									<!-- Set Cover Button for Videos -->
									<button
										v-if="media.type === 'video'"
										type="button"
										class="absolute bottom-2 left-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white text-xs px-2 py-1 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
										@click.stop="setCoverForVideo(media, index)"
									>
										{{ media.cover ? t('changeCover') || 'Change Cover' : t('setCover') || 'Set Cover' }}
									</button>
								</div>
							</div>
              
							<!-- File count and add more -->
							<div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
								<span>{{ uploadedMediaFiles.length }} {{ uploadedMediaFiles.length === 1 ? 'file' : 'files' }} uploaded</span>
								<span v-if="uploadedMediaFiles.length >= 10" class="text-amber-600 dark:text-amber-400 font-medium">Maximum files reached</span>
							</div>
						</div>
            
						<!-- Upload area when no media -->
						<div 
							v-else
							class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
							@click="showMediaGallery = true"
						>
							<!-- Upload icon -->
							<Icon name="lucide:upload" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              
							<div class="mt-4 flex text-sm text-gray-600 dark:text-gray-300">
								<span class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
									{{ t('content.uploadFiles') }}
								</span>
								<!-- <p class="pl-1">or drag and drop</p> -->
							</div>
              
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
								Images and videos up to 10 MB, max 10 files
							</p>
						</div>
            
						<!-- Media Gallery Modal -->
						<MediaGallery 
							:is-open="showMediaGallery" 
							@close="showMediaGallery = false" 
							@select="(media) => addMediaFromGallery(media, setFieldValue)"
							@upload-complete="(results) => handleUploadComplete(results, setFieldValue)"
						/>
            
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-200">
							{{ t('uploadMediaHint') }}
						</p>
						<p v-if="errorMessage" class="form-error mt-2">{{ errorMessage }}</p>
					</div>
				</Field>
			</div>

			<!-- Post settings -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
				<!-- Visibility -->
				<div>
					<Field v-slot="{ field, errorMessage }" name="visibility">
						<label class="form-label"> {{ t('visibility') || 'Visibility' }} </label>
						<div class="mt-2 space-y-3">
							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input
										id="visibility-public" 
										:checked="field.value === 'public'"
										@change="field.onChange"
										type="radio"
										value="public" 
										class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
								</div>
								<div class="ml-3 text-sm">
									<label for="visibility-public" class="font-medium text-gray-700 dark:text-gray-200">
										{{ t('public') || 'Public' }}
									</label>
									<p class="text-gray-500 dark:text-gray-400">{{ t('publicHint') || 'Visible to everyone, including non-subscribers' }}</p>
								</div>
							</div>

							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input
										id="visibility-subscribers" 
										:checked="field.value === 'subscribers'"
										@change="field.onChange"
										type="radio"
										value="subscribers" 
										class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
								</div>
								<div class="ml-3 text-sm">
									<label for="visibility-subscribers" class="font-medium text-gray-700 dark:text-gray-200">
										{{ t('subscribersOnly') || 'Subscribers Only' }}
									</label>
									<p class="text-gray-500 dark:text-gray-400">{{ t('subscribersOnlyHint') || 'Only visible to your paid subscribers' }}</p>
								</div>
							</div>

							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input
										id="visibility-pay-to-view" 
										:checked="field.value === 'pay-to-view'"
										@change="field.onChange"
										type="radio"
										value="pay-to-view" 
										class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
								</div>
								<div class="ml-3 text-sm">
									<label for="visibility-pay-to-view" class="font-medium text-gray-700 dark:text-gray-200">
										{{ t('payPerView') || 'Pay-to-view' }}
									</label>
									<p class="text-gray-500 dark:text-gray-400">{{ t('payPerViewHint') || 'Users must pay a one-time fee to access' }}</p>
								</div>
							</div>
						</div>
						<p v-if="errorMessage" class="form-error mt-2">{{ errorMessage }}</p>
					</Field>
				</div>

				<!-- Price field (conditional) -->
				<div v-if="values?.visibility === 'pay-to-view'">
					<Field v-slot="{ field, errorMessage }" name="price">
						<form-input
							:model-value="field.value" 
							@update:model-value="field.onChange"
							:label="t('price') || 'Price'" 
							type="number" 
							min="0.01" 
							step="0.01"
							:placeholder="t('pricePlaceholder') || 'Enter price'" 
							:error="errorMessage" 
							required />
					</Field>
				</div>

				<!-- Schedule settings -->
				<div class="md:col-span-2">
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								id="schedule" 
								v-model="isScheduled" 
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
						</div>
						<div class="ml-3 text-sm">
							<label for="schedule" class="font-medium text-gray-700 dark:text-gray-200">
								{{ t('scheduleForLater') || 'Schedule for later' }}
							</label>
							<p class="text-gray-500 dark:text-gray-400">{{ t('scheduleHint') || 'Set a future date and time to publish this post' }}</p>
						</div>
					</div>

					<div v-if="isScheduled" class="mt-4">
						<Field v-slot="{ field, errorMessage }" name="scheduledDate">
							<form-input
								:model-value="field.value" 
								@update:model-value="field.onChange"
								:label="t('publishDate') || 'Publish Date'" 
								type="datetime-local"
								:min="minScheduleDate" 
								:error="errorMessage" 
								required />
						</Field>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-gray-50 dark:bg-gray-800 py-3 flex justify-end gap-3 px-1 md:px-6 sm:w-full">
			<!-- Draft button for creation mode -->
      <button
        v-if="!isEditMode"
        type="button"
        class="w-full sm:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="saveDraft"
      >
        {{ t('content.saveDraft') }}
      </button>

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full sm:w-auto px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
        :disabled="!meta.valid || loading"
        :class="{
          'bg-primary-600 text-white hover:bg-primary-700': meta.valid && !loading,
          'bg-primary-500 text-white cursor-wait': loading,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !meta.valid || loading,
        }"
      >
        <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5" />
        {{ getSubmitButtonText() }}
      </button>
		</div>

    <!-- Media Preview Modal -->
    <MediaPreviewModal
      :is-open="previewModal.isOpen"
      :media-items="previewModal.items"
      :current-index="previewModal.currentIndex"
      :enable-video-edit="true"
      @close="closePreview"
      @update:current-index="previewModal.currentIndex = $event"
      @update:cover="handleCoverUpdate"
    />
	</Form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '../components/ui/BaseInput.vue';
import MediaGallery from './ui/Media/MediaGallery.vue';
import MediaPreviewModal from './ui/Media/MediaPreviewModal.vue';

type Visibility = 'public' | 'subscribers' | 'pay-to-view'

interface MediaFile {
  id?: string
  url: string
  type: string
  name: string
  size?: number
  cover?: string
  duration?: number
}

interface FormData {
  title: string
  content: string
  visibility: Visibility
  price: number
  scheduledDate?: string
  mediaUrls?: MediaFile[]
}

interface PostFormProps {
  initialValues?: Partial<FormData>
  loading?: boolean
  minScheduleDate?: string
  isEditMode?: boolean
}

interface PostFormEmits {
  (
    e: 'submit',
    data: FormData & {
      mediaFiles: File[]
      isScheduled: boolean
      scheduledDate: string
      existingMediaFiles: MediaFile[]
    },
  ): void
  (e: 'draft'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<PostFormProps>(), {
  initialValues: () => ({}),
  loading: false,
  minScheduleDate: '',
  isEditMode: false,
});

const emit = defineEmits<PostFormEmits>();

const { t } = useI18n();

const mediaFiles = ref<File[]>([]);
const existingMediaFiles = ref<MediaFile[]>([]);
const uploadedMediaFiles = ref<MediaFile[]>([]);
const isScheduled = ref(false);
const showMediaGallery = ref(false);

// Media preview modal state
const previewModal = ref({
  isOpen: false,
  items: [] as MediaFile[],
  currentIndex: 0
});

// Initial form values for VeeValidate
const initialFormValues = computed(() => ({
  title: props.initialValues?.title || '',
  content: props.initialValues?.content || '',
  visibility: props.initialValues?.visibility || 'public',
  price: props.initialValues?.price || 4.99,
  scheduledDate: props.initialValues?.scheduledDate || '',
  mediaFiles: uploadedMediaFiles.value
}));

// Watch for initialValues changes
watch(() => props.initialValues, (newVal) => {
  if (newVal) {
    existingMediaFiles.value = newVal.mediaUrls || [];
    if (newVal.mediaUrls && newVal.mediaUrls.length > 0) {
      uploadedMediaFiles.value = [...newVal.mediaUrls];
    }
    isScheduled.value = !!newVal.scheduledDate;
  }
}, { deep: true, immediate: true });

// Enhanced validation schema
const schema = computed(() => yup.object({
  title: yup.string()
    .required(t('validation.title.required'))
    .min(3, t('validation.title.minLength'))
    .max(200, t('validation.title.maxLength')),
  
  content: yup.string()
    .required(t('validation.content.required'))
    .min(10, t('validation.content.minLength'))
    .max(5000, t('validation.content.maxLength')),
  
  visibility: yup.string()
    .required(t('validation.required', { field: t('visibility') }))
    .oneOf(['public', 'subscribers', 'pay-to-view'], t('validation.invalidVisibility')),
  
  price: yup.number().when('visibility', {
    is: 'pay-to-view',
    then: (schema) => schema
      .required(t('validation.price.required'))
      .min(0.01, t('validation.price.minValue'))
      .max(999.99, t('validation.price.maxValue')),
    otherwise: (schema) => schema.notRequired()
  }),
  
  scheduledDate: yup.string().when([], {
    is: () => isScheduled.value,
    then: (schema) => schema
      .required(t('validation.scheduledDate.required'))
      .test('is-future', t('validation.scheduledDate.futureDate'), value => {
        if (!value) return false;
        return new Date(value) > new Date();
      }),
    otherwise: (schema) => schema.notRequired()
  }),
  
  mediaFiles: yup.array()
    .test(
      'max-media-files',
      t('validation.maxMediaFiles'),
      (value) => {
        // If no files, it's allowed (since media is optional)
        if (!value || value.length === 0) return true;
        
        // Check if total files (existing + new) exceed 10
        const totalFiles = (existingMediaFiles.value?.length || 0) + (uploadedMediaFiles.value?.length || 0);
        return totalFiles <= 10;
      }
    ),
}));

// Get submit button text based on mode and state
function getSubmitButtonText(): string {
  if (props.isEditMode) {
    return isScheduled.value ? (t('updateSchedule') || 'Update Schedule') : (t('updatePost') || 'Update Post');
  } else {
    return isScheduled.value ? (t('schedulePost') || 'Schedule Post') : (t('publishNow') || 'Publish Now');
  }
}

// Reset form function
const resetForm = () => {
  mediaFiles.value = [];
  existingMediaFiles.value = [];
  uploadedMediaFiles.value = [];
  isScheduled.value = false;
};

function onSubmit(values: any) {
  const mediaFileIds = uploadedMediaFiles.value.map(m => m.id).filter(Boolean);
  const submitData = {
    title: values.title,
    body: values.content,
    visibility: values.visibility,
    ...(values.visibility === 'pay-to-view' && { price: values.price }),
    mediaFiles: mediaFileIds,
    isScheduled: isScheduled.value,
    ...(isScheduled.value && { scheduledDate: values.scheduledDate })
  };
  emit('submit', submitData);
}

function saveDraft() {
  const mediaFileIds = uploadedMediaFiles.value.map(m => m.id).filter(Boolean);
  emit('draft', { mediaFiles: mediaFileIds });
}

function addMediaFromGallery(selectedMedia: any[], setFieldValue: Function) {
  uploadedMediaFiles.value = [...uploadedMediaFiles.value, ...selectedMedia];
  setFieldValue('mediaFiles', uploadedMediaFiles.value);
}

function handleUploadComplete(results: any[], setFieldValue: Function) {
  const successfulUploads = results.filter(result => result.success);
  const newMedia = successfulUploads.map(result => result.data);
  uploadedMediaFiles.value = [...uploadedMediaFiles.value, ...newMedia];
  setFieldValue('mediaFiles', uploadedMediaFiles.value);
}

function removeMediaFile(index: number, setFieldValue: Function) {
  uploadedMediaFiles.value.splice(index, 1);
  setFieldValue('mediaFiles', uploadedMediaFiles.value);
}

function setCoverForVideo(media: MediaFile, index: number) {
  // Open the preview modal directly to the video
  openMediaPreview(index);
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Media preview modal functions
function openMediaPreview(index: number) {
  previewModal.value = {
    isOpen: true,
    items: [...uploadedMediaFiles.value],
    currentIndex: index
  };
}

function closePreview() {
  previewModal.value.isOpen = false;
}

function handleCoverUpdate(data: { index: number, cover: string | null }) {
  // Update the cover for the media item
  if (data.index >= 0 && data.index < uploadedMediaFiles.value.length) {
    uploadedMediaFiles.value[data.index].cover = data.cover || undefined;
  }
}

defineExpose({
  resetForm
});
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}

@media (min-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

.media-item {
  aspect-ratio: 1;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>