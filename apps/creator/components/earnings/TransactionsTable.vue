<template>
  <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg">
    <div class="p-6">
      <div class="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('earnings.transactions.title') }}</h2>

        <div class="mt-3 sm:mt-0">
          <button class="btn-outline" @click="$emit('download')">{{ t('earnings.transactions.downloadCsv') }}</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                v-for="(label, key) in headers"
                :key="key"
                class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ label }}
              </th>
            </tr>
          </thead>

          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200">
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="hover:bg-gray-50 hover:dark:bg-gray-600"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                {{ formatDate(transaction.date) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="badge"
                  :class="{
                    'badge-primary': transaction.type === 'subscription',
                    'badge-secondary': transaction.type === 'tip',
                    'badge-accent': transaction.type === 'ppv',
                  }"
                >
                  {{ t(`earnings.transactions.types.${transaction.type}`) }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="avatar h-8 w-8">
                    <img
                      :src="transaction.customer.avatar"
                      :alt="transaction.customer.name"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ transaction.customer.name }}
                    </div>

                    <div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                      {{ transaction.customer.email }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-100">${{ transaction.amount.toFixed(2) }}</div>

                <div class="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400">
                  {{ t('earnings.transactions.afterFees', { amount: (transaction.amount * 0.8).toFixed(2) }) }}
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="badge"
                  :class="{
                    'badge-success': transaction.status === 'completed',
                    'badge-warning': transaction.status === 'pending',
                    'badge-error': transaction.status === 'failed',
                  }"
                >
                  {{ t(`earnings.transactions.status.${transaction.status}`) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :per-page="perPage"
        :total-items="transactions.length"
        :per-page-options="[10, 20, 50, 100]"
        :show-end-buttons="true"
        :show-per-page="true"
        :show-range="true"
        @update:current-page="$emit('update:currentPage', $event)"
        @update:per-page="$emit('update:perPage', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Pagination from '~/components/ui/Pagination.vue';

interface Customer {
  name: string
  email: string
  avatar: string
}

interface Transaction {
  id: string
  date: string
  type: 'subscription' | 'tip' | 'ppv'
  customer: Customer
  amount: number
  status: 'completed' | 'pending' | 'failed'
}

interface Headers {
  [key: string]: string
}

const props = defineProps<{
  headers: Headers
  transactions: Transaction[]
  currentPage: number
  perPage: number
}>();

defineEmits<{
  (e: 'download'): void
  (e: 'update:currentPage', page: number): void
  (e: 'update:perPage', perPage: number): void
}>();

const { t } = useI18n();

const totalPages = computed(() => Math.ceil(props.transactions.length / props.perPage));

const paginatedTransactions = computed(() => {
  const start = (props.currentPage - 1) * props.perPage;
  const end = start + props.perPage;
  return props.transactions.slice(start, end);
});

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};
</script> 