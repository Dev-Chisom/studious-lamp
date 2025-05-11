<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>Content Management - Whispers</Title> </Head>

		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Management</h1>

				<p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
					Create, edit, and manage your content.
				</p>
			</div>

			<div class="mt-4 sm:mt-0">
				<NuxtLink to="/creator/content/new" class="btn-primary">
					<Icon name="lucide:plus" class="mr-2 h-4 w-4" /> Create New Post
				</NuxtLink>
			</div>
		</div>

		<!-- Filters -->

		<div
			class="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
		>
			<div class="flex-1">
				<label for="search" class="sr-only">Search</label>
				<div class="relative rounded-md shadow-sm">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="lucide:search" class="h-5 w-5 text-gray-400" />
					</div>
					<input id="search" v-model="search" type="search" placeholder="Search content..." class="form-input pl-10" />
				</div>
			</div>

			<div class="w-full sm:w-auto">
				<select v-model="visibilityFilter" class="form-input">
					<option value="">All Visibility</option>

					<option value="public">Public</option>

					<option value="subscribers">Subscribers Only</option>

					<option value="ppv">Pay-per-view</option>
				</select>
			</div>

			<div class="w-full sm:w-auto">
				<select v-model="sortBy" class="form-input">
					<option value="newest">Newest First</option>

					<option value="oldest">Oldest First</option>

					<option value="popular">Most Popular</option>
				</select>
			</div>
		</div>

		<!-- Content table/list -->

		<div class="mt-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
			<div
				class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider"
			>
				Content List
			</div>

			<div v-if="loading" class="p-8 text-center">
				<Icon name="lucide:loader" class="h-8 w-8 mx-auto animate-spin text-primary-500" />
				<p class="mt-2 text-gray-500 dark:text-gray-200 dark:text-gray-400">Loading content...</p>
			</div>

			<ul v-else-if="filteredPosts.length !== 0" class="divide-y divide-gray-200">
				<li v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50 hover:dark:bg-gray-700">
					<div class="px-4 py-4 sm:px-6 flex items-center">
						<div class="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 mr-4">
							<img
								v-if="post.mediaUrls && post.mediaUrls.length > 0"
								:src="post.mediaUrls[0]"
								:alt="post.title"
								class="w-full h-full object-cover"
							/>

							<div v-else class="w-full h-full flex items-center justify-center text-gray-400">
								<Icon name="lucide:file" class="h-6 w-6" />
							</div>
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center">
								<h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ post.title }}</h3>
								<span v-if="post.visibility === 'subscribers'" class="ml-2 badge badge-primary"> Subscribers </span>
								<span v-else-if="post.visibility === 'ppv'" class="ml-2 badge badge-secondary"> Pay-per-view </span>
								<span v-else class="ml-2 badge badge-success"> Public </span>
								<span v-if="post.scheduledFor" class="ml-2 badge badge-warning"> Scheduled </span>
							</div>

							<div class="mt-1">
								<p class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
									{{ truncateContent(post.content) }}
								</p>
							</div>

							<div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400 space-x-4">
								<span class="flex items-center">
									<Icon name="lucide:calendar" class="h-4 w-4 mr-1" /> {{ formatDate(post.createdAt) }}
								</span>
								<span class="flex items-center">
									<Icon name="lucide:heart" class="h-4 w-4 mr-1" /> {{ post.likes }}
								</span>
								<span class="flex items-center">
									<Icon name="lucide:message-square" class="h-4 w-4 mr-1" /> {{ post.comments }}
								</span>
								<span v-if="post.price" class="flex items-center">
									<Icon name="lucide:dollar-sign" class="h-4 w-4 mr-1" /> {{ post.price }}
								</span>
							</div>
						</div>

						<div class="ml-4 flex-shrink-0 flex space-x-2">
							<button
								class="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
								@click="editPost(post.id)"
							>
								<Icon name="lucide:pencil" class="h-5 w-5" /> <span class="sr-only">Edit</span>
							</button>
							<button
								class="p-2 text-gray-500 hover:text-error-600 dark:text-gray-200 dark:hover:text-error-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
								@click="confirmDelete(post.id)"
							>
								<Icon name="lucide:trash-2" class="h-5 w-5" /> <span class="sr-only">Delete</span>
							</button>
						</div>
					</div>
				</li>
			</ul>

			<div v-else class="p-8 text-center">
				<Icon name="lucide:file-x" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 dark:text-gray-200" />
				<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No content found</h3>

				<p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
					{{ search ? 'Try adjusting your search or filters.' : 'Get started by creating your first post.' }}
				</p>

				<div class="mt-6">
					<NuxtLink to="/creator/content/new" class="btn-primary">
						<Icon name="lucide:plus" class="mr-2 h-4 w-4" /> Create New Post
					</NuxtLink>
				</div>
			</div>
		</div>

		<!-- Delete confirmation modal -->

		<div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<!-- Overlay -->

				<div class="fixed inset-0 transition-opacity">
					<div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 dark:opacity-80" />
				</div>

				<!-- Modal Container -->
				<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
				<div
					class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
				>
					<!-- Modal Content -->

					<div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<!-- Warning Icon -->

							<div
								class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 dark:bg-error-900 sm:mx-0 sm:h-10 sm:w-10"
							>
								<Icon name="lucide:alert-triangle" class="h-6 w-6 text-error-600 dark:text-error-400" />
							</div>

							<!-- Text Content -->

							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Delete Content</h3>

								<div class="mt-2">
									<p class="text-sm text-gray-500 dark:text-gray-300">
										Are you sure you want to delete this content? This action cannot be undone.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Modal Footer -->

					<div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<!-- Delete Button -->
						<button
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 dark:bg-error-700 text-base font-medium text-white hover:bg-error-700 dark:hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
							@click="deletePost"
						>
							Delete
						</button>

						<!-- Cancel Button -->
						<button
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							@click="showDeleteModal = false"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useContentStore } from '~/stores/content';

definePageMeta({
	layout: 'creator',
	middleware: ['auth'],
	meta: {
		requiresAuth: true,
		requiresCreator: true,
	},
});

interface Post {
	id: string
	title: string
	content: string
	mediaUrls: string[]
	createdAt: string | Date
	likes: number
	comments: number
	visibility: 'public' | 'subscribers' | 'ppv'
	price?: number
	scheduledFor?: string | Date
}

const contentStore = useContentStore();

// State
const loading = ref<boolean>(true);
const search = ref<string>('');
const visibilityFilter = ref<string>('');
const sortBy = ref<string>('newest');
const showDeleteModal = ref<boolean>(false);
const postToDelete = ref<string | null>(null);

// Fetch posts on mount
onMounted(async () => {
	try {
		await contentStore.fetchPosts({ creatorId: '123' }); // In a real app, this would be the current user's ID
		loading.value = false;
	} catch (error) {
		toast.error('Failed to load content. Please try again.');
		loading.value = false;
	}
});

// Computed properties
const filteredPosts = computed<Post[]>(() => {
	let result = [...contentStore.posts] as Post[];

	// Apply search filter
	if (search.value) {
		const searchLower = search.value.toLowerCase();
		result = result.filter(
			(post: Post) =>
				post.title.toLowerCase().includes(searchLower) || post.content.toLowerCase().includes(searchLower),
		);
	}

	// Apply visibility filter
	if (visibilityFilter.value) {
		result = result.filter((post: Post) => post.visibility === visibilityFilter.value);
	}

	// Apply sorting
	switch (sortBy.value) {
		case 'newest':
			result.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			break;
		case 'oldest':
			result.sort((a: Post, b: Post) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
			break;
		case 'popular':
			result.sort((a: Post, b: Post) => b.likes - a.likes);
			break;
	}

	return result;
});

// Methods
function truncateContent(content: string, length = 80): string {
	if (content.length <= length) {
		return content;
	}
	return content.substring(0, length) + '...';
}

function formatDate(dateString: string | Date): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

function editPost(id: string): void {
	navigateTo(`/creator/content/edit/${id}`);
}

function confirmDelete(id: string): void {
	postToDelete.value = id;
	showDeleteModal.value = true;
}

async function deletePost(): Promise<void> {
	if (!postToDelete.value) {
		return;
	}

	try {
		await contentStore.deletePost(postToDelete.value);
		toast.success('Content deleted successfully');
		showDeleteModal.value = false;
		postToDelete.value = null;
	} catch (error) {
		toast.error('Failed to delete content. Please try again.');
	}
}
</script>
