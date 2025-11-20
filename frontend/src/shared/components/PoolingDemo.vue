<template>
  <div>
    <h2>Polling demo</h2>
    <m-flex direction='column' style='max-width:200px;' wrap>
      <m-input type='number' v-model='requestsCount'/>
      <m-input type='number' v-model='delayMs'/>
      <p>Попытка: {{ state.attempt }}</p>
      <p>Загрузка: {{ state.isLoading }}</p>
      <p>Успех: {{ state.success }}</p>
      <p v-if="state.error">Ошибка: {{ state.error.message }}</p>
    </m-flex>

    <button @click="run">Запустить polling</button>
  </div>
</template>

<script setup lang="ts">


import instance from "@/app/providers/axios/instance";
import { ref } from "vue";
import { usePollingRequest } from "../composables/network/usePollingRequest";
import MInput from "./form/MInput.vue";

const limit = ref(50)
const offset = ref(0)
const { pollingRequest, state,requestsCount,delayMs } = usePollingRequest();

const run = async () => {
  await pollingRequest(() =>
    instance.get(`/items?limit=${limit.value}&offset=${offset.value}`)
  );
};
</script>
