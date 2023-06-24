<script setup lang="ts">
import Overlay from "../components/overlay.vue";
import { userLoaderStore } from "../stores/loader";
import { HollowDotsSpinner } from "epic-spinners";

const loaderStore = userLoaderStore();
</script>

<template>
  <Overlay>
    <div class="h-full flex flex-col justify-center items-center space-y-10">
      <HollowDotsSpinner
        :animation-duration="1000"
        :dot-size="30"
        color="#E76124"
      />
      <p class="text-xl">{{ loaderStore.message }}</p>
    </div>
  </Overlay>
</template>
