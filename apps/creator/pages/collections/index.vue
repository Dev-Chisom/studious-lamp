<template>
	<div class="max-w-6xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900">{{ t('myCollections') }}</h1>
			<BaseButton variant="primary" @click="showNewCollectionModal = true">{{ t('newCollection') }}</BaseButton>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<CollectionCard
				v-for="collection in collections"
				:key="collection.id"
				:collection="collection"
				@view="viewCollection"
			/>
		</div>

		<NewCollectionModal
			v-model="showNewCollectionModal"
			:loading="isCreating"
			@create="createNewCollection"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotification } from '../../composables/useNotifications'
import { useUserStore } from '~/store/user';
import BaseButton from '~/components/ui/BaseButton.vue';
import CollectionCard from '~/components/collections/CollectionCard.vue';
import NewCollectionModal from '~/components/collections/NewCollectionModal.vue';

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
const isCreating = ref(false);

const { t } = useI18n();

const notification = useNotification()

const createNewCollection = async (name: string): Promise<void> => {
	isCreating.value = true;
	try {
		await userStore.createCollection(name);
		collections.value = userStore.getCollections;
		showNewCollectionModal.value = false;
		notification.success(t('notifications.collections.createSuccess'));
	} catch {
		notification.error(t('notifications.collections.createError'));
	} finally {
		isCreating.value = false;
	}
};

const viewCollection = (collection: Collection): void => {
	navigateTo(`/collections/${collection.id}`);
};
</script>
