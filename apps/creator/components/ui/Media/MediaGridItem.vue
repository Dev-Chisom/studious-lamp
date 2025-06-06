<template>
  <div
    :class="[
      'relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-105',
      selected
        ? 'ring-4 ring-primary-500 shadow-lg shadow-primary-500/25'
        : 'hover:shadow-xl hover:shadow-black/10'
    ]"
    @click="$emit('toggle-select')"
  >
    <!-- Media Content -->
    <div class="w-full h-full bg-gray-100 dark:bg-gray-800">
      <img 
        v-if="media.type === 'image'" 
        :src="media.thumbnailUrl || media.url" 
        :alt="media.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else-if="media.type === 'video'" class="relative w-full h-full">
        <video 
          :src="media.url" 
          class="w-full h-full object-cover"
          muted
          preload="metadata"
        />
        <!-- Video Overlay -->
        <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div class="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
            <Icon name="lucide:play" class="w-6 h-6 text-gray-800" />
          </div>
        </div>
        <!-- Duration Badge -->
        <div v-if="media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {{ formatDuration(media.duration) }}
        </div>
      </div>
    </div>

    <!-- Selection Indicator -->
    <div 
      v-if="selected" 
      class="absolute top-3 left-3 bg-primary-500 text-white rounded-full p-2 shadow-lg"
    >
      <Icon name="lucide:check" class="w-4 h-4" />
    </div>

    <!-- Hover Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="absolute bottom-3 left-3 right-3">
        <p class="text-white text-sm font-medium truncate">{{ media.name }}</p>
        <p v-if="media.size" class="text-white/80 text-xs">{{ formatFileSize(media.size) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  media: any
  selected: boolean
}>()

defineEmits<{
  (e: 'toggle-select'): void
}>()

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: number): string {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>