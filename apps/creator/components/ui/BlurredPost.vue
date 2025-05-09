<template>
    <div class="relative">
      <div class="absolute inset-0 backdrop-blur-lg bg-gray-100/30 dark:bg-gray-800/30 rounded-xl flex items-center justify-center z-10">
        <div class="text-center p-6">
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Premium Content</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Subscribe to unlock this content</p>
          <Button @click="emit('subscribe')" variant="primary">
            Subscribe Now
          </Button>
        </div>
      </div>
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  import Button from './Button.vue'
  const emit = defineEmits(['subscribe'])
  </script>