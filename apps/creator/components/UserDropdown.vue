<template>
	<div ref="dropdownRef" class="relative">
		<button
			class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 focus:outline-none"
			@click="isOpen = !isOpen"
		>
			<div class="avatar h-8 w-8 bg-primary-100 dark:bg-primary-900">
				<img
					v-if="userStore.user?.profileImage"
					:src="userStore.user.profileImage"
					alt="Profile"
					class="h-full w-full object-cover"
				/>

				<div
					v-else
					class="h-full w-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium"
				>
					{{ userInitials }}
				</div>
			</div>
			<span class="hidden md:block text-sm font-medium text-gray-900 dark:text-gray-100">
				{{ userStore.user?.displayName || 'Account' }}
			</span>
			<Icon
				name="lucide:chevron-down"
				class="h-4 w-4 text-gray-500 dark:text-gray-200 dark:text-gray-400"
				aria-hidden="true"
			/>
		</button>

		<div
			v-if="isOpen"
			class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 z-300"
		>
			<div class="py-1">
				<div class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
					<p class="font-medium">{{ userStore.user?.displayName || 'User' }}</p>

					<p class="text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
						{{ userStore.user?.email || 'user@example.com' }}
					</p>
				</div>

				<NuxtLink
					v-for="item in userLinks"
					:key="item.name"
					:to="item.href"
					class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
					@click="isOpen = false"
				>
					{{ item.name }}
				</NuxtLink>
			</div>

			<div class="hover:bg-gray-50 dark:hover:bg-gray-800">
				<button class="text-sm px-4 py-2 border-0 flex items-center space-x-2 w-full" @click="toggleDarkMode">
					<Icon :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="h-4 w-4" />
					<span>{{ modeText }}</span>
				</button>
			</div>

			<!-- Creator links -->

			<div v-if="userStore.user?.isCreator" class="py-1">
				<NuxtLink
					v-for="item in creatorLinks"
					:key="item.name"
					:to="item.href"
					class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
					@click="isOpen = false"
				>
					{{ item.name }}
				</NuxtLink>
			</div>

			<div class="py-1">
				<button
					class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
					@click="logout"
				>
					{{ $t('userDropdown.logout') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../store/user';
import { useAuthStore } from '../store/auth';
import { useColorMode } from '#imports';

const { t } = useI18n();

interface NavLink {
	name: string
	href: string
}

const modeText = computed(() => (colorMode.value === 'dark' ? t('theme.light') : t('theme.dark')));

const userStore = useUserStore();
const authStore = useAuthStore();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const colorMode = useColorMode();

const userInitials = computed((): string => {
	const name = userStore.user?.displayName || '';
	if (!name) {
		return '?';
	}

	const parts = name.split(' ');
	if (parts.length > 1) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

const profileHref = computed((): string => {
	if (userStore.user && userStore.user.displayName) {
		return `/@${encodeURIComponent(userStore.user.displayName)}`;
	}
	return '/@user';
});

const userLinks: NavLink[] = computed(() => [
	{ name: t('nav.user.profile'), href: profileHref.value },
	{ name: t('nav.user.subscriptions'), href: '/subscriptions' },
	{ name: t('nav.user.settings'), href: '/settings' },
]);

const creatorLinks: NavLink[] = computed(() => [
	{ name: t('nav.creator.dashboard'), href: '/creator/analytics' },
	{ name: t('nav.creator.content'), href: '/content' },
	{ name: t('nav.creator.earnings'), href: '/creator/earnings' },
]);

const logout = (): void => {
	authStore.logout();
	isOpen.value = false;
	navigateTo('/');
};

// Close dropdown when clicking outside
const closeDropdown = (e: MouseEvent): void => {
	if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
		isOpen.value = false;
	}
};

function toggleDarkMode(): void {
	colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	isOpen.value = false;
}

onMounted(() => {
	document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
	document.removeEventListener('click', closeDropdown);
});
</script>
