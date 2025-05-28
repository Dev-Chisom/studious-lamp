<template>
  <div class="max-w-6xl mx-auto">

    <Head>
      <Title>{{ $t('content.new.title') }} - Whispers</Title>
    </Head>

    <div class="mb-6">
      <div class="flex items-center">
        <NuxtLink to="/creator/content" class="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </NuxtLink>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('content.new.title') }}</h1>
      </div>

      <p class="mt-1 text-sm text-gray-500 dark:text-gray-200">{{ $t('content.new.description') }}</p>
    </div>

    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
      <post-form :initial-values="post" :loading="apiLoading" :min-schedule-date="minScheduleDate"
        @submit="handleSubmit" @draft="saveAsDraft" @cancel="() => router.push('/creator/content')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '../../../store/content'
import PostForm from '@/components/PostForm.vue'
import { createCreatorApi } from '@whispers/api'
import { useApiRequest } from '~/composables/useApiRequest'

const router = useRouter()
const contentStore = useContentStore()
const { t } = useI18n()
const creatorApi = createCreatorApi()

definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true,
    requiresCreator: true,
  },
})


const post = reactive({
  title: '',
  content: '',
  visibility: 'public',
  price: 4.99,
  mediaUrls: [],
})

const minScheduleDate = computed<string>(() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 10)
  return date.toISOString().slice(0, 16)
})

const { loading: apiLoading, error: apiError, execute: uploadMediaFile } = useApiRequest(creatorApi.uploadMediaFile)
const { execute: createPost } = useApiRequest(creatorApi.createPost)

async function handleSubmit(formData) {
  if (
    formData.mediaFiles &&
    Array.isArray(formData.mediaFiles) &&
    formData.mediaFiles.length > 0 &&
    formData.mediaFiles[0] instanceof File
  ) {
    const mediaFileIds = [];
    for (const file of formData.mediaFiles) {
      const response = await uploadMediaFile(file.name, file.type);
      const { uploadUrl, mediaFileId } = response.data;
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      mediaFileIds.push(mediaFileId);
    }

    await createPost({
      title: formData.title,
      body: formData.body,
      mediaFiles: mediaFileIds,
      visibility: formData.visibility === 'ppv' ? 'pay-to-view' : formData.visibility,
      price: formData.visibility === 'ppv' ? formData.price : undefined,
      scheduledDate: formData.isScheduled ? formData.scheduledDate : undefined,
    });
  } else {
    await createPost({
      title: formData.title,
      body: formData.body,
      mediaFiles: [],
      visibility: formData.visibility === 'ppv' ? 'pay-to-view' : formData.visibility,
      price: formData.visibility === 'ppv' ? formData.price : undefined,
      scheduledDate: formData.isScheduled ? formData.scheduledDate : undefined,
    });
  }
}

function saveAsDraft(formData: any): void {
  console.log(formData)
  toast.info(t('notifications.draftSaved'))
}
</script>
