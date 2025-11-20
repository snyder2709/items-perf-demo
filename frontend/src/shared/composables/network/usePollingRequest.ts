import type { AxiosResponse } from 'axios';
import { reactive, ref } from 'vue';

export interface PollingState<T = any> {
  attempt: number;
  isLoading: boolean;
  success: boolean;
  error: any | null;
  result: T | null;
}


export function usePollingRequest() {
  const requestsCount = ref(10);
  const delayMs = ref(100);

  const state = reactive<PollingState>({
    attempt: 0,
    isLoading: false,
    success: false,
    error: null,
    result: null,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const pollingRequest = async <T = any>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>[]> => {
    state.isLoading = true;
    state.success = false;
    state.error = null;
    state.result = null;
    state.attempt = 0;

    const attempts = Array.from({ length: requestsCount.value });

    const results: AxiosResponse<T>[] = [];

    await attempts.reduce<Promise<void>>(async (chain, _, index) => {
      await chain;

      state.attempt = index + 1;

      try {
        const res = await request();
        results.push(res);
        state.result = res.data;
        state.success = true;
      } catch (err) {
        state.error = err;
      }

      if (index < attempts.length - 1) {
        await delay(delayMs.value);
      }
    }, Promise.resolve());

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
