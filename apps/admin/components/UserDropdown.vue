<template>
	<div class="relative">
		<button
			class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
			@click="isOpen = !isOpen"
		>
			<div class="avatar h-8 w-8 bg-primary-100">
				<img
					v-if="userStore.profile.user?.profileImage"
					:src="userStore.profile.user.profileImage"
					alt="Profile"
					class="h-full w-full object-cover"
				/>

				<div v-else class="h-full w-full flex items-center justify-center text-primary-600 font-medium">
					{{ userInitials }}
				</div>
			</div>
			<span class="hidden md:block text-sm font-medium"> {{ userStore.profile.user?.displayName || 'Account' }} </span>
			<Icon name="lucide:chevron-down" class="h-4 w-4" aria-hidden="true" />
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
		>
			<div class="py-1">
				<div class="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
					<p class="font-medium">{{ userStore.profile.user?.displayName || 'User' }}</p>

					<p class="text-gray-500 truncate">{{ userStore.profile.user?.email || 'user@example.com' }}</p>
				</div>

				<NuxtLink
					v-for="item in userLinks"
					:key="item.name"
					:to="item.href"
					class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
					@click="isOpen = false"
				>
					{{ item.name }}
				</NuxtLink>
			</div>

			<!-- Creator links -->

			<div v-if="userStore.profile.user?.isCreator" class="py-1">
				<NuxtLink
					v-for="item in creatorLinks"
					:key="item.name"
					:to="item.href"
					class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
					@click="isOpen = false"
				>
					{{ item.name }}
				</NuxtLink>
			</div>

			<div class="py-1">
				<button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="logout">
					Sign out
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/store/user';

const userStore.profile = useUserStore();
const isOpen = ref(false);

const userInitials = computed(() => {
	const name = userStore.profile.user?.displayName || '';
	if (!name) {
		return '?';
	}

	const parts = name.split(' ');
	if (parts.length > 1) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

const userLinks = [
	{ name: 'Your Profile', href: '/profile' },
	{ name: 'Subscriptions', href: '/subscriptions' },
	{ name: 'Settings', href: '/settings' },
];

const creatorLinks = [
	{ name: 'Creator Dashboard', href: '/creator/dashboard' },
	{ name: 'Content Manager', href: '/creator/content' },
	{ name: 'Earnings', href: '/creator/earnings' },
];

function logout() {
	userStore.profile.logout();
	isOpen.value = false;
	navigateTo('/');
}

// Close dropdown when clicking outside
const closeDropdown = () => {
	if (isOpen.value) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
	document.removeEventListener('click', closeDropdown);
});
</script>
