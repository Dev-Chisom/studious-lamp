<template>
  <div class="relative" ref="dropdownRef">
    <button @click="isOpen = !isOpen"
      class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 focus:outline-none">
      <div class="avatar h-8 w-8 bg-primary-100 dark:bg-primary-900">
        <img v-if="authStore.user?.profileImage" :src="authStore.user.profileImage" alt="Profile"
          class="h-full w-full object-cover" />
        <div v-else
          class="h-full w-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
          {{ userInitials }}
        </div>
      </div>
      <span class="hidden md:block text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ authStore.user?.displayName || 'Account' }}
      </span>
      <Icon name="lucide:chevron-down" class="h-4 w-4 text-gray-500 dark:text-gray-200 dark:text-gray-400"
        aria-hidden="true" />
    </button>

    <div v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700"
      style="z-index: 300">
      <div class="py-1">
        <div class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
          <p class="font-medium">{{ authStore.user?.displayName || 'User' }}</p>
          <p class="text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">{{ authStore.user?.email ||
            'user@example.com' }}</p>
        </div>

        <NuxtLink v-for="item in userLinks" :key="item.name" :to="item.href"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="isOpen = false">
          {{ item.name }}
        </NuxtLink>
      </div>

      <div class="hover:bg-gray-50 dark:hover:bg-gray-800">
        <button @click="toggleDarkMode" class="text-sm px-4 py-2 border-0 flex items-center space-x-2 w-full">
          <Icon :name="isDarkMode ? 'lucide:sun' : 'lucide:moon'" class="h-4 w-4" />
          <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>

      <!-- Creator links -->
      <div v-if="authStore.user?.isCreator" class="py-1">
        <NuxtLink v-for="item in creatorLinks" :key="item.name" :to="item.href"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="isOpen = false">
          {{ item.name }}
        </NuxtLink>
      </div>

      <div class="py-1">
        <button @click="logout"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isOpen = ref(false);
const dropdownRef = ref(null)

const userInitials = computed(() => {
  const name = authStore.user?.displayName || '';
  if (!name) return '?';

  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

const userLinks = [
  { name: 'Your Profile', href: authStore.user?.displayName ? `/@${authStore.user.displayName}` : '/@user' },
  { name: 'Subscriptions', href: '/subscriptions' },
  { name: 'Settings', href: '/settings' },
];

const creatorLinks = [
  { name: 'Creator Dashboard', href: '/creator/dashboard' },
  { name: 'Content Manager', href: '/creator/content' },
  { name: 'Earnings', href: '/creator/earnings' },
];

function logout() {
  authStore.logout();
  isOpen.value = false;
  navigateTo('/');
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

const isDarkMode = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  // Set initial theme from localStorage or system preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>