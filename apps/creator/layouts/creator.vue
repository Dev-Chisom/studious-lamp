<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Bar (sticky) -->
    <div class="fixed left-0 top-0 bg-white dark:bg-gray-900 shadow-sm z-50 w-full" style="height: 64px">
      <!-- <div class="flex justify-end p-4"></div> -->
      <div class="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 container max-w-[1200px] mx-auto">
        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="lg:hidden -ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 dark:text-gray-200 hover:text-gray-900"
          @click="isMobileOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Icon name="lucide:menu" class="h-6 w-6" />
        </button>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <NotificationBell />
          </div>
          <UserDropdown />
        </div>
      </div>
    </div>

    <!-- Main content area with Sidebar and Content -->
    <div class="flex max-w-[1600px] mx-auto" style="column-gap: 30px">
      <!-- Sidebar (sticky below the top bar) -->
      <div class="lg:sticky lg:w-64 bg-gray-200 dark:bg-gray-700 lg:bottom-0" style="top: 64px; margin-top: 64px; bottom: 0; height: calc(100vh - 64px)">
        <CreatorSidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-y-auto" style="margin-block-start: 64px;">
        <main class="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
          <div>
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CreatorSidebar from '~/components/CreatorSidebar.vue'
import NotificationBell from '~/components/NotificationBell.vue'
import UserDropdown from '~/components/UserDropdown.vue'

const isMobileOpen = ref(false);
</script>
