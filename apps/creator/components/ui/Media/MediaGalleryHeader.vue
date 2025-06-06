<template>
  <div class="px-6 py-3">
    <!-- <div class="absolute inset-0"></div> -->
    <div class="relative flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center">
          <Icon name="lucide:image" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ title }}</h2>
          <p class="text-sm">Upload and manage your content</p>
        </div>
      </div>
      
      <!-- <button
        type="button"
        class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        @click="$emit('close')"
      >
        <Icon name="lucide:x" class="w-5 h-5 text-white" />
      </button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>