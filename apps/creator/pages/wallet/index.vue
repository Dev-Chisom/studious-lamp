<template>
	<div class="max-w-6xl mx-auto">
		<Head>
			<Title>Subscribers - Creator Dashboard</Title>
		</Head>
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('nav.wallet') }}</h1>
		</div>

		<div class="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-6 mb-8">
			<div class="flex justify-between items-center mb-6">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('walletBalance') }}</h1>
				<span class="text-3xl font-bold text-primary-600 dark:text-primary-400">₦{{ formatAmount(balance) }}</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<BaseButton class="w-full" variant="primary" @click="showFundingModal = true">{{ t('fundWallet') }}</BaseButton>
				<BaseButton class="w-full" variant="secondary" @click="showTransactionHistory = true">{{
					t('transactionHistory')
				}}</BaseButton>
			</div>
		</div>

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
			</div>
		</div>

		<modal v-if="showFundingModal" @close="showFundingModal = false">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('fundYourWallet') }}</h2>

				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('amount') }} (₦)</label>
						<input
							v-model="fundingAmount"
							type="number"
							class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
							min="100"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<BaseButton :loading="paystackLoading" variant="primary" class="w-full" @click="initializePaystack">
							{{ t('payWithPaystack') }}
						</BaseButton>
						<BaseButton :loading="baniLoading" variant="secondary" class="w-full" @click="initializeBani">
							{{ t('payWithBani') }}
						</BaseButton>
					</div>
				</div>
			</div>
		</modal>

		<modal v-if="showTransactionHistory" @close="showTransactionHistory = false">
			<div class="p-6">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('transactionHistory') }}</h2>

				<div class="space-y-4 max-h-96 overflow-y-auto">
					<div
						v-for="transaction in transactions"
						:key="transaction.id"
						class="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
					>
						<div>
							<p class="font-medium text-gray-900 dark:text-white">{{ transaction.description }}</p>

							<p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>

							<p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ transaction.id }}</p>
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
				</div>
			</div>
		</modal>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePaystack } from '~/composables/usePaystack';
import { useBani } from '~/composables/useBani';
import { useNotification } from '~/composables/useNotifications';
import Modal from '~/components/ui/Modal.vue';
import BaseButton from '~/components/ui/BaseButton.vue';

definePageMeta({
	layout: 'creator',
	middleware: ['auth'],
	meta: {
		requiresAuth: true,
	},
});

const isClient = ref(false);

onMounted(() => {
	isClient.value = true;
});

const notification = useNotification();
const balance = ref(25000);
const showFundingModal = ref(false);
const showTransactionHistory = ref(false);
const fundingAmount = ref(1000);

const { initializePayment: initializePaystackPayment, isLoading: paystackLoading } = usePaystack();
const { initializePayment: initializeBaniPayment, isLoading: baniLoading } = useBani();

const transactions = ref([
	{
		id: 'TXN-001',
		description: 'Wallet Funding',
		amount: 5000,
		type: 'credit',
		date: new Date('2024-04-01'),
	},
	{
		id: 'TXN-002',
		description: 'Subscription Payment',
		amount: 2000,
		type: 'debit',
		date: new Date('2024-03-31'),
	},
	{
		id: 'TXN-003',
		description: 'Creator Tip',
		amount: 1000,
		type: 'debit',
		date: new Date('2024-03-30'),
	},
]);

const { t } = useI18n();

const formatAmount = (amount: number) => {
	return amount.toLocaleString('en-NG');
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat('en-NG', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date));
};

const initializePaystack = () => {
	initializePaystackPayment({
		email: 'user@example.com', // Replace with actual user email
		amount: fundingAmount.value,
		publicKey: 'your-paystack-public-key',
		callback: (response) => {
			if (response.status === 'success') {
				balance.value += fundingAmount.value;
				showFundingModal.value = false;
				// Add transaction to history
				transactions.value.unshift({
					id: `TXN-${Date.now()}`,
					description: 'Wallet Funding via Paystack',
					amount: fundingAmount.value,
					type: 'credit',
					date: new Date(),
				});
				notification.success('Wallet funded successfully!');
			}
		},
		onClose: () => {
			showFundingModal.value = false;
		},
	});
};

const initializeBani = () => {
	initializeBaniPayment({
		amount: fundingAmount.value,
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		phoneNumber: '08012345678',
		onSuccess: (response) => {
			balance.value += fundingAmount.value;
			showFundingModal.value = false;
			console.log(response);
			transactions.value.unshift({
				id: `TXN-${Date.now()}`,
				description: 'Wallet Funding via Bani',
				amount: fundingAmount.value,
				type: 'credit',
				date: new Date(),
			});
			notification.success('Wallet funded successfully!');
		},
		onClose: () => {
			showFundingModal.value = false;
		},
	});
};
</script>
