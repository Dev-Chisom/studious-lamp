<template>
	<div
		class="px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 cursor-pointer"
		:class="{ 'bg-primary-50': !notification.isRead }"
		@click="handleClick"
	>
		<div class="avatar h-10 w-10 flex-shrink-0">
			<img v-if="notification.image" :src="notification.image" alt="User" class="h-full w-full object-cover" />
			<div v-else class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
				<Icon :name="getIcon(notification.type)" class="h-5 w-5" />
			</div>
		</div>

		<div class="flex-1 min-w-0">
			<p class="text-sm text-gray-900" :class="{ 'font-semibold': !notification.isRead }">
				{{ notification.content }}
			</p>

			<p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.createdAt) }}</p>
		</div>

		<div v-if="!notification.isRead" class="flex-shrink-0">
			<div class="h-2 w-2 rounded-full bg-primary-500" />
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	notification: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(['read']);

function getIcon(type) {
	switch (type) {
		case 'subscription':
			return 'lucide:user-plus';
		case 'tip':
			return 'lucide:dollar-sign';
		case 'message':
			return 'lucide:message-circle';
		case 'post_like':
			return 'lucide:heart';
		case 'post_comment':
			return 'lucide:message-square';
		default:
			return 'lucide:bell';
	}
}

function formatTime(date) {
	const now = new Date();
	const diff = now - new Date(date);

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 60) {
		return `${minutes}m ago`;
	} else if (hours < 24) {
		return `${hours}h ago`;
	} else if (days < 7) {
		return `${days}d ago`;
	} else {
		return new Date(date).toLocaleDateString();
	}
}

function handleClick() {
	if (!props.notification.isRead) {
		emit('read');
	}
	// Handle click based on notification type
	// e.g., navigateTo(props.notification.link)
}
</script>
