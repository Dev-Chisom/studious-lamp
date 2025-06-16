import { ref } from 'vue';

interface BaniConfig {
	amount: number
	email: string
	firstName: string
	lastName: string
	phoneNumber: string
	onSuccess: (response: unknown) => void
	onClose: () => void
}

export function useBani() {
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const initializePayment = (config: BaniConfig) => {
		try {
			isLoading.value = true;
			const bani = new window.Bani({
				amount: config.amount,
				email: config.email,
				firstName: config.firstName,
				lastName: config.lastName,
				phoneNumber: config.phoneNumber,
				onSuccess: (response: unknown) => {
					isLoading.value = false;
					config.onSuccess(response);
				},
				onClose: () => {
					isLoading.value = false;
					config.onClose();
				},
			});
			bani.initialize();
		} catch (e: unknown) {
			error.value = e instanceof Error ? e.message : String(e);
			isLoading.value = false;
		}
	};

	return {
		initializePayment,
		isLoading,
		error,
	};
}
