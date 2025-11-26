<template>
  <input
    class="input"
    :class="[
      `input--size-${size}`,
      { 'input--disabled': disabled, 'input--checkbox': type === 'checkbox' }
    ]"
    :type="type"
    :placeholder="type !== 'checkbox' ? placeholder : undefined"
    :disabled="disabled"
    :checked="type === 'checkbox' ? Boolean(modelValue) : undefined"
    :value="type !== 'checkbox' ? modelValue : undefined"
    @input="onInput"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';

type InputType = 'text' | 'number' | 'checkbox';
type InputSize = 'small' | 'medium' | 'large';

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean;
    type?: InputType;
    placeholder?: string;
    disabled?: boolean;
    size?: InputSize;
  }>(),
  {
    modelValue: props => (props.type === 'checkbox' ? false : ''),
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'medium'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (props.type === 'checkbox') return; // handled in onChange
  emit(
    'update:modelValue',
    props.type === 'number' ? Number(target.value) : target.value
  );
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (props.type === 'checkbox') {
    emit('update:modelValue', target.checked);
  }
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

.input--checkbox {
  width: auto;
  height: auto;
  padding: 0;
}

.input:focus {
  border-color: var(--color-primary);
}
</style>
