<template>
  <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Progress/Status -->
      <div class="flex items-center space-x-3">
        <div v-if="isUploading" class="flex items-center space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
        <div v-else-if="canProceed" class="flex items-center space-x-2 text-xs md:text-sm text-green-600 dark:text-green-400">
          <Icon name="lucide:check-circle" class="w-4 h-4" />
          <span>Ready to proceed</span>
        </div>
      </div>
      
      <!-- Action Button -->
      <button
        type="button"
        :disabled="!canProceed || isUploading"
        :class="[
          'px-8 py-3 rounded-xl font-medium transition-all duration-200 transform btn-primary text-sm md:text-base',
          canProceed && !isUploading
            ? 'hover:scale-105 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        ]"
        @click="$emit('next')"
      >
        <span v-if="isUploading" class="flex items-center space-x-2">
          <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </span>
        <span v-else class="flex items-center space-x-2">
          <span>Continue</span>
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canProceed: boolean
  isUploading: boolean
}>()

defineEmits<{
  (e: 'next'): void
}>()
</script>