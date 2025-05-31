<template>
	<div class="max-w-6xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900">{{ t('myCollections') }}</h1>
			<BaseButton variant="primary" @click="showNewCollectionModal = true">{{ t('newCollection') }}</BaseButton>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<Card v-for="collection in collections" :key="collection.id" class="hover:shadow-hover transition-shadow">
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-900">{{ collection.name }}</h3>

					<p class="text-gray-500">{{ collection.posts.length }} posts</p>

					<div class="grid grid-cols-2 gap-2">
						<div v-for="(post, index) in collection.posts.slice(0, 4)" :key="index" class="aspect-square">
							<img :src="post.image" :alt="post.title" class="w-full h-full object-cover rounded-lg" />
						</div>
					</div>

					<BaseButton variant="outline" class="w-full" @click="viewCollection(collection)"
					>{{ t('viewCollection') }}
					</BaseButton>
				</div>
			</Card>
		</div>

		<!-- New Collection Modal -->
		<Modal v-if="showNewCollectionModal" @close="showNewCollectionModal = false">
			<div class="p-6">
				<h2 class="text-xl font-semibold mb-4">{{ t('createNewCollection') }}</h2>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{{ t('collectionName') }}</label>
						<input
							v-model="newCollectionName"
							type="text"
							class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
							placeholder="My Favorite Posts"
						/>
					</div>

					<BaseButton :loading="isCreating" variant="primary" class="w-full" @click="createNewCollection">
						{{ t('createCollection') }}
					</BaseButton>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import { useUserStore } from '~/store/user';
import BaseButton from '~/components/ui/BaseButton.vue';

interface CollectionPost {
	id: string
	image: string
	title: string
}

interface Collection {
	id: string
	name: string
	posts: CollectionPost[]
}

const userStore = useUserStore();
const collections = ref<Collection[]>(userStore.getCollections);

const showNewCollectionModal = ref(false);
const newCollectionName = ref('');
const isCreating = ref(false);

const { t } = useI18n();

const createNewCollection = async (): Promise<void> => {
	if (!newCollectionName.value.trim()) {
		return;
	}

	isCreating.value = true;
	try {
		await userStore.createCollection(newCollectionName.value);
		collections.value = userStore.getCollections;
		showNewCollectionModal.value = false;
		newCollectionName.value = '';
		toast.success('Collection created successfully!');
	} catch {
		toast.error('Failed to create collection');
	} finally {
		isCreating.value = false;
	}
};

const viewCollection = (collection: Collection): void => {
	// Navigate to collection detail view
	navigateTo(`/collections/${collection.id}`);
};
</script>
