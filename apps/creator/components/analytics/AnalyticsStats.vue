<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="(stat, index) in stats" :key="index" class="card">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center">
          <div :class="`bg-${stat.color}-100 rounded-md p-3`">
            <Icon :name="stat.icon" :class="`h-6 w-6 text-${stat.color}-600`" />
          </div>

          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
                {{ t(stat.name) }}
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
              :name="stat.trend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
              :class="`flex-shrink-0 mr-1.5 h-5 w-5 ${stat.trend > 0 ? 'text-success-500' : 'text-error-500'}`"
            />

            <div
              :class="
                stat.trend > 0 ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'
              "
            >
              {{ Math.abs(stat.trend) }}%
            </div>

            <div class="ml-1 text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('analytics.from_last_month') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface StatCard {
  name: string
  value: string
  icon: string
  color: string
  trend: number
}

defineProps<{
  stats: StatCard[]
}>();

const { t } = useI18n();
</script> 