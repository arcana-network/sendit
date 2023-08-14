<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import useLoaderStore from "@/stores/loader";
import { useRoute } from "vue-router";

const FullScreenLoader = defineAsyncComponent(
  () => import("@/components/fullScreenLoader.vue")
);

const loaderStore = useLoaderStore();
const route = useRoute();
</script>

<template>
  <main class="bg-[#0e0e0e] text-white h-full min-h-screen relative">
    <img
      v-if="route.name !== 'Landing'"
      src="@/assets/images/bg-top-right.png"
      class="absolute top-[72px] right-0 z-0 filter grayscale w-[33vw]"
    />
    <img
      v-if="route.name !== 'Landing'"
      src="@/assets/images/bg-bottom-left.png"
      class="absolute bottom-0 left-0 z-0 filter grayscale w-[33vw]"
    />
    <FullScreenLoader v-if="loaderStore.show" />
    <RouterView class="relative z-10"> </RouterView>
  </main>
</template>
