<template>
  <div class="card">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{{ t('recentSubscriptions') }}</h3>
    </div>

    <ul class="divide-y divide-gray-200">
      <li v-for="subscription in subscriptions" :key="subscription.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center space-x-4">
          <div class="avatar h-10 w-10">
            <img :src="subscription.userAvatar" :alt="subscription.userName" class="h-full w-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ subscription.userName }}
            </p>

            <p class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
              {{ subscription.plan }} plan · ${{ subscription.amount }}
            </p>
          </div>

          <div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
            {{ formatDate(subscription.date) }}
          </div>
        </div>
      </li>

      <li v-if="subscriptions.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-200 dark:text-gray-400">
        {{ t('analytics.no_recent_subscriptions') }}
      </li>
    </ul>

    <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
      <NuxtLink to="/creator/subscribers" class="text-sm font-medium text-primary-600 hover:text-primary-500">
        {{ t('analytics.view_all_subscribers') }} <span aria-hidden="true"> &rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Subscription {
  id: string
  userName: string
  userAvatar: string
  plan: string
  amount: string
  date: Date
}

defineProps<{
  subscriptions: Subscription[]
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