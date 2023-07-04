<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import useLoaderStore from "@/stores/loader";

const FullScreenLoader = defineAsyncComponent(
  () => import("@/components/fullScreenLoader.vue")
);

const loaderStore = useLoaderStore();
</script>

<template>
  <main class="bg-black text-white h-full min-h-screen">
    <FullScreenLoader v-if="loaderStore.show" />
    <RouterView> </RouterView>
  </main>
</template>
