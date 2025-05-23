interface State<T> {
  isPending: boolean;
  isSuccessful: boolean;
  error: null | any;
}

export function useApiRequest<T = any>() {
	const state: State<T> = {
		isPending: false,
		isSuccessful: false,
		error: null
	};

	async function execute(request: () => Promise<T>): Promise<T | undefined> {
		state.isPending = true;
		state.isSuccessful = false;
		state.error = null;
		try {
			const result = await request();
			state.isSuccessful = true;
			return result;
		} catch (err) {
			state.error = err;
			return undefined;
		} finally {
			state.isPending = false;
		}
	}

	return {
		get isPending() { return state.isPending; },
		get isSuccessful() { return state.isSuccessful; },
		get error() { return state.error; },
		execute
	};
} 