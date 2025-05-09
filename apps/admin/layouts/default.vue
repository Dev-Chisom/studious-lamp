```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div class="flex items-center h-16 px-6 border-b border-gray-200">
        <!-- <img src="/logo.svg" alt="Whispers" class="h-8 w-auto" /> -->
         <p>logo</p>
        <span class="ml-2 text-xl font-bold text-primary-600">Admin</span>
      </div>
      
      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            $route.path === item.href
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          ]"
        >
          <Icon
            :name="item.icon"
            :class="[
              $route.path === item.href ? 'text-primary-700' : 'text-gray-400 group-hover:text-primary-700',
              'mr-3 flex-shrink-0 h-5 w-5'
            ]"
          />
          {{ item.name }}
        </NuxtLink>
      </nav>
    </div>

    <!-- Main content -->
    <div class="pl-64">
      <!-- Top header -->
      <header class="h-16 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-full px-6">
          <h1 class="text-xl font-semibold text-gray-900">
            {{ currentPageTitle }}
          </h1>
          
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700">
              <Icon name="lucide:bell" class="h-5 w-5" />
            </button>
            <button class="text-gray-500 hover:text-gray-700">
              <Icon name="lucide:settings" class="h-5 w-5" />
            </button>
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 text-gray-700"
              >
                <div class="avatar h-8 w-8">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
                    alt="Admin"
                    class="h-full w-full object-cover rounded-full"
                  />
                </div>
                <span class="text-sm font-medium">Admin User</span>
                <Icon name="lucide:chevron-down" class="h-4 w-4" />
              </button>

              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userMenuOpen = ref(false);

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'lucide:layout-dashboard' },
  { name: 'Users', href: '/users', icon: 'lucide:users' },
  { name: 'Content', href: '/content', icon: 'lucide:image' },
  { name: 'Reports', href: '/reports', icon: 'lucide:flag' },
  { name: 'Payouts', href: '/payouts', icon: 'lucide:credit-card' },
  { name: 'Analytics', href: '/analytics', icon: 'lucide:bar-chart-2' },
  { name: 'Settings', href: '/settings', icon: 'lucide:settings' },
];

const currentPageTitle = computed(() => {
  const currentRoute = navigation.find(item => item.href === route.path);
  return currentRoute?.name || 'Dashboard';
});
</script>
```