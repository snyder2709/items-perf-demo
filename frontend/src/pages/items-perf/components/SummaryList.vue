<template>

  <m-flex direction="row" gap='16' >
    <TransitionGroup name="fade-slide">
      <SummaryCard v-for="summary in summaries" :key="summary.runId" :summary="summary" />
    </TransitionGroup>
  </m-flex>
</template>

<script setup lang="ts">
import MFlex from '@/shared/components/layouts/MFlex.vue'
import SummaryCard from './SummaryCard.vue'

export interface Summary {
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
  summaries: Summary[]
}>()
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.25s ease;
}

.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
