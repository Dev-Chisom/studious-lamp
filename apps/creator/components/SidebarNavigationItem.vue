<template>
  	 	 	
  <div class="mb-2">
    		 		 		
    <hr v-if="item.divider" class="my-4 border-gray-200 dark:border-gray-700" />
    		<NuxtLink
      :to="item.href"
      :class="[
        isActive
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
          : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-primary-200 dark:hover:bg-gray-800',
        'group flex items-center px-2.5 py-2 text-sm font-500 rounded-lg transition-all duration-150',
      ]"
    >
      			<Icon
        :name="item.icon"
        :class="[
          isActive
            ? 'text-primary-600 dark:text-primary-300'
            : 'text-gray-500 dark:text-gray-200 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-300',
          'mr-4 flex-shrink-0 h-6 w-6',
        ]"
      />
      			{{ item.name }} 		</NuxtLink
    >
    	 	 	
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  href: string
  icon: string
  divider?: boolean
}

interface SidebarNavigationItemProps {
  item: NavigationItem
}

const props = defineProps<SidebarNavigationItemProps>()

const route = useRoute()

const isActive = computed((): boolean => {
  if (props.item.href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(props.item.href)
})
</script>
