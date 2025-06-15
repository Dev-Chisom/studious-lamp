<template>
  <div class="h-full flex flex-col">
    <!-- Search and Filter Bar -->
    <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between space-x-4">
        <!-- Search Input -->
        <div class="flex-1 relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search your media..."
            class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-1 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
            @input="$emit('search', searchQuery)"
          />
        </div>
        
        <!-- Media Type Dropdown -->
        <div class="relative">
          <select
            :value="activeMediaTab"
            class="appearance-none bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-2 pr-10 focus:ring-1 focus:ring-primary-500 cursor-pointer"
            @change="$emit('update:active-media-tab', $event.target.value)"
          >
            <option value="images">📸 Images</option>
            <option value="videos">🎥 Videos</option>
            <option value="all">📁 All Media</option>
          </select>
          <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Custom grid with SkeletonLoader image variant -->
      <div v-if="loading" class="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="n in 12" :key="n" class="relative rounded-xl overflow-hidden aspect-square">
          <SkeletonLoader 
            variant="image" 
            class="rounded-xl w-full h-full"
          />
          
          <!-- Add video play icon overlay to some items -->
          <div v-if="n % 3 === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-gray-800/50 rounded-full p-3">
              <Icon name="lucide:play" class="w-6 h-6 text-white/80" />
            </div>
          </div>
          
          <!-- Add selection indicator to some items -->
          <div v-if="n % 5 === 0" class="absolute top-3 left-3 bg-primary-500 text-white rounded-full p-1">
            <Icon name="lucide:check" class="w-4 h-4" />
          </div>
          
          <!-- Add info overlay at bottom -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <SkeletonLoader height="0.75rem" class="mb-1" />
            <SkeletonLoader height="0.5rem" width="60%" />
          </div>
        </div>
      </div>
      
      <div v-else-if="filteredMedia.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <Icon name="lucide:image-off" class="w-16 h-16 mb-4 opacity-50" />
        <h3 class="text-base font-medium mb-2">No media found</h3>
        <p class="text-sm text-center">Try adjusting your search or upload some content</p>
      </div>
      
      <div v-else class="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-4">
        <MediaGridItem
          v-for="media in filteredMedia"
          :key="media.id"
          :media="media"
          :selected="selectedIds.includes(media.id)"
          @toggle-select="$emit('toggle-select', media)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="totalItems"
          :show-range="false"
          :show-per-page="false"
          @update:current-page="$emit('update:current-page', $event)"
          @update:per-page="$emit('update:per-page', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MediaGridItem from './MediaGridItem.vue'
import Pagination from '../Pagination.vue'
import SkeletonLoader from '../SkeletonLoader.vue'

const props = defineProps<{
  loading: boolean
  mediaFiles: any[]
  selectedIds: string[]
  currentPage: number
  perPage: number
  totalPages: number
  totalItems: number
  activeMediaTab: string
}>()

defineEmits<{
  (e: 'update:active-media-tab', tab: string): void
  (e: 'update:current-page', page: number): void
  (e: 'update:per-page', perPage: number): void
  (e: 'toggle-select', media: any): void
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')

const filteredMedia = computed(() => {
  if (props.activeMediaTab === 'images') {
    return props.mediaFiles.filter(file => file.type === 'image')
  } else if (props.activeMediaTab === 'videos') {
    return props.mediaFiles.filter(file => file.type === 'video')
  }
  return props.mediaFiles
})
</script>