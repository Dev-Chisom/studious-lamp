<template>
  <div class="card">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{{ t('upcomingPayout') }}</h3>
      <NuxtLink to="/creator/earnings" class="text-sm text-primary-600 hover:text-primary-500 font-medium">
        {{ t('analytics.view_earnings_details') }}
      </NuxtLink>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">${{ payout.amount.toFixed(2) }}</p>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
            {{ t('analytics.next_payout_on') }} {{ formatDate(payout.date) }}
          </p>
        </div>
        <button class="mt-4 md:mt-0 btn-primary" @click="$emit('request-early-payout')">
          {{ t('analytics.request_early_payout') }}
        </button>
      </div>

      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
          {{ t('analytics.payout_breakdown') }}
        </h4>

        <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('analytics.subscription_revenue') }}
            </dt>

            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
              ${{ payout.subscriptionRevenue.toFixed(2) }}
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('analytics.tips') }}
            </dt>

            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">${{ payout.tips.toFixed(2) }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('analytics.pay_per_view') }}
            </dt>

            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">${{ payout.ppv.toFixed(2) }}</dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ t('analytics.platform_fee') }}
            </dt>

            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">-${{ payout.platformFee.toFixed(2) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Payout {
  amount: number
  date: Date
  subscriptionRevenue: number
  tips: number
  ppv: number
  platformFee: number
}

defineProps<{
  payout: Payout
}>();

defineEmits<{
  (e: 'request-early-payout'): void
}>();

const { t } = useI18n();

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script> 