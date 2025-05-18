<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Bar (sticky) -->
    <div class="fixed left-0 top-0 bg-white dark:bg-gray-900 shadow-sm z-50 w-full" style="height: 64px">
      <div class="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 container max-w-[1200px] mx-auto">
        <!-- Mobile Menu Button -->
        <button type="button"
          class="lg:hidden -ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 dark:text-gray-200 hover:text-gray-900"
          @click="isMobileOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Icon name="lucide:menu" class="h-6 w-6" />
        </button>

        <div class="flex items-center lg:ml-auto space-x-4">
          <div class="relative">
            <notification-bell />
          </div>
          <user-dropdown />
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div v-if="isMobileOpen" class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="isMobileOpen = false"></div>

      <!-- Sidebar panel -->
      <div class="fixed inset-y-0 left-0 flex w-full max-w-xs">
        <creator-sidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />
      </div>
    </div>

    <!-- Main content area with Sidebar and Content -->
    <div class="flex justify-center w-full">
      <div class="flex max-w-[1400px] w-full mx-auto">
        <!-- Desktop Sidebar (fixed) -->
        <div class="hidden lg:block lg:w-64 bg-gray-200 dark:bg-gray-700 fixed"
          style="top: 64px; height: calc(100vh - 64px)">
          <creator-sidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />
        </div>

        <!-- Spacer for fixed sidebar -->
        <div class="hidden lg:block lg:w-64 flex-shrink-0" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col" style="margin-block-start: 64px; min-height: calc(100vh - 64px)">
          <main class="flex-1 bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
            <div class="max-w-[1000px] mx-auto">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CreatorSidebar from '~/components/CreatorSidebar.vue';
import NotificationBell from '~/components/NotificationBell.vue';
import UserDropdown from '~/components/UserDropdown.vue';
import { useAuthStore } from '../store/auth';

const isMobileOpen = ref(false);
const authStore = useAuthStore();
authStore.hydrate();
</script>