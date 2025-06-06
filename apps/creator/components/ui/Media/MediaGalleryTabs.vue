<template>
  <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <div class="flex">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="[
          'flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-200',
          activeTab === tab.key
            ? 'bg-white dark:bg-gray-900 text-primary-400 border-b-2 border-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
        ]"
        @click="$emit('update:active-tab', tab.key)"
      >
        <Icon :name="tab.icon" class="w-5 h-5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string
  tabs: Array<{ key: string; label: string; icon: string }>
}>()

defineEmits<{
  (e: 'update:active-tab', tab: string): void
}>()
</script>