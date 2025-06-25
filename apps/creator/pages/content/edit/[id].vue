<template>
	<div class="max-w-6xl mx-auto">
		<Head>
			<Title>{{ $t('content.edit.title') }} - Whispers</Title>
		</Head>

		<div class="mb-6">
			<div class="flex items-center">
				<NuxtLink to="/content" class="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
					<Icon name="lucide:arrow-left" class="h-5 w-5" />
				</NuxtLink>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('content.edit.title') }}</h1>
			</div>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-200">{{ $t('content.edit.description') }}</p>
		</div>

		<div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
			<SkeletonLoader v-if="loading" variant="post-form" :rows="5" width="80%" height="2rem" class="mx-auto my-8" />
			<PostForm
				v-else-if="postData" 
				:initial-values="postData" 
				:errors="errors" 
				:loading="updateLoading"
				:min-schedule-date="minScheduleDate" 
				:is-edit-mode="true"
				@submit="handleSubmit" 
				@draft="saveAsDraft"
				@cancel="() => router.push('/content')" 
			/>

			<div v-else class="p-8 text-center text-gray-500 dark:text-gray-200">{{ $t('content.edit.loading') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../../store/content';
import PostForm from '../../../components/PostForm.vue';
import SkeletonLoader from '../../../components/ui/SkeletonLoader.vue';
import { useNotification } from '../../../composables/useNotifications';

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();
const { t } = useI18n();
const { success, error, info } = useNotification();

definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true,
    requiresCreator: true,
  },
});

interface PostFormData {
  title: string
  content: string
  visibility: 'public' | 'private' | 'pay-to-view'
  price: number
  mediaUrls: string[]
}

interface PostFormErrors {
  title: string
  content: string
  mediaFiles: string
  visibility: string
  price: string
  scheduledDate: string
}

const errors = reactive<PostFormErrors>({
  title: '',
  content: '',
  mediaFiles: '',
  visibility: '',
  price: '',
  scheduledDate: '',
});

const minScheduleDate = computed<string>(() => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date.toISOString().slice(0, 16);
});

const postData = ref<PostFormData | null>(null);
const loading = ref(true);
const updateLoading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await contentStore.getContentById(route.params.id as string);
    const post = response.data.post;
    
    // Transform the post data to match PostForm expectations
    postData.value = {
      title: post.title,
      content: post.body,
      visibility: post.visibility,
      price: post.price,
      // Transform mediaFiles array to the expected format
      mediaUrls: post.mediaFiles ? post.mediaFiles.map(file => ({
        id: file.id || file._id,
        url: file.url || file.fileUrl,
        type: file.type,
        name: file.name,
        thumbnailUrl: file.thumbnailUrl,
        cover: file.cover || file.coverUrl,
        duration: file.duration,
        size: file.size
      })) : [],
      scheduledDate: post.scheduledDate
    };
  } catch (e) {
    error(t('content.edit.loadFailed'));
  } finally {
    loading.value = false;
  }
});

function validateForm(formData: PostFormData): boolean {
  let isValid = true;
  Object.keys(errors).forEach((key) => {
    (errors as any)[key] = '';
  });
  
  if (!formData.title || !formData.title.trim()) {
    errors.title = t('validation.required', { field: t('content.form.title') });
    isValid = false;
  } else if (formData.title.length > 100) {
    errors.title = t('validation.maxLength', { field: t('content.form.title'), max: 100 });
    isValid = false;
  }
  
  if (!formData.content || !formData.content.trim()) {
    errors.content = t('validation.required', { field: t('content.form.content') });
    isValid = false;
  }
  
  if (formData.mediaUrls && formData.mediaUrls.length > 10) {
    errors.mediaFiles = t('validation.maxFiles', { max: 10 });
    isValid = false;
  }
  
  if (formData.visibility === 'pay-to-view') {
    if (!formData.price) {
      errors.price = t('validation.required', { field: t('content.form.price') });
      isValid = false;
    } else if (formData.price < 1 || formData.price > 100) {
      errors.price = t('validation.priceRange');
      isValid = false;
    }
  }
  
  return isValid;
}

async function handleSubmit(formData: any): Promise<void> {
  try {
    updateLoading.value = true;
    // Extract media file IDs properly - formData.mediaFiles should contain the IDs
    const mediaFileIds = Array.isArray(formData.mediaFiles) 
      ? formData.mediaFiles.filter(Boolean)
      : [];

    const updateData = {
      title: formData.title,
      body: formData.body || formData.content,
      visibility: formData.visibility,
      mediaFiles: mediaFileIds,
      ...(formData.visibility === 'pay-to-view' && { price: formData.price }),
      ...(formData.isScheduled && { scheduledDate: formData.scheduledDate })
    };

    await contentStore.updateContent(route.params.id as string, updateData);
    success(t('notifications.contentUpdated'));
    router.push('/content');
  } catch (err) {
    error(t('notifications.contentUpdateFailed'));
    console.error('Update failed:', err);
  } finally {
    updateLoading.value = false;
  }
}

function saveAsDraft(formData: any): void {
  // Handle draft saving for edit mode
  info(t('notifications.draftSaved'));
}
</script>