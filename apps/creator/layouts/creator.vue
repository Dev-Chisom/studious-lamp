<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <CreatorSidebar :is-mobile-open="isMobileOpen" @close="isMobileOpen = false" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
        <div class="flex justify-end p-4">
      <button @click="toggleDark" class="p-2 rounded border bg-gray-200 dark:bg-gray-700">
        <span v-if="isDark">🌙 Dark</span>
        <span v-else>☀️ Light</span>
      </button>
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
import { ref, onMounted } from 'vue';

const isMobileOpen = ref(false);

const isDark = ref(false)

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  setHtmlClass()
})

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  setHtmlClass()
}

function setHtmlClass() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>