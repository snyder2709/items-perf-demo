<template>
  <VMarkdownView
    class='markdown'
    :content="content"
  />
</template>

<script setup lang="ts">
// @ts-ignore
import { VMarkdownView } from 'vue3-markdown';

defineProps<{
  content: string
}>();
</script>

<style scoped>
.markdown {
  background: var(--color-surface);
  padding: 0.75rem;
  border-radius: 6px;
  overflow-x: auto;
  color: var(--color-text-primary);
}

</style>
