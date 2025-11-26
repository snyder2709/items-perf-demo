import { reactive, ref } from 'vue';

export interface PollingState<T = any> {
  attempt: number;
  isLoading: boolean;
  success: boolean;
  successCount: number;
  errorCount: number;
}

export function usePollingRequest() {
  const requestsCount = ref(10);
  const delayMs = ref(100);

  const state = reactive<PollingState>({
    attempt: 0,
    isLoading: false,
    successCount: 0,
    errorCount: 0,
    success: false,
  });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const pollingRequest = async <T = any>(
    request: (attempt: number) => Promise<T>
  ): Promise<T[]> => {
    state.isLoading = true;
    state.success = false;
    state.attempt = 0;
    state.successCount = 0;
    state.errorCount = 0;

    const results: T[] = [];

    for (let i = 0; i < requestsCount.value; i++) {
      const attempt = i + 1;
      state.attempt = attempt;

      try {
        const res = await request(attempt);
        results.push(res);
        state.successCount++;
      } catch {
        state.errorCount++;
      }

      if (i < requestsCount.value - 1) {
        await delay(delayMs.value);
      }
    }

    state.success = state.errorCount === 0;
    state.isLoading = false;

    return results;
  };

  return {
    state,
    requestsCount,
    delayMs,
    pollingRequest,
  };
}
