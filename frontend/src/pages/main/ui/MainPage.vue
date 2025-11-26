<template>
  <m-flex direction="column" gap="16">
    <TestRunForm
      v-model="testPerfomParams"
      @run-test="runTest"
      @clear-all="clearMetrics"
    />
    <DbMetrics
      :runs="runs"
      :test-params="testPerfomParams"
      @remove-run="handleRemoveRun"
    />
  </m-flex>
</template>

<script setup lang="ts">
import DbMetrics from '@/shared/components/main/DbMetrics.vue'
import { useTestPerform } from '@/shared/composables/metrics/useTestPerfom'
import { onMounted } from 'vue'
import TestRunForm from '../components/TestRunForm.vue'

const {
  runs,
  runTest,
  loadAllRuns,
  clearMetrics,
  removeRun,
  testPerfomParams
} = useTestPerform()

onMounted(() => {
  loadAllRuns()
})

const handleRemoveRun = async (runId: number) => {
  await removeRun(runId)
}
</script>

<style scoped>
</style>
