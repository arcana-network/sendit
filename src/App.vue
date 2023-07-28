<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import useLoaderStore from "@/stores/loader";

const FullScreenLoader = defineAsyncComponent(
  () => import("@/components/fullScreenLoader.vue")
);
const AppMaintenance = defineAsyncComponent(
  () => import("@/pages/maintenance.vue")
);

const loaderStore = useLoaderStore();
const isAppDown = import.meta.env.VITE_APP_DOWN === "true";
</script>

<template>
  <main class="bg-[#0e0e0e] text-white h-full min-h-screen relative">
    <img
      src="@/assets/images/bg-top-right.png"
      class="absolute top-[72px] right-0 z-0 filter grayscale w-[33vw]"
    />
    <img
      src="@/assets/images/bg-bottom-left.png"
      class="absolute bottom-0 left-0 z-0 filter grayscale w-[33vw]"
    />
    <div v-if="isAppDown">
      <AppMaintenance />
    </div>
    <div v-else>
      <FullScreenLoader v-if="loaderStore.show" />
      <RouterView class="relative z-10"> </RouterView>
    </div>
  </main>
</template>
