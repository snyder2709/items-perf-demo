<template>
  <m-flex direction='column'>
    <PoolingDemo/>
    <MarkdownRenderer :content="markdownText" />
  </m-flex>
</template>

<script setup lang="ts">
import PoolingDemo from '@/shared/components/PoolingDemo.vue';


const markdownText = `
# Пример Markdown

- Пункт 1
- Пункт 2
- **Жирный текст**
`;
</script>
