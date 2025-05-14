import { ref } from 'vue';

export function useApiRequest<T = any>() {
  const isPending = ref(false);
  const isSuccessful = ref(false);
  const error = ref<null | any>(null);

  async function execute(request: () => Promise<T>): Promise<T | undefined> {
    isPending.value = true;
    isSuccessful.value = false;
    error.value = null;
    try {
      const result = await request();
      isSuccessful.value = true;
      return result;
    } catch (err) {
      error.value = err;
      return undefined;
    } finally {
      isPending.value = false;
    }
  }

  return { isPending, isSuccessful, error, execute };
} 