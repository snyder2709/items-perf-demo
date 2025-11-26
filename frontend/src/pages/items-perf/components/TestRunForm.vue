<template>
  <div class="test-form">
    {{ model.requestsCount }}
    <h3 class="test-form__title">Настройка запуска теста</h3>

    <div class="test-form__grid">
      <div class="field">
        <label class="label">Лимит записей</label>
        <m-input v-model="model.limit" type="number" />
      </div>

      <div class="field" v-if="model.type === 'offset'">
        <label class="label">Offset</label>
        <m-input v-model="model.offset" type="number" />
      </div>

      <div class="field" v-if="model.type === 'cursor'">
        <label class="label">Cursor</label>
        <m-input v-model="model.cursor" type="number" />
      </div>

      <div class="field">
        <label class="label">Increment (шаг)</label>
        <m-select v-model="model.increment" :options="presets" size="small" />
      </div>

      <div class="field">
        <label class="label">Тип запроса</label>
        <m-select v-model="model.type" :options="requestTypes" />
      </div>

      <div class="field">
        <label class="label">Кол-во запросов</label>
        <m-input v-model="model.requestsCount" type="number" placeholder="Например 10" />
      </div>

      <div class="field checkbox">
        <label class="label">Кэширование</label>
        <m-input v-model="model.cache" type="checkbox" />
      </div>
    </div>

    <div class="test-form__actions">
      <m-button @click="$emit('run-test')">Запустить тест</m-button>
      <m-button variant="danger" @click="$emit('clear-all')">Очистить всё</m-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MInput from '@/shared/components/form/MInput.vue'
import MSelect, { type SelectOption } from '@/shared/components/form/MSelect.vue'
import { computed } from 'vue'

interface TestParams {
  limit: number
  offset: number
  cursor: number
  increment: number
  type: string
  requestsCount: number
  cache: boolean
  count: number
}

const model = defineModel<TestParams>({ required: true })

const presets = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  let value = model.value.count

  for (let i = 0; i < 9 && value >= 1; i++) {
    const v = Math.floor(value)

    if (!result.some(p => p.value === v)) {
      result.push({
        label: String(v),
        value: v
      })
    }

    value /= 2
  }

  result.push({
    label: '0',
    value: 0
  })

  return result
})


defineEmits<{
  (e: 'run-test'): void
  (e: 'clear-all'): void
}>()

const requestTypes: SelectOption[] = [
  { label: 'Offset pagination', value: 'offset' },
  { label: 'Cursor pagination', value: 'cursor' }
]

const handleRequestCount = (val: number) => {
  return model.value.requestsCount * val
}
</script>


<style scoped>
.test-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  padding: 16px;
}

.test-form__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.test-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.checkbox {
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
}

.label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.test-form__actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
</style>
