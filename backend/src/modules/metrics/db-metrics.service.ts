import { ConflictException, Injectable } from '@nestjs/common';
import { performance } from 'perf_hooks';
import { type DbMetrics, type DbQueryLog } from './db-metrics.interface';

enum RunStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
}

@Injectable()
export class DbMetricsService {
  private runMetricsList = new Map<number, DbMetrics>();

  private status: RunStatus = RunStatus.IDLE;
  private currentRunId: number | null = null;
  private queryIdCounter = 0;
  private runIdCounter = 0;

  startRun(): number {
    if (this.status === RunStatus.RUNNING) {
      throw new ConflictException('Test run already in progress');
    }

    this.status = RunStatus.RUNNING;
    this.currentRunId = ++this.runIdCounter;
    this.queryIdCounter = 0;

    this.runMetricsList.set(this.currentRunId, {
      runId: this.currentRunId,
      averageExecutionMs: 0,
      totalQueries: 0,
      queries: [],
    });

    return this.currentRunId;
  }

  finishRun(): DbMetrics {
    if (!this.currentRunId) {
      throw new ConflictException('No active run');
    }

    const metrics = this.runMetricsList.get(this.currentRunId)!;

    if (metrics.totalQueries > 0) {
      metrics.averageExecutionMs =
        metrics.queries.reduce((sum, q) => sum + q.durationMs, 0) /
        metrics.totalQueries;
    }

    this.status = RunStatus.IDLE;
    this.currentRunId = null;

    return metrics;
  }

  async measure<T>(
    fn: () => Promise<T>,
    queryParams?: Record<string, any>
  ): Promise<T> {
    let id = this.currentRunId
    if (this.status !== RunStatus.RUNNING) {
      throw new ConflictException('Run is not started');
    }

    const metrics = this.runMetricsList.get(id as number);

    if (!metrics) {
      throw new Error('Metrics object not found for current run');
    }

    const start = performance.now();
    const startTs = Date.now();

    try {
      return await fn();
    } finally {
      const end = performance.now();
      const endTs = Date.now();
      const duration = Number((end - start).toFixed(3));

      const queryLog: DbQueryLog = {
        id: ++this.queryIdCounter,
        params: queryParams ?? {},
        startTime: startTs,
        endTime: endTs,
        durationMs: duration,
      };

      metrics.queries.push(queryLog);
      metrics.totalQueries = metrics.queries.length;
    }
  }

  getRunMetrics(runId: number): DbMetrics | undefined {
    return this.runMetricsList.get(runId);
  }

  getAllRuns(): DbMetrics[] {
    return Array.from(this.runMetricsList.values());
  }

  clearAllRuns() {
    this.runMetricsList.clear();
  }

  clearRun(id: number): boolean {
    return this.runMetricsList.delete(id);
  }

  getStatus() {
    return this.status;
  }
}

