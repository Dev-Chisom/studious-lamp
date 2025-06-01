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
    await createPost({
      title: formData.title,
      body: formData.body,
      mediaFiles: formData.mediaFiles,
      visibility: formData.visibility === 'pay-to-view' ? 'pay-to-view' : formData.visibility,
      price: formData.visibility === 'pay-to-view' ? formData.price : undefined,
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
    await createPost({
      title: formData.title || t('content.untitledDraft'),
      body: formData.body || '',
      mediaFiles: formData.mediaFiles,
      visibility: formData.visibility || 'public',
      price: formData.visibility === 'pay-to-view' ? formData.price : undefined,
      isDraft: true
    });
    info(t('notifications.draftSaved'));
    router.push('/content');
  } catch (err) {
    error(t('notifications.draftSaveFailed'));
  }
}
</script>