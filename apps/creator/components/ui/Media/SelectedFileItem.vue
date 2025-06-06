<template>
  <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <!-- File Preview -->
    <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
      <img 
        v-if="file.type === 'image'" 
        :src="file.url" 
        :alt="file.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="lucide:video" class="w-6 h-6 text-gray-500" />
      </div>
    </div>
    
    <!-- File Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ file.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatFileSize(file.size) }}
      </p>
    </div>
    
    <!-- Remove Button -->
    <button
      type="button"
      class="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
      @click="$emit('remove')"
    >
      <Icon name="lucide:x" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  file: any
  index: number
}>()

defineEmits<{
  (e: 'remove'): void
}>()

function formatFileSize(bytes: number): string {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>