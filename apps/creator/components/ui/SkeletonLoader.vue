<template>
  <div :class="containerClass">
    <!-- Avatar Skeleton -->
    <template v-if="variant === 'avatar'">
      <div
        class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"
        :style="{ width: size, height: size }"
      />
    </template>

    <!-- Card Skeleton -->
    <template v-else-if="variant === 'card'">
      <div class="animate-pulse space-y-4">
        <!-- Card header -->
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <!-- Card content -->
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    </template>

    <!-- Table Skeleton -->
    <template v-else-if="variant === 'table'">
      <div class="animate-pulse">
        <!-- Table header -->
        <div class="grid gap-4 mb-4" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
          <div v-for="col in columns" :key="`header-${col}`" class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <!-- Table rows -->
        <div v-for="row in rows" :key="`row-${row}`" class="grid gap-4 mb-3" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
          <div v-for="col in columns" :key="`cell-${row}-${col}`" class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </template>

    <!-- Image Skeleton -->
    <template v-else-if="variant === 'image'">
      <div
        class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
        :style="{ width, height, aspectRatio }"
      >
        <Icon name="lucide:image" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </template>

    <!-- Post Form Skeleton -->
    <template v-else-if="variant === 'post-form'">
      <div class="animate-pulse space-y-6">
        <!-- Title field -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <!-- Content field -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <!-- Media upload area -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div class="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        </div>
        
        <!-- Settings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <!-- Submit button -->
        <div class="flex justify-end">
          <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    </template>

    <!-- Media Grid Skeleton -->
    <template v-else-if="variant === 'media-grid'">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="item in count"
          :key="`media-${item}`"
          class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square"
        />
      </div>
    </template>

    <!-- List Skeleton -->
    <template v-else-if="variant === 'list'">
      <div class="animate-pulse space-y-3">
        <div v-for="item in rows" :key="`list-${item}`" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Button Skeleton -->
    <template v-else-if="variant === 'button'">
      <div
        class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
        :style="{ width, height: height || '2.5rem' }"
      />
    </template>

    <!-- Text Lines Skeleton (default) -->
    <template v-else>
      <div class="animate-pulse space-y-2">
        <div
          v-for="(line, index) in rows"
          :key="`line-${index}`"
          :class="[
            'bg-gray-200 dark:bg-gray-700',
            circle ? 'rounded-full' : 'rounded',
          ]"
          :style="{
            width: getLineWidth(index),
            height,
            marginBottom: index === rows - 1 ? '0' : '0.5rem',
          }"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'table' | 'image' | 'post-form' | 'media-grid' | 'list' | 'button'
  rows?: number
  columns?: number
  width?: string
  height?: string
  size?: string
  circle?: boolean
  aspectRatio?: string
  count?: number
  class?: string
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  rows: 3,
  columns: 4,
  width: '100%',
  height: '1.25rem',
  size: '3rem',
  circle: false,
  aspectRatio: 'auto',
  count: 6,
  class: ''
})

const containerClass = computed(() => {
  return props.class
})

// Generate varying line widths for more realistic text skeleton
function getLineWidth(index: number): string {
  if (props.width !== '100%') return props.width
  
  const widths = ['100%', '95%', '85%', '90%', '75%', '100%', '80%']
  return widths[index % widths.length] || '100%'
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.4; 
  }
}
</style>