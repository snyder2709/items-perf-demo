<template>
  <m-flex direction="column" gap="16">
    <StatePanel :state='state' :total-requests='testPerfomParams.requestsCount' />
    <TestRunForm v-model="testPerfomParams" @run-test="runTest" @clear-all="clearMetrics" />
    <SummaryList :summaries='summaryList' />
    <DbMetrics :runs="runs" :test-params="testPerfomParams" @remove-run="handleRemoveRun" />
  </m-flex>
</template>

<script setup lang="ts">
import DbMetrics from '@/shared/components/main/DbMetrics.vue'
import { useTestPerform } from '@/shared/composables/metrics/useTestPerfom'
import { computed, onMounted } from 'vue'
import StatePanel from '../components/StatePanel.vue'
import SummaryList from '../components/SummaryList.vue'
import TestRunForm from '../components/TestRunForm.vue'

const {
  runs,
  state,
  runTest,
  loadAllRuns,
  getCount,
  clearMetrics,
  removeRun,
  testPerfomParams
} = useTestPerform()
const summaryList = computed(() => runs.value.map((row) => row.summary))

onMounted(async () => {
  const count = await getCount()
  await loadAllRuns()
  testPerfomParams.count = count.data.count
})

const handleRemoveRun = async (runId: number) => {
  await removeRun(runId)
}
</script>

<style scoped></style>
