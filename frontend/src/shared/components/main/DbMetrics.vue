<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <div class="legend-controls">
        <button v-for="(run, idx) in runs" :key="run.runId" @click="toggleRun(run.runId)" :style="{
          borderColor: getRunColor(run.runId),
          opacity: hiddenRuns.has(run.runId) ? 0.3 : 1
        }" class="run-toggle">
          Run {{ idx + 1 }} (HTTP: {{ run.http.length }}, DB: {{ run.db.length }})
          <span class="remove" @click.stop="emit('removeRun', run.runId)">×</span>
        </button>
      </div>
    </div>

    <div class="chart-scroll-container">
      <div class="chart-scroll-wrapper">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TestRun } from '@/shared/composables/metrics/useTestPerfom';
import {
  Chart,
  type ChartData,
  type ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-dayjs-4';
import zoomPlugin from 'chartjs-plugin-zoom';
import dayjs from 'dayjs';
import { computed, ref, toRefs } from 'vue';
import { Line } from 'vue-chartjs';

Chart.register(LineElement, PointElement, LinearScale, Tooltip, Legend, Title, Filler, zoomPlugin);

interface Props {
  runs: TestRun[];
}

const props = defineProps<Props>();
const { runs } = toRefs(props);


interface Emits {
  (e: 'removeRun', runId: number): void;
}

const emit = defineEmits<Emits>();

const colors = [
  'rgb(75, 192, 192)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(201, 203, 207)',
  'rgb(83, 102, 255)',
];

const hiddenRuns = ref(new Set<number>());

const getRunColor = (runId: number): string => {
  const index = runs.value.findIndex((r) => r.runId === runId);
  return colors[index % colors.length] as string;
};

const toggleRun = (runId: number) => {
  if (hiddenRuns.value.has(runId)) {
    hiddenRuns.value.delete(runId);
  } else {
    hiddenRuns.value.add(runId);
  }
};

interface DataPoint {
  x: number;
  y: number;
  query: string;
  startTime: number;
}

const formatQuery = (query: string): string => {
  if (!query) return 'No query';
  return query.length > 100 ? query.substring(0, 100) + '...' : query;
};

const getAverageMs = (queries: { durationMs: number }[]): number => {
  if (queries.length === 0) return 0;
  const sum = queries.reduce((acc, q) => acc + q.durationMs, 0);
  return sum / queries.length;
};

const chartData = computed<ChartData<'line'>>(() => {
  const datasets = runs.value
    .filter((run) => !hiddenRuns.value.has(run.runId))
    .flatMap((run, runIndex) => {
      const color = getRunColor(run.runId);
      const httpAvg = getAverageMs(run.http);
      const dbAvg = getAverageMs(run.db);

      const httpDataset = {
        label: `Run ${runIndex + 1} HTTP (avg: ${httpAvg.toFixed(2)} ms)`,
        data: run.http.map((q, queryIndex) => ({
          x: queryIndex + 1,
          y: q.durationMs,
          query: q.query,
          startTime: q.startTime,
        })),
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
        borderDash: [],
      };

      const dbDataset = {
        label: `Run ${runIndex + 1} DB (avg: ${dbAvg.toFixed(2)} ms)`,
        data: run.db.map((q, queryIndex) => ({
          x: queryIndex + 1,
          y: q.durationMs,
          query: q.query,
          startTime: q.startTime,
        })),
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.8)'),
        borderDash: [5, 5], // Пунктирная линия для DB
      };

      return [httpDataset, dbDataset];
    });

  console.log('📈 Total datasets:', datasets.length);
  return { datasets };
});

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: {
    mode: 'nearest' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      onClick: (_e, legendItem) => {
        const index = legendItem.datasetIndex;
        if (index !== undefined) {
          // Определяем какой run это был (каждый run = 2 датасета)
          const runIndex = Math.floor(index / 2);
          const visibleRuns = runs.value.filter((r) => !hiddenRuns.value.has(r.runId));
          const run = visibleRuns[runIndex];
          if (run) {
            toggleRun(run.runId);
          }
        }
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
        mode: 'xy',
      }
    },
    title: {
      display: true,
      text: 'Сравнение длительности запросов (HTTP — сплошная, БД — пунктир)',
      font: { size: 16 },
    },
    tooltip: {
      mode: 'nearest' as const,
      intersect: false,
      callbacks: {
        title: (items) => {
          if (!items[0]) return '';
          const dataPoint = items[0].raw as DataPoint;
          return `Request #${items[0].parsed.x} | ${dayjs(dataPoint.startTime).format(
            'YYYY-MM-DD HH:mm:ss.SSS'
          )}`;
        },
        label: (context) => {
          return `Продолжительность: ${Number(context.parsed.y).toFixed(3)} ms`;
        },
        afterLabel: (context) => {
          const dataPoint = context.raw as DataPoint;
          return `Query: ${formatQuery(dataPoint.query)}`;
        },
      },
    },
  },
  scales: {
    x: {
      type: 'linear' as const,
      title: { display: true, text: 'Request Number' },
      ticks: {
        stepSize: 1,
        callback: function (value) {
          return Number.isInteger(value) ? value : '';
        },
      },
    },
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Duration (ms)' },
    },
  },
}));
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.params-panel {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.param-item label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.param-item input[type="number"],
.param-item select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100px;
}

.param-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.chart-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.chart-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.legend-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.run-toggle {
  padding: 0.25rem 0.75rem;
  border: 2px solid;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.run-toggle:hover {
  background: #f9fafb;
}

.remove {
  font-size: 1.25rem;
  font-weight: bold;
  color: #ef4444;
  line-height: 1;
}

.remove:hover {
  color: #dc2626;
}

.chart-scroll-container {
  flex: 1;
  overflow: hidden;
  padding: 1rem;
  min-height: 400px;
}

.chart-scroll-wrapper {
  height: 100%;
  min-height: 400px;
}
</style>
