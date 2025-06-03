<!-- PaginationButton.vue -->
<script setup lang="ts">
defineProps({
  label: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    validator: (value: string) => ['first', 'prev', 'next', 'last'].includes(value),
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <button
    type="button"
    class="px-3 py-1 rounded-md transition-colors"
    :class="{
      'bg-primary-500 text-white': active,
      'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700': !active && !disabled,
      'cursor-not-allowed opacity-50': disabled
    }"
    :disabled="disabled"
    @click="emit('click')"
  >
    <span v-if="icon === 'first'">«</span>
    <span v-else-if="icon === 'prev'">‹</span>
    <span v-else-if="icon === 'next'">›</span>
    <span v-else-if="icon === 'last'">»</span>
    <span v-else>{{ label }}</span>
  </button>
</template>