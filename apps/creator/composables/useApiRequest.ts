import { ref } from 'vue';

export function useApiRequest<T = unknown, Args extends unknown[] = unknown[]>(apiCall: (...args: Args) => Promise<T>) {
	const loading = ref(false);
	const error = ref<string | null>(null);
	const data = ref<T | null>(null);

	const execute = async (...args: Args): Promise<T | null> => {
		loading.value = true;
		error.value = null;
		try {
			const result = await apiCall(...args);
			data.value = result;
			return result;
		} catch (err: unknown) {
			error.value = (err as any)?.response?.data?.error || (err as any)?.response?.data?.message || (err as any)?.message || 'Unknown error';
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return { loading, error, data, execute };
}
