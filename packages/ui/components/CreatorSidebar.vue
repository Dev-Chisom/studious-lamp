<template>
  <div>
    <!-- Mobile sidebar -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-75"
        @click="$emit('close')"
      ></div>

      <!-- Sidebar panel -->
      <div class="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white shadow-lg">
        <div class="flex flex-col w-full">
          <div class="px-4 py-6 bg-primary-700 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img src="/logo-white.svg" alt="Whispers" class="h-8 w-auto" />
                <span class="text-xl font-bold text-white">Creator Studio</span>
              </div>
              <button
                type="button"
                class="text-white hover:text-gray-200"
                @click="$emit('close')"
              >
                <span class="sr-only">Close sidebar</span>
                <Icon name="lucide:x" class="h-6 w-6" />
              </button>
            </div>
          </div>
          <div class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <SidebarNavigationItem
              v-for="item in navigationItems"
              :key="item.name"
              :item="item"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div class="hidden lg:flex lg:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col h-0 flex-1">
          <div class="px-4 py-6 bg-primary-700 flex items-center">
            <div class="flex items-center space-x-2">
              <img src="/logo-white.svg" alt="Whispers" class="h-8 w-auto" />
              <span class="text-xl font-bold text-white">Creator Studio</span>
            </div>
          </div>
          <div class="flex-1 flex flex-col overflow-y-auto">
            <nav class="flex-1 px-2 py-4 space-y-1">
              <SidebarNavigationItem
                v-for="item in navigationItems"
                :key="item.name"
                :item="item"
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);

const navigationItems = [
  { name: 'Dashboard', href: '/creator/dashboard', icon: 'lucide:layout-dashboard' },
  { name: 'Content', href: '/creator/content', icon: 'lucide:image' },
  { name: 'Posts', href: '/creator/posts', icon: 'lucide:file-text' },
  { name: 'Messages', href: '/creator/messages', icon: 'lucide:message-circle' },
  { name: 'Subscribers', href: '/creator/subscribers', icon: 'lucide:users' },
  { name: 'Earnings', href: '/creator/earnings', icon: 'lucide:dollar-sign' },
  { name: 'Settings', href: '/creator/settings', icon: 'lucide:settings' },
  { 
    name: 'View Profile', 
    href: '/profile', 
    icon: 'lucide:external-link',
    divider: true
  },
];
</script>