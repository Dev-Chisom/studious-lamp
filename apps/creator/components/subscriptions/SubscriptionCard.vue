<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center space-x-4">
        <div class="avatar h-16 w-16">
          <img
            :src="subscription.creator.profileImage"
            :alt="subscription.creator.displayName"
            :class="[
              'h-full w-full object-cover',
              !subscription.isActive && 'grayscale'
            ]"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <h3 class="text-lg font-semibold truncate">{{ subscription.creator.displayName }}</h3>
            <span v-if="subscription.creator.isVerified" class="ml-1 text-primary-500">
              <Icon name="lucide:badge-check" class="h-4 w-4" />
            </span>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-200">@{{ subscription.creator.username }}</p>
        </div>
      </div>

      <div class="mt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-200">{{ t('subscriptions.plan') }}</span>
          <span class="font-medium">{{
            subscription.plan === 'monthly' ? t('common.monthly') : t('common.yearly')
          }}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-200">{{ t('subscriptions.price') }}</span>
          <span class="font-medium">${{ subscription.price }}/{{
            subscription.plan === 'monthly' ? t('common.month') : t('common.year')
          }}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-200">{{ t('subscriptions.nextBillingDate') }}</span>
          <span class="font-medium">{{ formatDate(subscription.endDate) }}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-200">{{ t('subscriptions.autoRenew') }}</span>
          <span :class="subscription.autoRenew ? 'text-success-600' : 'text-error-600'">
            {{ subscription.autoRenew ? t('subscriptions.enabled') : t('subscriptions.disabled') }}
          </span>
        </div>
      </div>

      <div class="mt-6 flex space-x-3">
        <NuxtLink :to="`/creators/${subscription.creator.username}`" class="btn-outline flex-1">
          {{ t('subscriptions.viewProfile') }}
        </NuxtLink>
        <button
          v-if="subscription.autoRenew"
          class="btn-outline text-error-600 hover:bg-error-50 hover:border-error-600"
          @click="$emit('cancel', subscription.id)"
        >
          {{ t('subscriptions.cancel') }}
        </button>
        <button
          v-else
          class="btn-primary flex-1"
          @click="$emit('renew', subscription.id)"
        >
          {{ t('subscriptions.renewSubscription') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Creator {
  displayName: string
  username: string
  profileImage: string
  isVerified: boolean
}

interface Subscription {
  id: string
  isActive: boolean
  plan: 'monthly' | 'yearly'
  price: number
  endDate: Date
  autoRenew: boolean
  creator: Creator
}

defineProps<{
  subscription: Subscription
}>();

defineEmits<{
  (e: 'cancel', id: string): void
  (e: 'renew', id: string): void
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