<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>{{ $t('content.management.title') }} - Whispers</Title> </Head>

		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('content.management.title') }}</h1>

				<p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
					{{ $t('content.management.description') }}
				</p>
			</div>

			<div class="mt-4 sm:mt-0">
				<NuxtLink to="/creator/content/new" class="btn-primary">
					<Icon name="lucide:plus" class="mr-2 h-4 w-4" /> {{ $t('content.management.createNew') }}
				</NuxtLink>
			</div>
		</div>

		<!-- Filters -->

		<div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div class="flex-1">
				<label for="search" class="sr-only">{{ $t('content.management.search.placeholder') }}</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon name="lucide:search" class="h-5 w-5 text-gray-400" aria-hidden="true" />
					</div>
					<input
						id="search"
						name="search"
						class="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
						:placeholder="$t('content.management.search.placeholder')"
						type="search"
						v-model="search"
					/>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<select
					v-model="visibilityFilter"
					class="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
				>
					<option value="all">{{ $t('content.management.filters.all') }}</option>
					<option value="public">{{ $t('content.management.filters.public') }}</option>
					<option value="private">{{ $t('content.management.filters.private') }}</option>
					<option value="premium">{{ $t('content.management.filters.premium') }}</option>
				</select>
			</div>
		</div>

		<!-- Content table/list -->

		<div class="mt-8 flow-root">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
						<table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
							<thead class="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
										{{ $t('content.management.list.title') }}
									</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
										{{ $t('content.management.list.visibility') }}
									</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
										{{ $t('content.management.list.views') }}
									</th>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
										{{ $t('content.management.list.date') }}
									</th>
									<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
										<span class="sr-only">{{ $t('content.management.list.actions') }}</span>
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
								<tr v-if="loading">
									<td colspan="5" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
										{{ $t('content.management.list.loading') }}
									</td>
								</tr>
								<tr v-else-if="filteredContent.length === 0">
									<td colspan="5" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
										{{ $t('content.management.list.noContent') }}
									</td>
								</tr>
								<tr v-for="item in filteredContent" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div class="h-10 w-10 flex-shrink-0">
												<img class="h-10 w-10 rounded-lg object-cover" :src="item.thumbnail" alt="" />
											</div>
											<div class="ml-4">
												<div class="font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</div>
												<div class="text-gray-500 dark:text-gray-400">{{ item.description }}</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
										<span
											class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
											:class="{
												'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.visibility === 'public',
												'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': item.visibility === 'private',
												'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400': item.visibility === 'premium'
											}"
										>
											{{ $t(`content.management.filters.${item.visibility}`) }}
										</span>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{{ item.views }}</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
										{{ new Date(item.createdAt).toLocaleDateString() }}
									</td>
									<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
										<div class="flex justify-end gap-2">
											<button
												@click="editContent(item)"
												class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
											>
												{{ $t('content.management.list.edit') }}
											</button>
											<button
												@click="confirmDelete(item)"
												class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
											>
												{{ $t('content.management.list.delete') }}
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Delete Confirmation Modal -->
		<TransitionRoot appear :show="showDeleteModal" as="template">
			<Dialog as="div" @close="closeDeleteModal" class="relative z-10">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-black/25 dark:bg-black/40" />
				</TransitionChild>

				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild
							as="template"
							enter="duration-300 ease-out"
							enter-from="opacity-0 scale-95"
							enter-to="opacity-100 scale-100"
							leave="duration-200 ease-in"
							leave-from="opacity-100 scale-100"
							leave-to="opacity-0 scale-95"
						>
							<DialogPanel
								class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all"
							>
								<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
									{{ $t('content.management.delete.title') }}
								</DialogTitle>
								<div class="mt-2">
									<p class="text-sm text-gray-500 dark:text-gray-400">
										{{ $t('content.management.delete.description') }}
									</p>
								</div>

								<div class="mt-4 flex justify-end space-x-3">
									<button
										type="button"
										class="inline-flex justify-center rounded-md border border-transparent bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm font-medium text-red-900 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
										@click="deleteContent"
									>
										{{ $t('content.management.delete.confirm') }}
									</button>
									<button
										type="button"
										class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
										@click="closeDeleteModal"
									>
										{{ $t('content.management.delete.cancel') }}
									</button>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useContentStore } from '../../../store/content';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useI18n } from 'vue-i18n';
import type { Content } from '../../../types/content';

definePageMeta({
	layout: 'creator',
	middleware: ['auth'],
	meta: {
		requiresAuth: true,
		requiresCreator: true,
	},
});

const { t } = useI18n();
const contentStore = useContentStore();

// State
const loading = ref<boolean>(true);
const search = ref<string>('');
const visibilityFilter = ref<string>('all');
const showDeleteModal = ref<boolean>(false);
const contentToDelete = ref<Content | null>(null);

// Computed properties
const filteredContent = computed<Content[]>(() => {
	let result = [...contentStore.content];

	// Apply search filter
	if (search.value) {
		const searchLower = search.value.toLowerCase();
		result = result.filter(
			(content) =>
				content.title.toLowerCase().includes(searchLower) || 
				content.description.toLowerCase().includes(searchLower)
		);
	}

	// Apply visibility filter
	if (visibilityFilter.value !== 'all') {
		result = result.filter((content) => content.visibility === visibilityFilter.value);
	}

	return result;
});

// Methods
function editContent(content: Content): void {
	navigateTo(`/creator/content/edit/${content.id}`);
}

function confirmDelete(content: Content): void {
	contentToDelete.value = content;
	showDeleteModal.value = true;
}

function closeDeleteModal(): void {
	showDeleteModal.value = false;
	contentToDelete.value = null;
}

async function deleteContent(): Promise<void> {
	if (!contentToDelete.value) {
		return;
	}

	try {
		await contentStore.deleteContent(contentToDelete.value.id);
		toast.success(t('notifications.contentDeleted'));
		closeDeleteModal();
	} catch (error) {
		toast.error(t('notifications.contentDeleteFailed'));
	}
}

// Fetch content on mount
onMounted(async () => {
	try {
		await contentStore.fetchContent();
		loading.value = false;
	} catch (error) {
		toast.error(t('notifications.contentLoadFailed'));
		loading.value = false;
	}
});
</script>
