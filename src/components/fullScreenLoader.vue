<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import useLoaderStore from "@/stores/loader";

const loaderStore = useLoaderStore();
</script>

<template>
  <Overlay class="z-[99999999]">
    <div class="h-full flex flex-col justify-center items-center">
      <div
        class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col justify-center items-center relative p-8 gap-5"
      >
        <img src="@/assets/images/icons/blue-loader.svg" />
        <div class="text-center text-white text-base uppercase font-bold">
          {{ loaderStore.message || "Please Wait..." }}
        </div>
      </div>
    </div>
  </Overlay>
</template>
