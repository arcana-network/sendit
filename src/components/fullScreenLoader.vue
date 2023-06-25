<script setup lang="ts">
import Overlay from "../components/overlay.vue";
import { userLoaderStore } from "../stores/loader";

const loaderStore = userLoaderStore();
</script>

<template>
  <Overlay>
    <div class="h-full flex flex-col justify-center items-center space-y-10">
      <p class="text-xl">{{ loaderStore.message }}</p>
    </div>
  </Overlay>
</template>
