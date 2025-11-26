<template>
  <div class="state-panel">
    <div class="state-header">
      <span class="state-title">Состояние теста</span>
      <span class="state-badge" :class="{ active: state.isLoading }">
        {{ state.isLoading ? 'Выполняется' : 'Ожидание' }}
      </span>
    </div>

    <div class="state-stats">
      <div>Попытка: {{ state.attempt }} / {{ totalRequests }}</div>
      <div class="success">Успешно: {{ state.successCount }}</div>
      <div class="error">Ошибок: {{ state.errorCount }}</div>
    </div>

    <div class="progress-wrapper">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
      </div>
      <div class="progress-text">
        {{ progressPercent }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface PollingState {
  attempt: number
  isLoading: boolean
  success: boolean
  successCount: number
  errorCount: number
}

const props = defineProps<{
  state: PollingState
  totalRequests: number
}>()

const progressPercent = computed(() => {
  if (!props.totalRequests) return 0
  const done = props.state.successCount + props.state.errorCount
  return Math.min(100, Math.round((done / props.totalRequests) * 100))
})
</script>

<style scoped>
.state-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 14px;
  padding: 16px;
}

.state-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.state-title {
  font-weight: 600;
  font-size: 14px;
}

.state-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.state-badge.active {
  background: #3b82f6;
  color: white;
}

.state-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
}

.success {
  color: var(--color-success);
}

.error {
  color: var(--color-error);
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: width 0.25s ease;
}

.progress-text {
  min-width: 40px;
  font-size: 12px;
  text-align: right;
}
</style>
