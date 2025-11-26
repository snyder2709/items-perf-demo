import instance from '@/app/providers/axios/instance';
import { queryBuilder } from '@/shared/libs/queryBuilder';
import { computed, reactive, ref } from 'vue';
import { usePollingRequest } from '../network/usePollingRequest';

export interface DbQueryLog {
  id: number;
  query: string;
  startTime: number;
  endTime: number;
  durationMs: number;
}

export interface DbMetrics {
  runId: number;
  averageExecutionMs: number | null;
  queries: DbQueryLog[];
}

export interface TestRunSummary {
  runId: number;
  totalDuration: number;
  httpCount: number;
  dbCount: number;
  httpAvgMs: number;
  httpMinMs: number;
  httpMaxMs: number;
  dbAvgMs: number;
  dbMinMs: number;
  dbMaxMs: number;
  startTime: number;
  endTime: number;
}

export interface TestRun {
  runId: number;
  startTime: number;
  endTime: number;
  attempts: number;
  http: DbQueryLog[];
  db: DbQueryLog[];
  summary: TestRunSummary;
}

export function useTestPerform() {
  const { pollingRequest, requestsCount,state } = usePollingRequest();
  const testPerfomParams = reactive({
    limit: 50,
    offset: 0,
    cursor: 0,
    cache: false,
    type: 'offset',
    requestsCount,
    count: 0,
    increment:0
  });

  const runs = ref<TestRun[]>([]);
  let httpQueryId = 0;

  const summaryList = computed<TestRunSummary[]>(() =>
    runs.value.map(run => run.summary)
  );

  const buildHttpMetric = async (
    request: () => Promise<any>,
    query: string
  ): Promise<DbQueryLog> => {
    const startHigh = performance.now();
    const startTs = Date.now();

    try {
      await request();
      const endHigh = performance.now();
      const endTs = Date.now();

      return {
        id: ++httpQueryId,
        query,
        startTime: startTs,
        endTime: endTs,
        durationMs: Number((endHigh - startHigh).toFixed(3)),
      };
    } catch {
      const endHigh = performance.now();
      const endTs = Date.now();

      return {
        id: ++httpQueryId,
        query: `${query} [ERROR]`,
        startTime: startTs,
        endTime: endTs,
        durationMs: Number((endHigh - startHigh).toFixed(3)),
      };
    }
  };

  const calculateStats = (queries: DbQueryLog[]) => {
    if (!queries.length) {
      return { avg: 0, min: 0, max: 0 };
    }

    const durations = queries.map(q => q.durationMs);
    const sum = durations.reduce((acc, val) => acc + val, 0);

    return {
      avg: Number((sum / queries.length).toFixed(3)),
      min: Number(Math.min(...durations).toFixed(3)),
      max: Number(Math.max(...durations).toFixed(3)),
    };
  };

  const createSummary = (
    runId: number | string,
    startTime: number,
    endTime: number,
    httpResults: DbQueryLog[],
    dbQueries: DbQueryLog[]
  ): TestRunSummary => {
    const httpStats = calculateStats(httpResults);
    const dbStats = calculateStats(dbQueries);

    return {
      runId: runId as number,
      totalDuration: endTime - startTime,
      httpCount: httpResults.length,
      dbCount: dbQueries.length,
      httpAvgMs: httpStats.avg,
      httpMinMs: httpStats.min,
      httpMaxMs: httpStats.max,
      dbAvgMs: dbStats.avg,
      dbMinMs: dbStats.min,
      dbMaxMs: dbStats.max,
      startTime,
      endTime,
    };
  };

  const runTest = async (): Promise<TestRunSummary> => {
    const { data: startData } = await instance.post<{ runId: number }>('/db-metrics/start');
    const runId = startData.runId;
    const startTime = Date.now();

  const httpResults = await pollingRequest((attempt) => {
    if (testPerfomParams.type === 'offset') {
      testPerfomParams.offset = attempt * testPerfomParams.increment;
    }

    if (testPerfomParams.type === 'cursor') {
      testPerfomParams.cursor = attempt * testPerfomParams.increment;
    }

    const url = queryBuilder('/items', { ...testPerfomParams });

    return buildHttpMetric(() => instance.get(url), url);
  });

    const endTime = Date.now();

    const { data: dbMetrics } = await instance.get<DbMetrics>(`/db-metrics/${runId}`);
    await instance.post(`/db-metrics/finish`);

    const summary = createSummary(
      runId,
      startTime,
      endTime,
      httpResults,
      dbMetrics.queries || []
    );

    const testRun: TestRun = {
      runId,
      startTime,
      endTime,
      attempts: httpResults.length,
      http: httpResults,
      db: dbMetrics.queries || [],
      summary,
    };

    runs.value.push(testRun);

    return summary;
  };

  const loadAllRuns = async () => {
    const { data: allMetrics } = await instance.get<DbMetrics[]>('/db-metrics');

    const loadedRuns: TestRun[] = allMetrics.map((metrics) => {
      const startTime = metrics.queries[0]?.startTime || Date.now();
      const endTime = metrics.queries[metrics.queries.length - 1]?.endTime || Date.now();
      const httpResults: DbQueryLog[] = [];

      const summary = createSummary(
        metrics.runId as number,
        startTime,
        endTime,
        httpResults,
        metrics.queries
      );

      return {
        runId: metrics.runId,
        startTime,
        endTime,
        attempts: metrics.queries.length,
        http: httpResults,
        db: metrics.queries,
        summary,
      };
    });

    runs.value = loadedRuns;
  };

  const clearRuns = () => {
    runs.value = [];
  };

  const clearMetrics = async () => {
    await instance.delete('/db-metrics');
    runs.value = [];
  };

  const removeRun = async (runId: number | string) => {
    await instance.delete(`/db-metrics/${runId}`);
    const index = runs.value.findIndex(r => r.runId === runId);
    if (index !== -1) {
      runs.value.splice(index, 1);
    }
  };

  const getCount = async () => await instance.get('/items/count')

  return {
    state,
    runs,
    summaryList,
    runTest,
    loadAllRuns,
    getCount,
    clearRuns,
    clearMetrics,
    removeRun,
    testPerfomParams,
  };
}
