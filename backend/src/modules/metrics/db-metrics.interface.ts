/**
 * Лог одного запроса к базе данных
 */
export interface DbQueryLog {
  id: number;
  params: Record<string, any>;
  startTime: number;
  endTime: number;
  durationMs: number;
}

/**
 * Метрики одного запуска нагрузочного теста
 */
export interface DbMetrics {
  runId: number;
  averageExecutionMs: number;
  totalQueries: number;
  queries: DbQueryLog[];
}
