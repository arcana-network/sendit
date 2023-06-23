<script setup lang="ts">
import { useAuthAndConnStore } from "./stores/authAndConn.ts";
import {onMounted} from "vue";

const store = useAuthAndConnStore()

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
