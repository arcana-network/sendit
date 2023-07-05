<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import useLoaderStore from "@/stores/loader";

const FullScreenLoader = defineAsyncComponent(
  () => import("@/components/fullScreenLoader.vue")
);

const loaderStore = useLoaderStore();
</script>

<template>
  <main class="text-white h-full min-h-screen relative">
    <FullScreenLoader v-if="loaderStore.show" />
    <RouterView class="relative z-10"> </RouterView>
  </main>
</template>

<style scoped>
main {
  background-color: #e0e0e0;
  background-image: url("@/assets/images/bg.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
