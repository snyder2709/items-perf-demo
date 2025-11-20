<template>
  <m-button
    size="medium"
    type="primary"
    round
    @click="toggleTheme"
  >
    <component width='24' :is="currentIcon" />
  </m-button>
</template>

<script setup lang="ts">
import MButton from '@/shared/components/form/MButton.vue';
import { useTheme } from '@/shared/composables/dom/useTheme';
import { WbSunnyOutlined, WbSunnyRound } from '@vicons/material';
import { computed, h } from 'vue';

const { toggleTheme, theme } = useTheme();

const currentIcon = computed(() =>
  theme.value === 'dark' ? h(WbSunnyRound,{width:24,color:'white'}) : h( WbSunnyOutlined,{width:24,color:'black'})
);
</script>

<style scoped></style>
