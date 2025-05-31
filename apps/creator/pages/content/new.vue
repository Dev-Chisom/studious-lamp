<template>
	<div class="max-w-6xl mx-auto">
		<Head>
			<Title>{{ t('content.new.title') }} - Whispers</Title>
		</Head>

		<div class="mb-6">
			<div class="flex items-center">
				<NuxtLink to="/content" class="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
					<Icon name="lucide:arrow-left" class="h-5 w-5" />
				</NuxtLink>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('content.new.title') }}</h1>
			</div>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-200">{{ t('content.new.description') }}</p>
		</div>

		<div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
			<post-form
				:initial-values="post" 
				:loading="isSubmitting" 
				:min-schedule-date="minScheduleDate"
				@submit="handleSubmit" 
				@draft="saveAsDraft" 
				@cancel="navigateBack" 
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { createCreatorApi } from '@whispers/api';
import { useContentStore } from '../../store/content';
import PostForm from '../../components/PostForm.vue';
import { useApiRequest } from '../../composables/useApiRequest';
import { useNotification } from '../../composables/useNotifications';
const { success, error, info } = useNotification();

const router = useRouter();
const contentStore = useContentStore();
const { t } = useI18n();
const creatorApi = createCreatorApi();

definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true,
    requiresCreator: true,
  },
});

// Initial post data
const post = reactive({
  title: '',
  content: '',
  visibility: 'public',
  price: 4.99,
  mediaUrls: [],
});

// Computed minimum schedule date (10 minutes from now)
const minScheduleDate = computed<string>(() => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date.toISOString().slice(0, 16);
});

// API request hooks
const { loading: uploadLoading, error: uploadError, execute: uploadMediaFile } = useApiRequest(creatorApi.uploadMediaFile);
const { loading: createLoading, error: createError, execute: createPost } = useApiRequest(creatorApi.createPost);

// Combined loading state
const isSubmitting = computed(() => uploadLoading.value || createLoading.value);

// Navigate back to content list
function navigateBack() {
  router.push('/content');
}

async function handleSubmit(formData) {
  try {
    // Process media files if present
    let mediaFileIds = [];
    if (formData.mediaFiles?.length > 0) {
      try {
        // Upload each media file
        for (const file of formData.mediaFiles) {
          if (file instanceof File) {
            const response = await uploadMediaFile(file.name, file.type);
            const { uploadUrl, mediaFileId } = response.data;
            await fetch(uploadUrl, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type },
            });
            mediaFileIds.push(mediaFileId);
          }
        }
      } catch (err) {
        error(t('notifications.mediaUploadFailed'));
        console.error('Media upload failed:', err);
        return;
      }
    }
    // Handle existing media files
    if (formData.existingMediaFiles?.length > 0) {
      mediaFileIds = [...mediaFileIds, ...formData.existingMediaFiles.map(media => media.id)].filter(Boolean);
    }
    // Create the post
    await createPost({
      title: formData.title,
      body: formData.body,
      mediaFiles: mediaFileIds,
      visibility: formData.visibility === 'premium' ? 'pay-to-view' : formData.visibility,
      price: formData.visibility === 'premium' ? formData.price : undefined,
      scheduledDate: formData.isScheduled ? formData.scheduledDate : undefined,
    });
    success(t('notifications.contentCreated'));
    router.push('/content');
  } catch (err) {
    error(t('notifications.contentCreateFailed'));
    console.error('Post creation failed:', err);
  }
}

/**
 * Save post as draft
 */
async function saveAsDraft(formData) {
  try {
    let mediaFileIds = [];
    if (formData.mediaFiles?.length > 0) {
      for (const file of formData.mediaFiles) {
        if (file instanceof File) {
          const response = await uploadMediaFile(file.name, file.type);
          const { uploadUrl, mediaFileId } = response.data;
          await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });
          mediaFileIds.push(mediaFileId);
        }
      }
    }
    await createPost({
      title: formData.title || t('content.untitledDraft'),
      body: formData.body || '',
      mediaFiles: mediaFileIds,
      visibility: formData.visibility || 'public',
      price: formData.visibility === 'premium' ? formData.price : undefined,
      isDraft: true
    });
    info(t('notifications.draftSaved'));
    router.push('/content');
  } catch (err) {
    error(t('notifications.draftSaveFailed'));
  }
}
</script>