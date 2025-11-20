<template>
  <button
    class="btn"
    :class="[
      `btn--type-${type}`,
      `btn--size-${size}`,
      { 'btn--round': round },
      { 'btn--block': block },
      { 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="btn__loader"></span>
    <span class='btn__content'>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue';

type ButtonType =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default';

type ButtonSize = 'small' | 'medium' | 'large';

const props = withDefaults(
  defineProps<{
    type?: ButtonType;
    size?: ButtonSize;
    round?: boolean;
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    type: 'default',
    size: 'medium',
    round: false,
    block: false,
    disabled: false,
    loading: false
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

function onClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  border-radius: var(--radius-base);
  cursor: pointer;
  border: none;
  transition: 0.2s ease;
  gap: 0.5rem;

  height: var(--btn-height-medium);
  padding: var(--btn-padding-medium);
  font-size: var(--btn-font-medium);
}

.btn:disabled {
  background: var(--btn-disabled-bg);
  color: var(--btn-disabled-text);
  border-color: var(--btn-disabled-border);
  cursor: not-allowed;
}

.btn--block {
  width: 100%;
}

.btn--round {
  border-radius: 999px;
}

.btn--size-small {
  height: var(--btn-height-small);
  padding: var(--btn-padding-small);
  font-size: var(--btn-font-small);
}

.btn--size-medium {
  height: var(--btn-height-medium);
  padding: var(--btn-padding-medium);
  font-size: var(--btn-font-medium);
}

.btn--size-large {
  height: var(--btn-height-large);
  padding: var(--btn-padding-large);
  font-size: var(--btn-font-large);
}

.btn--type-default {
  background: var(--btn-default-bg);
  color: var(--btn-default-text);
  border: 1px solid var(--color-border);
}
.btn--type-default:hover:not(:disabled) {
  background: var(--btn-default-bg-hover);
}
.btn--type-default:active:not(:disabled) {
  background: var(--btn-default-bg-active);
}

.btn--type-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}
.btn--type-primary:hover:not(:disabled) {
  background: var(--btn-primary-bg-hover);
}
.btn--type-primary:active:not(:disabled) {
  background: var(--btn-primary-bg-active);
}

.btn--type-success {
  background: var(--color-success);
  color: #fff;
}
.btn--type-success:hover:not(:disabled) {
  background: #6bbd59;
}
.btn--type-success:active:not(:disabled) {
  background: #5aa64b;
}

.btn--type-error {
  background: var(--btn-danger-bg);
  color: var(--btn-danger-text);
}
.btn--type-error:hover:not(:disabled) {
  background: var(--btn-danger-bg-hover);
}
.btn--type-error:active:not(:disabled) {
  background: var(--btn-danger-bg-active);
}

.btn--type-warning {
  background: var(--color-warning);
  color: #000;
}

.btn--type-info {
  background: var(--color-info);
  color: #fff;
}

.btn__loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 0.7s linear infinite;
}
.btn__content{
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
