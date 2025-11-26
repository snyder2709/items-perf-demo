import { reactive, ref } from 'vue';
export interface PollingState {
  attempt: number;
  isLoading: boolean;
  success: boolean;
  successCount: number;
  errorCount: number;
}

export type PollType = 'sequential' | 'batch';

export function usePollingRequest() {
  const requestsCount = ref(10);
  const delayMs = ref(0);

  const state = reactive<PollingState>({
    attempt: 0,
    isLoading: false,
    successCount: 0,
    errorCount: 0,
    success: false,
  });

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const pollingRequest = async <T = any>(
    request: (attempt: number) => Promise<T>,
    pollType: PollType = 'sequential'
  ): Promise<T[]> => {
    state.isLoading = true;
    state.success = false;
    state.attempt = 0;
    state.successCount = 0;
    state.errorCount = 0;

    const results: T[] = [];
    if (pollType === 'sequential') {
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
    } else if (pollType === 'batch') {
      const promises = Array.from({ length: requestsCount.value }, (_, i) => {
        const attempt = i + 1;
        return request(attempt)
          .then(res => {
            results[i] = res;
            state.successCount++;
            return res;
          })
          .catch((err) => {
            state.errorCount++;
            throw err;
          });
      });

      await Promise.allSettled(promises);
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
