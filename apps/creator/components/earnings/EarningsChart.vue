<template>
  <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg mb-8">
    <div class="p-6">
      <div class="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('earnings.overview.title') }}</h2>

        <div class="mt-3 sm:mt-0">
          <select v-model="selectedPeriod" class="form-input" @change="$emit('update:period', selectedPeriod)">
            <option v-for="(label, value) in periods" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>
      </div>

      <div class="h-72 bg-gray-50 dark:bg-gray-600 rounded-lg flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-200">
          {{ t('earnings.overview.chartPlaceholder') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Period {
  [key: string]: string
}

const props = defineProps<{
  periods: Period
  period: string
}>();

const emit = defineEmits<{
  (e: 'update:period', value: string): void
}>();

const selectedPeriod = ref(props.period);
const { t } = useI18n();
</script> 