<template>
  <div class="summary-card">
    <h3 class="summary-card__title">Отчёт по запуску #{{ summary.runId }}</h3>

    <div class="summary-grid">
      <div class="summary-item">
        <span class="label">Общее время прогона</span>
        <span class="value">{{ summary.totalDuration }} ms</span>
      </div>

      <div class="summary-item">
        <span class="label">DB запросов</span>
        <span class="value">{{ summary.dbCount }}</span>
      </div>

      <div class="summary-item">
        <span class="label">HTTP запросов</span>
        <span class="value">{{ summary.httpCount }}</span>
      </div>
    </div>

    <div class="summary-section">
      <h4>Метрики БД</h4>
      <div class="metrics">
        <div>Avg: <strong>{{ summary.dbAvgMs }} ms</strong></div>
        <div>Min: <strong>{{ summary.dbMinMs }} ms</strong></div>
        <div>Max: <strong>{{ summary.dbMaxMs }} ms</strong></div>
      </div>
    </div>

    <div class="summary-section" v-if="summary.httpCount > 0">
      <h4>Метрики HTTP</h4>
      <div class="metrics">
        <div>Avg: <strong>{{ summary.httpAvgMs }} ms</strong></div>
        <div>Min: <strong>{{ summary.httpMinMs }} ms</strong></div>
        <div>Max: <strong>{{ summary.httpMaxMs }} ms</strong></div>
      </div>
    </div>

    <div class="summary-footer">
      <span>Начало: {{ formatTime(summary.startTime) }}</span>
      <span>Окончание: {{ formatTime(summary.endTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Summary {
  runId: number
  totalDuration: number
  httpCount: number
  dbCount: number
  httpAvgMs: number
  httpMinMs: number
  httpMaxMs: number
  dbAvgMs: number
  dbMinMs: number
  dbMaxMs: number
  startTime: number
  endTime: number
}

defineProps<{
  summary: Summary
}>()

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}
</script>

<style scoped>
.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary);
}

.summary-card__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  background: var(--color-bg-secondary);
  padding: 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.value {
  font-size: 15px;
  font-weight: 600;
}

.summary-section {
  margin-top: 12px;
}

.summary-section h4 {
  font-size: 14px;
  margin-bottom: 6px;
}

.metrics {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.summary-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
