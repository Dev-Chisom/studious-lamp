<template>
  <div class="max-w-6xl mx-auto">

    <Head>
      <Title>Creator Analytics - Whispers</Title>
    </Head>

    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('analytics.title') }}</h1>

      <p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
        {{ t('analytics.overview') }}
      </p>
    </div>

    <!-- Stats cards -->

    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
              <Icon :name="stat.trend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                :class="`flex-shrink-0 mr-1.5 h-5 w-5 ${stat.trend > 0 ? 'text-success-500' : 'text-error-500'}`" />

              <div :class="stat.trend > 0 ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'
                ">
                {{ Math.abs(stat.trend) }}%
              </div>

              <div class="ml-1 text-gray-500 dark:text-gray-200 dark:text-gray-400">{{ t('analytics.from_last_month') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent subscriptions -->

      <div class="card">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{{ t('recentSubscriptions') }}</h3>
        </div>

        <ul class="divide-y divide-gray-200">
          <li v-for="subscription in sucbscriptions" :key="subscription.id" class="px-4 py-4 sm:px-6">
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

          <li v-if="sucbscriptions.length === 0"
            class="px-4 py-6 text-center text-gray-500 dark:text-gray-200 dark:text-gray-400">
            {{ t('analytics.no_recent_subscriptions') }}
          </li>
        </ul>

        <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
          <NuxtLink to="/creator/subscribers" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            {{ t('analytics.view_all_subscribers') }} <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent content performance -->

      <div class="card">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{{ t('contentPerformance') }}</h3>
        </div>

        <ul class="divide-y divide-gray-200">
          <li v-for="post in recentPosts" :key="post.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                <img v-if="post.thumbnail" :src="post.thumbnail" :alt="post.title" class="w-full h-full object-cover" />

                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <Icon name="lucide:file" class="h-6 w-6" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ post.title }}</p>

                <div class="flex items-center text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400 space-x-2">
                  <span class="flex items-center">
                    <Icon name="lucide:heart" class="h-3 w-3 mr-1" /> {{ post.likes }}
                  </span>
                  <span class="flex items-center">
                    <Icon name="lucide:message-square" class="h-3 w-3 mr-1" /> {{ post.comments }}
                  </span>
                  <span class="flex items-center">
                    <Icon name="lucide:eye" class="h-3 w-3 mr-1" /> {{ post.views }}
                  </span>
                </div>
              </div>

              <div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                {{ formatDate(post.date) }}
              </div>
            </div>
          </li>

          <li v-if="recentPosts.length === 0"
            class="px-4 py-6 text-center text-gray-500 dark:text-gray-200 dark:text-gray-400">
            {{ t('analytics.no_content_yet') }}
          </li>
        </ul>

        <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
          <NuxtLink to="/creator/content" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            {{ t('analytics.view_all_content') }} <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Upcoming payouts -->

    <div class="mt-8">
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
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">${{ nextPayout.amount.toFixed(2) }}</p>

              <p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                {{ t('analytics.next_payout_on') }} {{ formatDate(nextPayout.date) }}
              </p>
            </div>
            <button class="mt-4 md:mt-0 btn-primary">{{ t('analytics.request_early_payout') }}</button>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">{{
              t('analytics.payout_breakdown') }}</h4>

            <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">
                  {{ t('analytics.subscription_revenue') }}
                </dt>

                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  ${{ nextPayout.subscriptionRevenue.toFixed(2) }}
                </dd>
              </div>

              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">{{
                  t('analytics.tips') }}</dt>

                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">${{ nextPayout.tips.toFixed(2) }}</dd>
              </div>

              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">{{
                  t('analytics.pay_per_view') }}</dt>

                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">${{ nextPayout.ppv.toFixed(2) }}</dd>
              </div>

              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">{{
                  t('analytics.platform_fee') }}</dt>

                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">-${{ nextPayout.platformFee.toFixed(2) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresCreator: true,
  },
});

interface StatCard {
  name: string
  value: string
  icon: string
  color: string
  trend: number
}

interface Subscription {
  id: string
  userName: string
  userAvatar: string
  plan: string
  amount: string
  date: Date
}

interface ContentPost {
  id: string
  title: string
  thumbnail: string
  likes: number
  comments: number
  views: number
  date: Date
}

interface Payout {
  amount: number
  date: Date
  subscriptionRevenue: number
  tips: number
  ppv: number
  platformFee: number
}

const { t } = useI18n();

const stats = ref<StatCard[]>([
  {
    name: 'analytics.subscribers',
		value: '278',
    icon: 'lucide:users',
    color: 'primary',
    trend: 12,
  },
  {
    name: 'analytics.revenue',
		value: '$1,458.90',
    icon: 'lucide:dollar-sign',
    color: 'success',
    trend: 8,
  },
  {
    name: 'analytics.content-view',
		value: '4,239',
    icon: 'lucide:eye',
    color: 'secondary',
    trend: 24,
  },
  {
    name: 'analytics.total-posts',
		value: '32',
    icon: 'lucide:file-text',
    color: 'accent',
    trend: -3,
  },
]);

const sucbscriptions = ref<Subscription[]>([
  {
    id: '1',
    userName: 'Alex Johnson',
    userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
    plan: 'Monthly',
    amount: '9.99',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    plan: 'Yearly',
    amount: '99.99',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
]);

const recentPosts = ref<ContentPost[]>([
  {
    id: '1',
    title: 'Getting Started with Content Creation',
    thumbnail: 'https://images.pexels.com/photos/3000001/pexels-photo-3000001.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 245,
    comments: 32,
    views: 1234,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Tips for Better Engagement',
    thumbnail: 'https://images.pexels.com/photos/3000002/pexels-photo-3000002.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 189,
    comments: 24,
    views: 987,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]);

const nextPayout = ref<Payout>({
  amount: 1245.67,
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  subscriptionRevenue: 987.45,
  tips: 156.78,
  ppv: 101.44,
  platformFee: 200.0,
});

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>
