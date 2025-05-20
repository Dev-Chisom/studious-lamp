<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>{{ $t('content.edit.title') }} - Whispers</Title> </Head>

		<div class="mb-6">
			<div class="flex items-center">
				<NuxtLink to="/creator/content" class="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
					<Icon name="lucide:arrow-left" class="h-5 w-5" />
				</NuxtLink>

				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('content.edit.title') }}</h1>
			</div>

			<p class="mt-1 text-sm text-gray-500 dark:text-gray-200">{{ $t('content.edit.description') }}</p>
		</div>

		<div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
			<post-form
				v-if="postData"
				:initial-values="postData"
				:errors="errors"
				:loading="contentStore.loading"
				:min-schedule-date="minScheduleDate"
				@submit="handleSubmit"
				@draft="saveAsDraft"
				@cancel="() => router.push('/creator/content')"
			/>

			<div v-else class="p-8 text-center text-gray-500 dark:text-gray-200">{{ $t('content.edit.loading') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '../../../../store/content';
import { useI18n } from 'vue-i18n';
import PostForm from '@/components/PostForm.vue';
import type { Content } from '../../../../types/content';

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();
const { t } = useI18n();

definePageMeta({
	middleware: ['auth'],
	layout: 'creator',
	meta: {
		requiresAuth: true,
		requiresCreator: true,
	},
});

interface PostFormData {
	title: string;
	content: string;
	visibility: 'public' | 'private' | 'premium';
	price: number;
	mediaUrls: string[];
}

interface PostFormErrors {
	title: string;
	content: string;
	mediaFiles: string;
	visibility: string;
	price: string;
	scheduledDate: string;
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

const postData = ref<PostFormData | null>({
	title: 'Sample Post Title',
	content: 'This is a sample post content for editing.',
	visibility: 'public',
	price: 4.99,
	mediaUrls: ['https://images.pexels.com/photos/3000001/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800'],
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
	if (formData.visibility === 'premium') {
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

async function handleSubmit(formData: PostFormData): Promise<void> {
	if (!validateForm(formData)) {
		toast.error(t('validation.fixErrors'));
		return;
	}
	try {
		await contentStore.updatePost(route.params.id as string, formData);
		toast.success(t('notifications.contentUpdated'));
		router.push('/creator/content');
	} catch (error) {
		toast.error(t('notifications.contentUpdateFailed'));
	}
}

function saveAsDraft(formData: PostFormData): void {
	toast.info(t('notifications.draftSaved'));
}
</script>
