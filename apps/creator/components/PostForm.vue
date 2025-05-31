<template>
  <Form @submit="onSubmit" :validation-schema="schema" :initial-values="formValues" v-slot="{ errors, meta, resetForm }">
    <div class="p-6 space-y-6">
      <!-- Title -->
      <div>
        <Field v-slot="{ field, errorMessage }" name="title">
          <form-input v-model="formValues.title" v-bind="field" :label="t('postTitle')" :placeholder="t('enterPostTitle')"
            :error="errorMessage" :required="true" />
        </Field>
      </div>

      <!-- Content Field -->
      <div>
        <Field v-slot="{ field, errorMessage }" name="content">
          <label class="form-label">
            {{ t('postContent') }} <span class="text-error-500 ml-1">*</span>
          </label>
          <textarea v-model="formValues.content" v-bind="field" rows="5" :placeholder="t('writePostContent')"
            class="form-input"
            :class="errorMessage ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''" required />
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
                  @click="showMediaGallery = true"
                  class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  {{ t('addMore') || 'addMore' }}
                </button>
              </div>
              
              <!-- Clean Grid for uploaded media -->
              <div class="media-grid mb-4">
                <div
                  v-for="(media, index) in uploadedMediaFiles"
                  :key="media.id"
                  class="media-item group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
                    @click="removeMediaFile(index)"
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                  
                  <!-- Set Cover Button for Videos -->
                  <button
                    v-if="media.type === 'video'"
                    type="button"
                    @click="setCoverForVideo(media, index)"
                    class="absolute bottom-2 left-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white text-xs px-2 py-1 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  >
                    {{ media.cover ? t('changeCover') || 'changeCover' : t('setCover') || 'Set Cover' }}
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
                  {{ t('mediaLibrary.uploadFiles') }}
                </span>
                <p class="pl-1">or drag and drop</p>
              </div>
              
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ t('mediaLibrary.videoFilesUpTo') }} 10 MB, max 10 files
              </p>
            </div>
            
            <!-- Media Gallery Modal -->
            <MediaGallery 
              :is-open="showMediaGallery" 
              @close="showMediaGallery = false" 
              @select="addMediaFromGallery"
              @upload-complete="handleUploadComplete"
            />
            
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-200">
              {{ t('uploadMediaHint') }}
            </p>
          </div>
        </Field>
      </div>

      <!-- Post settings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <!-- Visibility -->
        <div>
          <Field v-slot="{ field, errorMessage }" name="visibility">
            <label class="form-label"> {{ t('visibility') }} </label>
            <div class="mt-2 space-y-3">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="visibility-public" v-model="formValues.visibility" v-bind="field" type="radio"
                    value="public" class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="visibility-public" class="font-medium text-gray-700 dark:text-gray-200">
                    {{ t('public') }}
                  </label>
                  <p class="text-gray-500 dark:text-gray-200">{{ t('publicHint') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="visibility-subscribers" v-model="formValues.visibility" v-bind="field" type="radio"
                    value="subscribers" class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="visibility-subscribers" class="font-medium text-gray-700 dark:text-gray-200">
                    {{ t('subscribersOnly') }}
                  </label>
                  <p class="text-gray-500 dark:text-gray-200">{{ t('subscribersOnlyHint') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="visibility-premium" v-model="formValues.visibility" v-bind="field" type="radio"
                    value="premium" class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="visibility-premium" class="font-medium text-gray-700 dark:text-gray-200">
                    {{ t('payPerView') }}
                  </label>
                  <p class="text-gray-500 dark:text-gray-200">{{ t('payPerViewHint') }}</p>
                </div>
              </div>
            </div>
            <p v-if="errorMessage" class="form-error mt-2">{{ errorMessage }}</p>
          </Field>
        </div>

        <!-- Price field (conditional) -->
        <div v-if="formValues.visibility === 'premium'">
          <Field v-slot="{ field, errorMessage }" name="price">
            <form-input v-model="formValues.price" v-bind="field" :label="t('price')" type="number" min="1" step="0.01"
              :placeholder="t('pricePlaceholder')" :error="errorMessage" required />
          </Field>
        </div>

        <!-- Schedule settings -->
        <div class="md:col-span-2">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="schedule" v-model="isScheduled" type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
            <div class="ml-3 text-sm">
              <label for="schedule" class="font-medium text-gray-700 dark:text-gray-200">
                {{ t('scheduleForLater') }}
              </label>
              <p class="text-gray-500 dark:text-gray-200">{{ t('scheduleHint') }}</p>
            </div>
          </div>

          <div v-if="isScheduled">
            <Field v-slot="{ field, errorMessage }" name="scheduledDate">
              <form-input v-model="scheduledDate" v-bind="field" :label="t('publishDate')" type="datetime-local"
                :min="minScheduleDate" :error="errorMessage" required />
            </Field>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 dark:bg-gray-800 py-3 flex justify-end">
      <button type="submit"
        class="w-full sm:w-auto px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
        :class="{
          'bg-primary-600 text-white hover:bg-primary-700': meta.valid && !loading,
          'bg-primary-500 text-white cursor-wait': loading,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !meta.valid,
        }">
        <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
        {{ isScheduled ? t('schedulePost') : t('publishNow') }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import FormInput from '@/components/ui/BaseInput.vue'
import MediaGallery from '@/components/ui/MediaGallery.vue'

type Visibility = 'public' | 'subscribers' | 'premium'

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
  debug?: boolean
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
  debug: true
})

const emit = defineEmits<PostFormEmits>()

const { t } = useI18n()

// Reactive form values
const formValues = reactive({
  title: '',
  content: '',
  visibility: 'public' as Visibility,
  price: 4.99,
  mediaUrls: [] as MediaFile[]
})

const mediaFiles = ref<File[]>([])
const existingMediaFiles = ref<MediaFile[]>([])
const uploadedMediaFiles = ref<MediaFile[]>([])
const isScheduled = ref(false)
const scheduledDate = ref('')
const showMediaGallery = ref(false)

// Sample data for demonstration
// onMounted(() => {
//   // Add some sample uploaded media to demonstrate the grid layout
//   uploadedMediaFiles.value = [
//     {
//       id: '1',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'image',
//       name: 'Portrait Photo.jpg',
//       size: 2500000
//     },
//     {
//       id: '2',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'video',
//       name: 'Landscape Video.mp4',
//       size: 8500000,
//       cover: '/placeholder.svg?height=200&width=200',
//       duration: 45
//     },
//     {
//       id: '3',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'image',
//       name: 'Square Image.jpg',
//       size: 1800000
//     },
//     {
//       id: '4',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'video',
//       name: 'Vertical Video.mp4',
//       size: 12000000,
//       cover: '/placeholder.svg?height=200&width=200',
//       duration: 30
//     },
//     {
//       id: '5',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'image',
//       name: 'Wide Image.jpg',
//       size: 3200000
//     },
//      {
//       id: '6',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'image',
//       name: 'Square Image.jpg',
//       size: 1800000
//     },
//     {
//       id: '7',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'video',
//       name: 'Vertical Video.mp4',
//       size: 12000000,
//       cover: '/placeholder.svg?height=200&width=200',
//       duration: 30
//     },
//     {
//       id: '8',
//       url: '/placeholder.svg?height=200&width=200',
//       type: 'image',
//       name: 'Wide Image.jpg',
//       size: 3200000
//     }
//   ]
// })

// Watch for initialValues changes
watch(() => props.initialValues, (newVal) => {
  if (newVal) {
    Object.assign(formValues, {
      title: newVal.title || '',
      content: newVal.content || '',
      visibility: newVal.visibility || 'public',
      price: newVal.price || 4.99,
    })

    existingMediaFiles.value = newVal.mediaUrls || []
    if (newVal.mediaUrls && newVal.mediaUrls.length > 0) {
      uploadedMediaFiles.value = newVal.mediaUrls
    }
    isScheduled.value = !!newVal.scheduledDate
    scheduledDate.value = newVal.scheduledDate || ''
  }
}, { deep: true, immediate: true })

// Validation schema
const schema = yup.object({
  title: yup.string()
    .required(t('validation.required'))
    .min(3, t('validation.minLength', { min: 3 }))
    .max(200, t('validation.maxLength', { max: 200 })),
  content: yup.string()
    .required(t('validation.required'))
    .min(10, t('validation.minLength', { min: 10 }))
    .max(5000, t('validation.maxLength', { max: 5000 })),
  visibility: yup.string()
    .required(t('validation.required'))
    .oneOf(['public', 'subscribers', 'premium'], t('validation.invalidVisibility')),
  price: yup.number().when('visibility', {
    is: 'premium',
    then: (schema) => schema
      .required(t('validation.required'))
      .min(0.01, t('validation.minValue', { min: 0.01 }))
      .max(999.99, t('validation.maxValue', { max: 999.99 }))
  }),
  scheduledDate: yup.string().when('isScheduled', {
    is: true,
    then: (schema) => schema
      .required(t('validation.required'))
      .test('is-future', t('validation.futureDate'), value => {
        return new Date(value) > new Date()
      })
  })
})

// Reset form function
const resetForm = () => {
  Object.assign(formValues, {
    title: '',
    content: '',
    visibility: 'public',
    price: 4.99,
  })
  mediaFiles.value = []
  existingMediaFiles.value = []
  uploadedMediaFiles.value = []
  isScheduled.value = false
  scheduledDate.value = ''
}

function onSubmit(values: any) {
  const submitData = {
    title: formValues.title,
    body: formValues.content,
    visibility: formValues.visibility,
    ...(formValues.visibility === 'premium' && { price: formValues.price }),
    mediaFiles: mediaFiles.value,
    existingMediaFiles: uploadedMediaFiles.value,
    isScheduled: isScheduled.value,
    ...(isScheduled.value && { scheduledDate: scheduledDate.value })
  }
  emit('submit', submitData)
}

function addMediaFromGallery(selectedMedia: any[]) {
  // Handle media selection from gallery
  uploadedMediaFiles.value = [...uploadedMediaFiles.value, ...selectedMedia]
}

function handleUploadComplete(results: any[]) {
  // Handle successful uploads
  const successfulUploads = results.filter(result => result.success)
  const newMedia = successfulUploads.map(result => result.data)
  uploadedMediaFiles.value = [...uploadedMediaFiles.value, ...newMedia]
}

function removeMediaFile(index: number) {
  uploadedMediaFiles.value.splice(index, 1)
}

function setCoverForVideo(media: MediaFile, index: number) {
  // Open cover selection interface
  console.log('Set cover for video:', media.name)
}

// Format video duration
function formatDuration(seconds: number): string {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Expose resetForm to parent
defineExpose({
  resetForm
})
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
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>