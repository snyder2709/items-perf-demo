<template>
  <div class="select-wrapper">
    <select
      class="select"
      :class="[`select--size-${size}`, { 'select--disabled': disabled }]"
      :disabled="disabled"
      :value="modelValue"
      @change="onChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';

export interface SelectOption {
  label: string;
  value: string | number;
}

type SelectSize = 'small' | 'medium' | 'large';

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: SelectOption[];
    disabled?: boolean;
    size?: SelectSize;
  }>(),
  {
    disabled: false,
    size: 'medium'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<style scoped>
.select-wrapper {
  width: 100%;
}

.select {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  color: var(--color-text-primary);
  padding: 0 var(--input-padding-horizontal);
  font-family: var(--font-family-base);
  cursor: pointer;
}

.select--disabled {
  background: var(--input-disabled-bg);
  color: var(--input-disabled-text);
  border-color: var(--input-disabled-border);
  cursor: not-allowed;
}

.select--size-small {
  height: var(--input-height-small);
  font-size: var(--input-font-small);
}

.select--size-medium {
  height: var(--input-height-medium);
  font-size: var(--input-font-medium);
}

.select--size-large {
  height: var(--input-height-large);
  font-size: var(--input-font-large);
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
