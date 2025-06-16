<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-6 mb-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('walletBalance') }}</h1>
      <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">₦{{ formatAmount(balance) }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseButton class="w-full" variant="primary" @click="$emit('fund-wallet')">{{ t('fundWallet') }}</BaseButton>
      <BaseButton class="w-full" variant="secondary" @click="$emit('view-transactions')">
        {{ t('transactionHistory') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  balance: number
}>();

defineEmits<{
  (e: 'fund-wallet'): void
  (e: 'view-transactions'): void
}>();

const { t } = useI18n();

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-NG');
};
</script> 