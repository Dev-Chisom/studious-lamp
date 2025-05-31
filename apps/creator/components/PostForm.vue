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
      <div 
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 text-center cursor-pointer"
        @click="showMediaGallery = true"
      >
        <!-- Upload icon -->
        <Icon name="lucide:upload" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        
        <div class="mt-4 flex text-sm text-gray-600 dark:text-gray-300">
          <span class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            {{ t('uploadFiles') }}
          </span>
          <p class="pl-1">or drag and drop</p>
        </div>
        
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ t('videoFilesUpTo') }} 10 MB
        </p>
      </div>
      
      <!-- Media Gallery Modal -->
      <MediaGallery 
        :is-open="showMediaGallery" 
        @close="showMediaGallery = false" 
        @select="addMediaFromGallery" 
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
          'bg-primary-600 text-white hover:bg-primary-700': meta.valid && !loaading,
          'bg-primary-500 text-white cursor-wait': loaading,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !meta.valid,
        }">
        <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
        {{ isScheduled ? t('schedulePost') : t('publishNow') }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import FormInput from '@/components/ui/BaseInput.vue'
import FormFileUpload from '@/components/ui/FormFileUpload.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MediaGallery from '@/components/ui/MediaGallery.vue'

type Visibility = 'public' | 'subscribers' | 'premium'

interface MediaFile {
  id?: string
  url: string
  type: string
  name: string
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
const isScheduled = ref(false)
const scheduledDate = ref('')
const showMediaGallery = ref(false)

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
  mediaFiles: yup
    .mixed()
    .optional()
    .test(
      'fileSize',
      t('validation.fileTooLarge'),
      (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true
        return Array.from(value as File[]).every(file => file.size <= 10 * 1024 * 1024)
      }
    )
    .test(
      'fileType',
      t('validation.invalidFileType'),
      (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true
        return Array.from(value as File[]).every(file =>
          ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'].includes(file.type)
        )
      }
    )
    .test(
      'totalSize',
      t('validation.totalSizeExceeded'),
      (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true
        const totalSize = Array.from(value as File[]).reduce((acc, file) => acc + file.size, 0)
        return totalSize <= 50 * 1024 * 1024
      }
    ),
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
    existingMediaFiles: existingMediaFiles.value,
    isScheduled: isScheduled.value,
    ...(isScheduled.value && { scheduledDate: scheduledDate.value })
  }
  emit('submit', submitData)
}

function addMediaFromGallery(selectedMedia: any[]) {
  // If from device, selectedMedia will be File[]; if from library, it will be MediaItem[]
  const filesToAdd: File[] = []
  selectedMedia.forEach((item) => {
    if (item instanceof File) {
      filesToAdd.push(item)
    } else if (item.url) {
      // For library items, fetch as blob and create File
      fetch(item.url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], item.name, { type: blob.type })
          filesToAdd.push(file)
          mediaFiles.value = [...mediaFiles.value, file]
        })
    }
  })
  // For device files, add immediately
  if (filesToAdd.length > 0) {
    mediaFiles.value = [...mediaFiles.value, ...filesToAdd]
  }
}

// Expose resetForm to parent
defineExpose({
  resetForm
})
</script>