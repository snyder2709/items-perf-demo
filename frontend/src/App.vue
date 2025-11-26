<template>
  <m-flex direction="column" wrap class="main">
    <m-header
      :navItems="navItems"
      :rightButtons="rightButtons"
    />
    <main class="main__content">
      <router-view />
    </main>
  </m-flex>
</template>

<script setup lang="ts">
import ChangeTheme from '@/shared/components/main/ChangeTheme.vue';
import type { NavItem } from '@/shared/components/main/MHeader.vue';
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navItems = computed<NavItem[]>(() =>
  router.options.routes
    .filter(route => route.meta?.title && route.name != '404')
    .map(route => ({
      path: route.path,
      title: route.meta!.title as string,
    }))
);

const rightButtons = ref([
  { component: h(ChangeTheme) }
]);
</script>

<style scoped>
.main__content {
  overflow: auto;
  width: 100%;
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
}
</style>
