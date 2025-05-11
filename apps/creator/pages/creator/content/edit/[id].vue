<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>Edit Post - Whispers</Title> </Head>

		<div class="mb-6">
			<div class="flex items-center">
				<NuxtLink to="/creator/content" class="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
					<Icon name="lucide:arrow-left" class="h-5 w-5" />
				</NuxtLink>

				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h1>
			</div>

			<p class="mt-1 text-sm text-gray-500 dark:text-gray-200">Update your content and save changes.</p>
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

			<div v-else class="p-8 text-center text-gray-500 dark:text-gray-200">Loading post...</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '~/stores/content';
import PostForm from '@/components/PostForm.vue';

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();

definePageMeta({
	middleware: ['auth'],
	layout: 'creator',
	meta: {
		requiresAuth: true,
	},
});

interface PostFormData {
	title: string
	content: string
	visibility: 'public' | 'subscribers' | 'ppv'
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

const postData = ref<PostFormData | null>({
	title: 'Sample Post Title',
	content: 'This is a sample post content for editing.',
	visibility: 'public',
	price: 4.99,
	mediaUrls: ['https://images.pexels.com/photos/3000001/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800'],
});

//   const { data: postData, pending } = await useAsyncData('edit-post', async () => {
//     try {
//       const fetched = await contentStore.fetchPostById(route.params.id);
//       if (fetched) return fetched;
//       // Prefill with dummy data if not found
//       return {
//         title: 'Sample Post Title',
//         content: 'This is a sample post content for editing.',
//         visibility: 'public',
//         price: 4.99,
//         mediaUrls: [
//           'https://images.pexels.com/photos/3000001/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800'
//         ]
//       };
//     } catch (e) {
//       // Prefill with dummy data on error
//       return {
//         title: 'Sample Post Title',
//         content: 'This is a sample post content for editing.',
//         visibility: 'public',
//         price: 4.99,
//         mediaUrls: [
//           'https://images.pexels.com/photos/3000001/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800'
//         ]
//       };
//     }
//   });

function validateForm(formData: any): boolean {
	let isValid = true;
	Object.keys(errors).forEach((key) => {
		;(errors as any)[key] = '';
	});
	if (!formData.title || !formData.title.trim()) {
		errors.title = 'Title is required';
		isValid = false;
	} else if (formData.title.length > 100) {
		errors.title = 'Title must be less than 100 characters';
		isValid = false;
	}
	if (!formData.content || !formData.content.trim()) {
		errors.content = 'Content is required';
		isValid = false;
	}
	if (formData.mediaFiles && formData.mediaFiles.length > 10) {
		errors.mediaFiles = 'Maximum 10 files allowed';
		isValid = false;
	}
	if (formData.visibility === 'ppv') {
		if (!formData.price) {
			errors.price = 'Price is required for pay-per-view content';
			isValid = false;
		} else if (formData.price < 1 || formData.price > 100) {
			errors.price = 'Price must be between $1 and $100';
			isValid = false;
		}
	}
	if (formData.isScheduled) {
		if (!formData.scheduledDate) {
			errors.scheduledDate = 'Please select a publish date';
			isValid = false;
		} else {
			const scheduleTime = new Date(formData.scheduledDate).getTime();
			const minTime = new Date(minScheduleDate.value).getTime();
			if (scheduleTime < minTime) {
				errors.scheduledDate = 'Schedule time must be at least 10 minutes in the future';
				isValid = false;
			}
		}
	}
	return isValid;
}

async function handleSubmit(formData: any): Promise<void> {
	if (!validateForm(formData)) {
		toast.error('Please fix the errors in the form');
		return;
	}
	try {
		await contentStore.updatePost(route.params.id, formData);
		toast.success('Post updated successfully');
		router.push('/creator/content');
	} catch (error) {
		toast.error('Failed to update post. Please try again.');
	}
}

function saveAsDraft(formData: any): void {
	toast.info('Draft saved successfully');
}
</script>
