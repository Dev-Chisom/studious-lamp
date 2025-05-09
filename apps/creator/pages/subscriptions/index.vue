<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Your Subscriptions</h1>

      <!-- Active subscriptions -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Active Subscriptions</h2>
        
        <div v-if="loading" class="text-center py-12">
          <Icon name="lucide:loader" class="h-8 w-8 mx-auto animate-spin text-primary-500" />
          <p class="mt-2 text-gray-500 dark:text-gray-200">Loading subscriptions...</p>
        </div>
        
        <div v-else-if="activeSubscriptions.length === 0" class="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center">
          <Icon name="lucide:users" class="h-12 w-12 mx-auto text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">No active subscriptions</h3>
          <p class="mt-1 text-gray-500 dark:text-gray-200">
            Explore creators and subscribe to unlock exclusive content.
          </p>
          <NuxtLink to="/explore" class="btn-primary mt-4">
            Explore Creators
          </NuxtLink>
        </div>
        
        <div v-else class="grid gap-6 md:grid-cols-2">
          <div
            v-for="subscription in activeSubscriptions"
            :key="subscription.id"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center space-x-4">
                <div class="avatar h-16 w-16">
                  <img
                    :src="subscription.creator.profileImage"
                    :alt="subscription.creator.displayName"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center">
                    <h3 class="text-lg font-semibold truncate">
                      {{ subscription.creator.displayName }}
                    </h3>
                    <span v-if="subscription.creator.isVerified" class="ml-1 text-primary-500">
                      <Icon name="lucide:badge-check" class="h-4 w-4" />
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-200">@{{ subscription.creator.username }}</p>
                </div>
              </div>
              
              <div class="mt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-200">Plan</span>
                  <span class="font-medium">{{ subscription.plan === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-200">Price</span>
                  <span class="font-medium">${{ subscription.price }}/{{ subscription.plan === 'monthly' ? 'month' : 'year' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-200">Next billing date</span>
                  <span class="font-medium">{{ formatDate(subscription.endDate) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-200">Auto-renew</span>
                  <span :class="subscription.autoRenew ? 'text-success-600' : 'text-error-600'">
                    {{ subscription.autoRenew ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
              </div>
              
              <div class="mt-6 flex space-x-3">
                <NuxtLink
                  :to="`/creators/${subscription.creator.username}`"
                  class="btn-outline flex-1"
                >
                  View Profile
                </NuxtLink>
                <button
                  v-if="subscription.autoRenew"
                  class="btn-outline text-error-600 hover:bg-error-50 hover:border-error-600"
                  @click="cancelSubscription(subscription.id)"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expired subscriptions -->
      <div v-if="expiredSubscriptions.length > 0">
        <h2 class="text-lg font-semibold mb-4">Expired Subscriptions</h2>
        
        <div class="grid gap-6 md:grid-cols-2">
          <div
            v-for="subscription in expiredSubscriptions"
            :key="subscription.id"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden opacity-75"
          >
            <div class="p-6">
              <div class="flex items-center space-x-4">
                <div class="avatar h-16 w-16">
                  <img
                    :src="subscription.creator.profileImage"
                    :alt="subscription.creator.displayName"
                    class="h-full w-full object-cover grayscale"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center">
                    <h3 class="text-lg font-semibold truncate">
                      {{ subscription.creator.displayName }}
                    </h3>
                    <span v-if="subscription.creator.isVerified" class="ml-1 text-primary-500">
                      <Icon name="lucide:badge-check" class="h-4 w-4" />
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-200">@{{ subscription.creator.username }}</p>
                </div>
              </div>
              
              <div class="mt-4">
                <p class="text-sm text-gray-500 dark:text-gray-200">
                  Subscription expired on {{ formatDate(subscription.endDate) }}
                </p>
              </div>
              
              <div class="mt-6">
                <NuxtLink
                  :to="`/creators/${subscription.creator.username}`"
                  class="btn-primary w-full"
                >
                  Renew Subscription
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// import { useSubscriptionStore } from '~/stores/subscription';

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
  }
});

// const subscriptionStore = useSubscriptionStore();
const loading = ref(true);

// Dummy data for 5 subscriptions
const dummySubscriptions = [
  {
    id: '1',
    isActive: true,
    plan: 'monthly',
    price: 9.99,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    creator: {
      displayName: 'Alice Smith',
      username: 'alicesmith',
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      isVerified: true
    }
  },
  {
    id: '2',
    isActive: true,
    plan: 'yearly',
    price: 99.99,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    autoRenew: false,
    creator: {
      displayName: 'Bob Johnson',
      username: 'bobjohnson',
      profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      isVerified: false
    }
  },
  {
    id: '3',
    isActive: true,
    plan: 'monthly',
    price: 9.99,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    creator: {
      displayName: 'Carol Lee',
      username: 'carollee',
      profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
      isVerified: true
    }
  },
  {
    id: '4',
    isActive: false,
    plan: 'monthly',
    price: 9.99,
    endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    autoRenew: false,
    creator: {
      displayName: 'David Kim',
      username: 'davidkim',
      profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
      isVerified: false
    }
  },
  {
    id: '5',
    isActive: false,
    plan: 'yearly',
    price: 99.99,
    endDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    autoRenew: false,
    creator: {
      displayName: 'Eva Green',
      username: 'evagreen',
      profileImage: 'https://randomuser.me/api/portraits/women/5.jpg',
      isVerified: true
    }
  }
];

const subscriptions = ref(dummySubscriptions);

onMounted(() => {
  // await subscriptionStore.fetchUserSubscriptions('current-user');
  // loading.value = false;
  loading.value = false;
});

const activeSubscriptions = computed(() => {
  return subscriptions.value.filter(sub => sub.isActive);
});

const expiredSubscriptions = computed(() => {
  return subscriptions.value.filter(sub => !sub.isActive);
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function cancelSubscription(id) {
  // await subscriptionStore.cancelSubscription(id);
  // Show success message
}
</script>