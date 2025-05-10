<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <CreatorSidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="sticky top-0 bg-white dark:bg-gray-900 shadow-sm" style="z-index: 200">
        <div class="flex justify-end p-4">
      <!-- <button @click="toggleDark" class="p-2 rounded border bg-gray-200 dark:bg-gray-700">
        <span v-if="isDark">🌙 Dark</span>
        <span v-else>☀️ Light</span>
      </button> -->
    </div>
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
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

      <main class="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
        <slot />
      </main>
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