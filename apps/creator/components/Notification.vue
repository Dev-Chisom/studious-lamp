<template>
	<div class="fixed top-4 right-4 z-50">
		<TransitionGroup
			enter-active-class="transform ease-out duration-300 transition"
			enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
			enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
			leave-active-class="transition ease-in duration-100"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-for="notification in notifications"
				:key="notification.id"
				class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 mb-4"
			>
				<div class="p-4">
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<img :src="notification.creator.avatar" class="h-10 w-10 rounded-full" :alt="notification.creator.name" />
						</div>

						<div class="ml-3 w-0 flex-1">
							<p class="text-sm font-medium text-gray-900">{{ notification.creator.name }}</p>

							<p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>

							<div class="mt-4 flex">
								<button variant="primary" class="text-sm mr-2" @click="viewContent(notification)">
									{{ $t('notifications.view') }}
								</button>
								<button variant="outline" class="text-sm" @click="dismissNotification(notification.id)">
									{{ $t('notifications.dismiss') }}
								</button>
							</div>
						</div>

						<div class="ml-4 flex-shrink-0 flex">
							<button
								class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								@click="dismissNotification(notification.id)"
							>
								<span class="sr-only">Close</span> <Icon name="lucide:x" class="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Creator {
	name: string
	avatar: string
}

interface Notification {
	id: string
	creator: Creator
	message: string
	link?: string
}

const notifications = ref<Notification[]>([]);

const viewContent = (notification: Notification): void => {
	if (notification.link) {
		navigateTo(notification.link);
	}
	dismissNotification(notification.id);
};

const dismissNotification = (id: string): void => {
	notifications.value = notifications.value.filter((n: Notification) => n.id !== id);
};

const addNotification = (notification: Notification): void => {
	notifications.value.push(notification);
	setTimeout(() => dismissNotification(notification.id), 5000);
};

defineExpose<{
	addNotification: (notification: Notification) => void
}>({ addNotification });
</script>
