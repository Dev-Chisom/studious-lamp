<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>{{ t('subscribers.title') }} - Creator Dashboard</Title> </Head>

		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('subscribers.title') }}</h1>

			<p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
				{{ t('subscribers.manage') }}
			</p>
		</div>

		<!-- Stats cards -->

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
			<div
				v-for="stat in stats"
				:key="stat.name"
				class="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-lg"
			>
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<Icon :name="stat.icon" :class="`h-6 w-6 text-${stat.color}-600`" aria-hidden="true" />
						</div>

						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400 truncate">
									{{ t(`subscribers.stats.${stat.key}`) }}
								</dt>

								<dd>
									<div class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ stat.value }}</div>
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
							<span
								:class="
									stat.trend >= 0 ? 'text-success-700 dark:text-success-400' : 'text-error-700 dark:text-error-400'
								"
							>
								{{ Math.abs(stat.trend) }}%
							</span>
							<span class="ml-2 text-gray-500 dark:text-gray-200 dark:text-gray-400">{{ t('subscribers.stats.fromLastMonth') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Subscribers list -->

		<div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg">
			<div class="px-4 py-5 sm:p-6">
				<!-- Filters -->

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<FormInput v-model="filters.search" :placeholder="t('subscribers.filters.search')" icon="lucide:search" />

					<select v-model="filters.plan" class="form-input">
						<option value="">{{ t('subscribers.filters.allPlans') }}</option>

						<option value="monthly">{{ t('subscribers.filters.monthly') }}</option>

						<option value="yearly">{{ t('subscribers.filters.yearly') }}</option>
					</select>

					<select v-model="filters.status" class="form-input">
						<option value="">{{ t('subscribers.filters.allStatus') }}</option>

						<option value="active">{{ t('subscribers.filters.active') }}</option>

						<option value="expired">{{ t('subscribers.filters.expired') }}</option>

						<option value="cancelled">{{ t('subscribers.filters.cancelled') }}</option>
					</select>
				</div>

				<!-- Table -->

				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200 dark:bg-gray-600">
						<thead class="bg-gray-50 dark:bg-gray-900">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.subscriber') }}
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.plan') }}
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.status') }}
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.revenue') }}
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.joined') }}
								</th>

								<th
									class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									{{ t('subscribers.table.actions') }}
								</th>
							</tr>
						</thead>

						<tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200">
							<tr
								v-for="subscriber in filteredSubscribers"
								:key="subscriber.id"
								class="hover:bg-gray-50 dark:hover:bg-gray-700"
							>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="avatar h-10 w-10">
											<img :src="subscriber.avatar" :alt="subscriber.name" class="h-full w-full object-cover" />
										</div>

										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ subscriber.name }}</div>

											<div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
												{{ subscriber.email }}
											</div>
										</div>
									</div>
								</td>

								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900 dark:text-gray-100">
										{{ t(`subscribers.filters.${subscriber.plan}`) }}
									</div>

									<div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
										${{ subscriber.plan === 'monthly' ? '9.99' : '99.99' }}
									</div>
								</td>

								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="badge"
										:class="{
											'badge-success': subscriber.status === 'active',
											'badge-warning': subscriber.status === 'cancelled',
											'badge-error': subscriber.status === 'expired',
										}"
									>
										{{ t(`subscribers.filters.${subscriber.status}`) }}
									</span>
								</td>

								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900 dark:text-gray-100">${{ subscriber.totalRevenue.toFixed(2) }}</div>

									<div class="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400">
										{{ t('subscribers.table.lifetimeValue') }}
									</div>
								</td>

								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
									{{ formatDate(subscriber.joinedAt) }}
								</td>

								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div class="flex justify-end space-x-2">
										<button 
											class="text-gray-400 hover:text-primary-600" 
											@click="messageSubscriber(subscriber)"
											:title="t('subscribers.actions.message')"
										>
											<Icon name="lucide:message-circle" class="h-5 w-5" />
										</button>
										<button
											v-if="subscriber.status === 'active'"
											class="text-gray-400 hover:text-error-600"
											@click="confirmBlock(subscriber)"
											:title="t('subscribers.actions.block')"
										>
											<Icon name="lucide:ban" class="h-5 w-5" />
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Pagination -->

				<div class="mt-6 flex items-center justify-between">
					<div class="flex-1 flex justify-between sm:hidden">
						<button class="btn-outline" :disabled="currentPage === 1" @click="currentPage--">
							{{ t('subscribers.pagination.previous') }}
						</button>
						<button class="btn-outline" :disabled="currentPage === totalPages" @click="currentPage++">
							{{ t('subscribers.pagination.next') }}
						</button>
					</div>

					<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p class="text-sm text-gray-700">
								{{ t('subscribers.pagination.showing') }} <span class="font-medium">{{ startIndex + 1 }}</span>
								{{ t('subscribers.pagination.to') }}
								<span class="font-medium">{{ endIndex }}</span>
								{{ t('subscribers.pagination.of') }}
								<span class="font-medium">{{ totalSubscribers }}</span>
								{{ t('subscribers.pagination.results') }}
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
									:class="
										page === currentPage
											? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
											: 'text-gray-500 dark:text-gray-200 hover:bg-gray-50'
									"
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

		<!-- Block confirmation modal -->

		<div v-if="showBlockModal" class="fixed inset-0 overflow-y-auto z-[300]">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 transition-opacity">
					<div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80" />
				</div>

				<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

				<div
					class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
				>
					<div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 dark:bg-error-900 sm:mx-0 sm:h-10 sm:w-10"
							>
								<Icon name="lucide:alert-triangle" class="h-6 w-6 text-error-600" />
							</div>

							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Block Subscriber</h3>

								<div class="mt-2">
									<p class="text-sm text-gray-500 dark:text-gray-300">
										{{ t('subscribers.blockConfirmation') }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
							@click="blockSubscriber"
						>
							{{ t('subscribers.block') }}
						</button>
						<button
							type="button"
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							@click="showBlockModal = false"
						>
							{{ t('subscribers.cancel') }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import { useI18n } from 'vue-i18n'

interface Subscriber {
	id: string
	name: string
	email: string
	avatar: string
	plan: 'monthly' | 'yearly'
	status: 'active' | 'expired' | 'cancelled'
	totalRevenue: number
	joinedAt: string
}

interface Stats {
	name: string
	key: string
	value: number
	trend: number
	icon: string
	color: string
}

interface Filters {
	search: string
	plan: string
	status: string
}

definePageMeta({
	layout: 'creator',
	middleware: ['auth', 'creator']
})

const { t } = useI18n()

const stats = ref<Stats[]>([
	{
		name: 'Total Subscribers',
		key: 'totalSubscribers',
		value: 1234,
		trend: 12,
		icon: 'lucide:users',
		color: 'primary'
	},
	{
		name: 'Active Subscribers',
		key: 'activeSubscribers',
		value: 890,
		trend: 8,
		icon: 'lucide:user-check',
		color: 'success'
	},
	{
		name: 'Monthly Revenue',
		key: 'monthlyRevenue',
		value: 8900,
		trend: 15,
		icon: 'lucide:dollar-sign',
		color: 'warning'
	},
	{
		name: 'Churn Rate',
		key: 'churnRate',
		value: 2.4,
		trend: -0.5,
		icon: 'lucide:trending-down',
		color: 'error'
	}
])

const filters = ref<Filters>({
	search: '',
	plan: '',
	status: ''
})

const currentPage = ref(1)
const itemsPerPage = 10
const showBlockModal = ref<boolean>(false)
const subscriberToBlock = ref<Subscriber | null>(null)

const subscribers = ref<Subscriber[]>([
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		avatar: 'https://i.pravatar.cc/150?u=john@example.com',
		plan: 'monthly',
		status: 'active',
		totalRevenue: 99.99,
		joinedAt: '2024-01-01'
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		avatar: 'https://i.pravatar.cc/150?u=jane@example.com',
		plan: 'yearly',
		status: 'active',
		totalRevenue: 999.99,
		joinedAt: '2024-02-01'
	}
])

const filteredSubscribers = computed(() => {
	return subscribers.value.filter((s: Subscriber) => {
		const matchesSearch = s.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
			s.email.toLowerCase().includes(filters.value.search.toLowerCase())
		const matchesPlan = !filters.value.plan || s.plan === filters.value.plan
		const matchesStatus = !filters.value.status || s.status === filters.value.status
		return matchesSearch && matchesPlan && matchesStatus
	})
})

const totalSubscribers = computed(() => filteredSubscribers.value.length)
const totalPages = computed(() => Math.ceil(totalSubscribers.value / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalSubscribers.value))

const displayedPages = computed(() => {
	const pages = []
	const maxPages = 5
	const halfMax = Math.floor(maxPages / 2)

	let start = Math.max(1, currentPage.value - halfMax)
	let end = Math.min(totalPages.value, start + maxPages - 1)

	if (end - start + 1 < maxPages) {
		start = Math.max(1, end - maxPages + 1)
		}

		for (let i = start; i <= end; i++) {
		pages.push(i)
	}

	return pages
})

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString()
}

const messageSubscriber = (subscriber: Subscriber) => {
	// Implement messaging functionality
}

const confirmBlock = (subscriber: Subscriber) => {
	subscriberToBlock.value = subscriber
	showBlockModal.value = true
}

const blockSubscriber = () => {
	if (!subscriberToBlock.value) {
		return
	}

	try {
		// In a real app, make API call to block subscriber
		const index = subscribers.value.findIndex((s) => s.id === subscriberToBlock.value?.id)
		if (index !== -1) {
			subscribers.value[index].status = 'cancelled'
		}

		showBlockModal.value = false
		subscriberToBlock.value = null
		// Implement toast notification
	} catch {
		// Implement toast notification
	}
}
</script>
