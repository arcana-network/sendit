<script setup lang="ts">
import Overlay from "../components/overlay.vue";
import useLoaderStore from "../stores/loader";

const loaderStore = useLoaderStore();
</script>

<template>
  <Overlay>
    <div class="h-full flex flex-col justify-center items-center space-y-10">
      <p class="text-xl">{{ loaderStore.message || "Please Wait..." }}</p>
    </div>
  </Overlay>
</template>
