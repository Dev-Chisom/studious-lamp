<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
    <div
      v-for="stat in stats"
      :key="stat.name"
      class="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-lg"
    >
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon :name="stat.icon" :class="`h-6 w-6 text-${stat.color}-600`" aria-hidden="true" />
          </div>

          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
                {{ t(`earnings.stats.${stat.key}`) }}
              </dt>

              <dd>
                <div class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stat.value }}</div>
              </dd>
            </dl>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex items-center text-sm">
            <Icon
              :name="stat.trend >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
              :class="`flex-shrink-0 self-center h-5 w-5 ${stat.trend >= 0 ? 'text-success-500' : 'text-error-500'}`"
              aria-hidden="true"
            />
            <span
              :class="
                stat.trend >= 0 ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'
              "
            >
              {{ Math.abs(stat.trend) }}%
            </span>
            <span class="ml-2 text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('earnings.stats.fromLastMonth') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Stat {
  name: string
  key: string
  value: string | number
  icon: string
  color: string
  trend: number
}

defineProps<{
  stats: Stat[]
}>();

const { t } = useI18n();
</script> 