<template>
  <input
    class="input"
    :class="[`input--size-${size}`, { 'input--disabled': disabled }]"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

type InputType = 'text' | 'number';
type InputSize = 'small' | 'medium' | 'large';

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    type?: InputType;
    placeholder?: string;
    disabled?: boolean;
    size?: InputSize;
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'medium'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;

  emit(
    'update:modelValue',
    props.type === 'number' ? Number(target.value) : target.value
  );
}
</script>

<style scoped>
.input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  color: var(--color-text-primary);
  padding: 0 var(--input-padding-horizontal);
  font-family: var(--font-family-base);
  transition: 0.2s ease;
}

.input--disabled {
  background: var(--input-disabled-bg);
  color: var(--input-disabled-text);
  border-color: var(--input-disabled-border);
  cursor: not-allowed;
}

.input--size-small {
  height: var(--input-height-small);
  font-size: var(--input-font-small);
}
.input--size-medium {
  height: var(--input-height-medium);
  font-size: var(--input-font-medium);
}
.input--size-large {
  height: var(--input-height-large);
  font-size: var(--input-font-large);
}

.input:focus {
  border-color: var(--color-primary);
}
</style>
