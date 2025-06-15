<template>
  <div class="px-4 py-2">
    <!-- <div class="absolute inset-0"></div> -->
    <div class="relative flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center">
          <Icon name="lucide:image" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-base md:text-lg font-bold">{{ title }}</h2>
          <p class="text-xs md:text-sm">Upload and manage your content</p>
        </div>
      </div>
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