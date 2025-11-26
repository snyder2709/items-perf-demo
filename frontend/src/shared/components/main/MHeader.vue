<template>
  <header class="header">
    <div class="header__left" v-if='leftButtons.length'>
      <component v-for="(btn, index) in leftButtons" :key="index" :is="btn.component" v-bind="btn.props" />
    </div>

    <nav class="header__nav">
      <ul class="header__nav-list">
        <li v-for="item in navItems" :key="item.path" class="header__nav-item">
          <router-link :to="item.path" custom v-slot="{ isActive, navigate }">
            <span @click="navigate" :class="['header__nav-link', { active: isActive }]">
              {{ item.title }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="header__right" v-if='rightButtons.length'>
      <component v-for="(btn, index) in rightButtons" :key="index" :is="btn.component" v-bind="btn.props" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

export type NavItem = {
  path: RouteRecordRaw['path'];
  title: RouteRecordRaw['meta'] extends { title: infer T } ? T : string;
};
interface ButtonItem {
  component: Component;
  props?: Record<string, any>;
}

withDefaults(
  defineProps<{
    navItems?: NavItem[];
    leftButtons?: ButtonItem[];
    rightButtons?: ButtonItem[];
  }>(),
  {
    navItems: () => [],
    leftButtons: () => [],
    rightButtons: () => [],
  }
);
</script>

<style scoped>
.header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-family-base);
}

.header__left,
.header__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header__nav-list {
  display: flex;
  align-self: flex-start;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.header__nav-link {
  text-decoration: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-weight: 500;
  padding-bottom: 0.25rem;
}

.header__nav-link:hover {
  color: var(--color-primary);
}

.header__nav-link.active {
  border-bottom: 1px solid var(--color-primary);
}
</style>
