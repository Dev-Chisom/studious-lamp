<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <CreatorSidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="sticky top-0 z-10 bg-white shadow-sm">
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
          <button 
            type="button" 
            class="lg:hidden -ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
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

      <main class="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMobileOpen = ref(false);
</script>