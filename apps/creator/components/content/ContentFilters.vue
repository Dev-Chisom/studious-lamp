<template>
  <div class="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
    <!-- Search Input -->
    <div class="flex-1 min-w-0">
      <label for="search" class="sr-only">{{ t('content.management.search.placeholder') }}</label>
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="lucide:search" class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <DebouncedInput
          :model-value="search"
          :placeholder="t('content.management.search.placeholder')"
          class="pl-10 w-full"
          @update:model-value="$emit('update:search', $event)"
        />
      </div>
    </div>

    <!-- Filter Dropdown -->
    <div class="flex-shrink-0">
      <select
        :model-value="visibilityFilter"
        class="block w-full md:w-auto rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-sm md:text-base"
        @change="$emit('update:visibilityFilter', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">{{ t('content.management.filters.all') }}</option>
        <option value="public">{{ t('content.management.filters.public') }}</option>
        <option value="subscribers">{{ t('content.management.filters.private') }}</option>
        <option value="pay-to-view">{{ t('content.management.filters.pay-to-view') }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DebouncedInput from '~/components/ui/DebouncedInput.vue';

defineProps<{
  search: string
  visibilityFilter: string
}>();

defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:visibilityFilter', value: string): void
}>();

const { t } = useI18n();
</script> 