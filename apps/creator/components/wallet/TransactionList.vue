<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('recentTransactions') }}</h2>

    <div class="space-y-4">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div>
          <p class="font-medium text-gray-900 dark:text-white">{{ transaction.description }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>
        </div>

        <div
          :class="[
            'font-semibold',
            transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
          ]"
        >
          {{ transaction.type === 'credit' ? '+' : '-' }}₦{{ formatAmount(transaction.amount) }}
        </div>
      </div>

      <div v-if="transactions.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
        {{ t('noTransactions') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  date: Date
}

defineProps<{
  transactions: Transaction[]
}>();

const { t } = useI18n();

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-NG');
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};
</script> 