<template>
  <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg mb-8">
    <div class="p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">{{ t('earnings.revenue.title') }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 mb-4">
            {{ t('earnings.revenue.byType') }}
          </h3>

          <div class="space-y-4">
            <div v-for="item in revenueByType" :key="item.name" class="flex items-center sm:flex-col md:flex-row">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full"
                  :class="`bg-${item.color}-500`"
                  :style="{ width: `${item.percentage}%` }"
                />
              </div>

              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ t(`earnings.revenue.types.${item.key}`) }}
                </p>
              </div>

              <p class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">${{ item.amount.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 mb-4">
            {{ t('earnings.revenue.bySubscription') }}
          </h3>

          <div class="space-y-4">
            <div
              v-for="item in revenueBySubscription"
              :key="item.name"
              class="flex items-center sm:flex-col md:flex-row"
            >
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full"
                  :class="`bg-${item.color}-500`"
                  :style="{ width: `${item.percentage}%` }"
                />
              </div>

              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ t(`earnings.revenue.subscriptionTypes.${item.key}`) }}
                </p>
              </div>

              <p class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">${{ item.amount.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface RevenueItem {
  name: string
  key: string
  amount: number
  percentage: number
  color: string
}

defineProps<{
  revenueByType: RevenueItem[]
  revenueBySubscription: RevenueItem[]
}>();

const { t } = useI18n();
</script> 