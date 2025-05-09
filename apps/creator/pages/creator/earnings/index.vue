<template>
  <div>
    <Head>
      <Title>Earnings - Creator Dashboard</Title>
    </Head>

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Earnings</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
        Track your earnings and manage payouts.
      </p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div v-for="stat in stats" :key="stat.name" class="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon 
                :name="stat.icon" 
                :class="`h-6 w-6 text-${stat.color}-600`"
                aria-hidden="true"
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
                  {{ stat.name }}
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ stat.value }}
                  </div>
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
              <span :class="stat.trend >= 0 ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'">
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="ml-2 text-gray-500 dark:text-gray-200 dark:text-gray-400">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Earnings chart -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg mb-8">
      <div class="p-6">
        <div class="sm:flex sm:items-center sm:justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">Earnings Overview</h2>
          <div class="mt-3 sm:mt-0">
            <select
              v-model="chartPeriod"
              class="form-input"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
        
        <div class="h-72 bg-gray-50 dark:bg-gray-600 rounded-lg flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-200">Chart placeholder - In a real app, implement chart using a library like Chart.js</p>
        </div>
      </div>
    </div>

    <!-- Revenue breakdown -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg mb-8">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Revenue Breakdown</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 mb-4">By Revenue Type</h3>
            <div class="space-y-4">
              <div v-for="item in revenueByType" :key="item.name" class="flex items-center sm:flex-col md:flex-row">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full"
                    :class="`bg-${item.color}-500`"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ item.name }}
                  </p>
                </div>
                  <p class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${{ item.amount.toFixed(2) }}
                  </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 mb-4">By Subscription Type</h3>
            <div class="space-y-4">
              <div v-for="item in revenueBySubscription" :key="item.name" class="flex items-center sm:flex-col md:flex-row">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full"
                    :class="`bg-${item.color}-500`"
                    :style="{ width: `${item.percentage}%` }"
                  ></div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ item.name }}
                  </p>
                </div>
                <p class="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  ${{ item.amount.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg">
      <div class="p-6">
        <div class="sm:flex sm:items-center sm:justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <div class="mt-3 sm:mt-0">
            <button class="btn-outline">
              Download CSV
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50 hover:dark:bg-gray-600">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="badge"
                    :class="{
                      'badge-primary': transaction.type === 'subscription',
                      'badge-secondary': transaction.type === 'tip',
                      'badge-accent': transaction.type === 'ppv'
                    }"
                  >
                    {{ transaction.type }}
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
                  <div class="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400">After fees: ${{ (transaction.amount * 0.8).toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="badge"
                    :class="{
                      'badge-success': transaction.status === 'completed',
                      'badge-warning': transaction.status === 'pending',
                      'badge-error': transaction.status === 'failed'
                    }"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              class="btn-outline"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              class="btn-outline"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ endIndex }}</span>
                of
                <span class="font-medium">{{ totalTransactions }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  <Icon name="lucide:chevron-left" class="h-5 w-5" />
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-900 text-sm font-medium"
                  :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 dark:text-gray-200 hover:bg-gray-50'"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  <Icon name="lucide:chevron-right" class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresCreator: true
  }
});

// Stats data
const stats = [
  {
    name: 'Total Earnings',
    value: '$12,847',
    icon: 'lucide:dollar-sign',
    color: 'primary',
    trend: 12
  },
  {
    name: 'Subscription Revenue',
    value: '$9,458',
    icon: 'lucide:users',
    color: 'success',
    trend: 8
  },
  {
    name: 'Tips Received',
    value: '$2,389',
    icon: 'lucide:heart',
    color: 'secondary',
    trend: 24
  },
  {
    name: 'PPV Revenue',
    value: '$1,000',
    icon: 'lucide:lock',
    color: 'accent',
    trend: 15
  }
];

// Chart period
const chartPeriod = ref('30d');

// Revenue breakdown data
const revenueByType = [
  {
    name: 'Subscriptions',
    amount: 9458,
    percentage: 73,
    color: 'primary'
  },
  {
    name: 'Tips',
    amount: 2389,
    percentage: 19,
    color: 'secondary'
  },
  {
    name: 'Pay-per-view',
    amount: 1000,
    percentage: 8,
    color: 'accent'
  }
];

const revenueBySubscription = [
  {
    name: 'Monthly',
    amount: 5675,
    percentage: 60,
    color: 'primary'
  },
  {
    name: 'Yearly',
    amount: 3783,
    percentage: 40,
    color: 'secondary'
  }
];

// Mock transactions data
const transactions = ref([
  {
    id: '1',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'subscription',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    amount: 9.99,
    status: 'completed'
  },
  {
    id: '2',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: 'tip',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    amount: 20.00,
    status: 'completed'
  },
  {
    id: '3',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: 'ppv',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    amount: 4.99,
    status: 'completed'
  }
]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const totalTransactions = computed(() => transactions.value.length);
const totalPages = computed(() => Math.ceil(totalTransactions.value / itemsPerPage));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalTransactions.value));

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// Methods
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}
</script>