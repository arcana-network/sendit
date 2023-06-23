<script setup lang="ts">
import { useAuthAndConnectionStore } from "./stores/authAndConnection.ts";
import {onMounted} from "vue";

const store = useAuthAndConnectionStore()

onMounted(async () => {
  await store.initialize()
  store.connect()
})
</script>

<template>
  <div class="bg-black">
    <p class="text-6xl">Send it</p>
  </div>
</template>
