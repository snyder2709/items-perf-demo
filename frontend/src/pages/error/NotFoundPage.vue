<template>
  <m-flex justify="center" align="center" class="notfound">
    <div class="notfound__content">
      <h1 class="notfound__title">404</h1>
      <p class="notfound__text">Страница не найдена</p>
      <MButton type="primary" @click="goHome">На главную</MButton>
    </div>
  </m-flex>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'home' });
}
</script>

<style scoped>
.notfound__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.notfound__title {
  font-size: 6rem;
  margin: 0;
  font-weight: bold;
}

.notfound__text {
  font-size: 1.5rem;
  margin: 1rem 0 2rem;
  color: var(--color-text-secondary);
}
</style>
