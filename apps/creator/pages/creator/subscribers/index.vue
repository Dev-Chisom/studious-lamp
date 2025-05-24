<template>
	<div class="max-w-6xl mx-auto">
		<Head> <Title>Subscribers - Creator Dashboard</Title> </Head>

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
									{{ stat.name }}
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
							<span class="ml-2 text-gray-500 dark:text-gray-200 dark:text-gray-400">from last month</span>
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
					<FormInput v-model="filters.search" placeholder="Search subscribers..." icon="lucide:search" />

					<select v-model="filters.plan" class="form-input">
						<option value="">All Plans</option>

						<option value="monthly">Monthly</option>

						<option value="yearly">Yearly</option>
					</select>

					<select v-model="filters.status" class="form-input">
						<option value="">All Status</option>

						<option value="active">Active</option>

						<option value="expired">Expired</option>

						<option value="cancelled">Cancelled</option>
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
									Subscriber
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									Plan
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									Status
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									Revenue
								</th>

								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									Joined
								</th>

								<th
									class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
								>
									Actions
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
										{{ subscriber.plan === 'monthly' ? 'Monthly' : 'Yearly' }}
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
										{{ subscriber.status }}
									</span>
								</td>

								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900 dark:text-gray-100">${{ subscriber.totalRevenue.toFixed(2) }}</div>

									<div class="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-400">Lifetime value</div>
								</td>

								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
									{{ formatDate(subscriber.joinedAt) }}
								</td>

								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div class="flex justify-end space-x-2">
										<button class="text-gray-400 hover:text-primary-600" @click="messageSubscriber(subscriber)">
											<Icon name="lucide:message-circle" class="h-5 w-5" />
										</button>
										<button
											v-if="subscriber.status === 'active'"
											class="text-gray-400 hover:text-error-600"
											@click="confirmBlock(subscriber)"
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
						<button class="btn-outline" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
						<button class="btn-outline" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
					</div>

					<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p class="text-sm text-gray-700">
								Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
								<span class="font-medium">{{ endIndex }}</span> of
								<span class="font-medium">{{ totalSubscribers }}</span> results
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
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
							@click="blockSubscriber"
						>
							{{ t('subscribers.block') }}
						</button>
						<button
							type="button"
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
	layout: 'creator',
	middleware: ['auth'],
	meta: {
		requiresAuth: true,
		requiresCreator: true,
	},
})

interface StatCard {
	name: string
	value: string
	icon: string
	color: string
	trend: number
}

interface Subscriber {
	id: string
	name: string
	email: string
	avatar: string
	plan: 'monthly' | 'yearly'
	status: 'active' | 'expired' | 'cancelled'
	totalRevenue: number
	joinedAt: Date
}

interface Filters {
	search: string
	plan: string
	status: string
}

// Stats data
const stats = ref<StatCard[]>([
	{
		name: 'Total Subscribers',
		value: '1,234',
		icon: 'lucide:users',
		color: 'primary',
		trend: 12,
	},
	{
		name: 'Monthly Revenue',
		value: '$12,345',
		icon: 'lucide:dollar-sign',
		color: 'success',
		trend: 8,
	},
	{
		name: 'Active Subscribers',
		value: '1,100',
		icon: 'lucide:user-check',
		color: 'secondary',
		trend: 5,
	},
	{
		name: 'Churn Rate',
		value: '2.3%',
		icon: 'lucide:trending-down',
		color: 'error',
		trend: -1,
	},
])

// Filters and pagination
const filters = ref<Filters>({
	search: '',
	plan: '',
	status: '',
})

const currentPage = ref<number>(1)
const itemsPerPage = 10
const showBlockModal = ref<boolean>(false)
const subscriberToBlock = ref<Subscriber | null>(null)

// Mock subscribers data
const subscribers = ref<Subscriber[]>([
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
		plan: 'monthly',
		status: 'active',
		totalRevenue: 29.97,
		joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
		plan: 'yearly',
		status: 'active',
		totalRevenue: 99.99,
		joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
	},
	{
		id: '3',
		name: 'Mike Johnson',
		email: 'mike@example.com',
		avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
		plan: 'monthly',
		status: 'cancelled',
		totalRevenue: 9.99,
		joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
	},
])

// Computed properties
const filteredSubscribers = computed<Subscriber[]>(() => {
	let result = [...subscribers.value]

	// Apply search filter
	if (filters.value.search) {
		const searchLower = filters.value.search.toLowerCase()
		result = result.filter(
			(subscriber) =>
				subscriber.name.toLowerCase().includes(searchLower) || subscriber.email.toLowerCase().includes(searchLower),
		)
	}

	// Apply plan filter
	if (filters.value.plan) {
		result = result.filter((subscriber) => subscriber.plan === filters.value.plan)
	}

	// Apply status filter
	if (filters.value.status) {
		result = result.filter((subscriber) => subscriber.status === filters.value.status)
	}

	return result
})

const totalSubscribers = computed<number>(() => filteredSubscribers.value.length)
const totalPages = computed<number>(() => Math.ceil(totalSubscribers.value / itemsPerPage))

const startIndex = computed<number>(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed<number>(() => Math.min(startIndex.value + itemsPerPage, totalSubscribers.value))

const displayedPages = computed<number[]>(() => {
	const pages: number[] = []
	const maxPages = 5

	if (totalPages.value <= maxPages) {
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i)
		}
	} else {
		let start = Math.max(1, currentPage.value - 2)
		const end = Math.min(totalPages.value, start + maxPages - 1)

		if (end - start < maxPages - 1) {
			start = Math.max(1, end - maxPages + 1)
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
	}

	return pages
})

// Methods
function formatDate(date: Date): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

function messageSubscriber(subscriber: Subscriber): void {
	// Implement messaging functionality
	toast.info(`Messaging ${subscriber.name} - To be implemented`)
}

function confirmBlock(subscriber: Subscriber): void {
	subscriberToBlock.value = subscriber
	showBlockModal.value = true
}

function blockSubscriber(): void {
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
		toast.success('Subscriber blocked successfully')
	} catch {
		toast.error('Failed to block subscriber')
	}
}
</script>
