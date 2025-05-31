<template>
	<div>
		<div v-if="isMobileOpen" class="fixed inset-0 lg:hidden" role="dialog" aria-modal="true" style="z-index: 400">
			<div class="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80" @click="emit('close')" />

			<div class="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white dark:bg-gray-900 dark:bg-gray-800 shadow-lg">
				<div class="flex flex-col w-full">
					<div class="px-4 py-6 bg-primary-700 dark:bg-primary-900 sm:px-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<img src="/logo-white.svg" alt="Whispers" class="h-8 w-auto" />
								<span class="text-xl font-bold text-white dark:text-gray-100">{{ $t('nav.creatorStudio') }}</span>
							</div>
							<button
								type="button" class="text-white hover:text-gray-200 dark:text-gray-100 dark:hover:text-gray-200"
								@click="emit('close')">
								<span class="sr-only">{{ $t('common.close') }}</span>
								<Icon name="lucide:x" class="h-6 w-6" />
							</button>
						</div>
					</div>

					<div class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
						<sidebar-navigation-item
							v-for="item in navigationItems" :key="item.name" :item="item"
							@click="emit('close')" />
					</div>
				</div>
			</div>
		</div>

		<div
			class="sticky bottom-0 top-0 hidden lg:flex lg:flex-shrink-0 bg-white dark:bg-gray-900 dark:bg-gray-800 h-screen">
			<div class="flex flex-col w-64">
				<div class="flex flex-col h-0 flex-1">
					<div class="px-4 py-6 bg-primary-700 dark:bg-primary-900 flex items-center">
						<div class="flex items-center space-x-2">
							<img src="/logo-white.svg" alt="Whispers" class="h-8 w-auto" />
							<span class="text-xl font-bold text-white dark:text-gray-100">{{ $t('nav.creatorStudio') }}</span>
						</div>
					</div>

					<div class="flex-1 flex flex-col overflow-y-auto">
						<nav class="flex-1 px-2 py-4 space-y-1">
							<sidebar-navigation-item v-for="item in navigationItems" :key="item.name" :item="item" />
						</nav>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
import SidebarNavigationItem from './SidebarNavigationItem.vue';

interface NavigationItem {
  name: string
  href: string
  icon: string
  divider?: boolean
}

interface CreatorSidebarProps {
  isMobileOpen: boolean
}

interface CreatorSidebarEmits {
  (e: 'close'): void
}

defineProps<CreatorSidebarProps>();
const emit = defineEmits<CreatorSidebarEmits>();
const { t } = useI18n();
const authStore = useAuthStore();



const navigationItems = computed(() => {
  const creatorStatus = authStore.profile?.data?.creatorProfile?.status;
  const isApprovedCreator = creatorStatus === 'approved';

  // Base navigation items that everyone sees
  const baseItems = [
    { name: t('nav.home'), href: '/', icon: 'lucide:home' },
    { name: t('nav.messages'), href: '/messages', icon: 'lucide:message-circle' },
    { name: t('nav.wallet'), href: '/wallet', icon: 'lucide:wallet' },
    { name: t('nav.subscriptions'), href: '/subscriptions', icon: 'lucide:credit-card' },
  ];

  // Creator-specific navigation items
  const creatorItems = isApprovedCreator ? [
    { name: t('nav.analytics'), href: '/creator/analytics', icon: 'lucide:bar-chart' },
    { name: t('nav.content'), href: '/creator/content', icon: 'lucide:image' },
    { name: t('nav.subscribers'), href: '/creator/subscribers', icon: 'lucide:users' },
    { name: t('nav.earnings'), href: '/creator/earnings', icon: 'lucide:dollar-sign' },
  ] : [];

  // "Become Creator" button (only shown if not approved)
  const becomeCreatorItem = !isApprovedCreator ? [{
    name: t('nav.becomeCreator'),
    href: '/apply',
    icon: 'lucide:user-plus',
    divider: true,
  }] : [];

  return [...baseItems, ...creatorItems, ...becomeCreatorItem];
});
</script>
