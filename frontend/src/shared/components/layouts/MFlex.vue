<template>
  <div
    class="flex-layout"
    :class="[
      `flex-layout--direction-${direction}`,
      `flex-layout--align-${align}`,
      `flex-layout--justify-${justify}`,
      { 'flex-layout--wrap': wrap }
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

const props = withDefaults(
  defineProps<{
    direction?: FlexDirection;
    align?: FlexAlign;
    justify?: FlexJustify;
    wrap?: boolean;
  }>(),
  {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  }
);

const { direction, align, justify, wrap } = props;
</script>

<style scoped>
.flex-layout {
  display: flex;
  gap: var(--spacing-md);
}

.flex-layout--direction-row {
  flex-direction: row;
}
.flex-layout--direction-column {
  flex-direction: column;
}
.flex-layout--direction-row-reverse {
  flex-direction: row-reverse;
}
.flex-layout--direction-column-reverse {
  flex-direction: column-reverse;
}

.flex-layout--align-start {
  align-items: flex-start;
}
.flex-layout--align-center {
  align-items: center;
}
.flex-layout--align-end {
  align-items: flex-end;
}
.flex-layout--align-stretch {
  align-items: stretch;
}
.flex-layout--align-baseline {
  align-items: baseline;
}

.flex-layout--justify-start {
  justify-content: flex-start;
}
.flex-layout--justify-center {
  justify-content: center;
}
.flex-layout--justify-end {
  justify-content: flex-end;
}
.flex-layout--justify-space-between {
  justify-content: space-between;
}
.flex-layout--justify-space-around {
  justify-content: space-around;
}
.flex-layout--justify-space-evenly {
  justify-content: space-evenly;
}

.flex-layout--wrap {
  flex-wrap: wrap;
}
</style>
