<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emits = defineEmits(["dismiss"]);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[600px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-[1.75rem] gap-4"
    >
      <div
        class="flex flex-row-reverse flex-wrap gap-4 relative items-center justify-center"
      >
        <button class="absolute -right-5 -top-5" @click="emits('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <img
          class="mx-auto max-w-[12rem]"
          src="@/assets/images/illustration-icons/gasless-img.png"
        />
        <div class="flex flex-col max-w-[300px]">
          <span class="text-[#d8d8d8] text-[1.25rem] font-bold"
            >SendIt, Now without gas fees!</span
          >
          <span class="text-[#b6b6b6] text-[14px]"
            >SendIt now uses Arcana Gasless. Now send tokens on the Polygon
            Network without paying any gas fees!</span
          >
          <span class="text-[#b6b6b6] text-[14px] mt-[2rem]"
            >SendIt isn’t just the easiest way to send crypto but also the
            cheapest!</span
          >
          <button
            class="p-[0.5rem] rounded-[5px] bg-white text-black uppercase font-bold text-[0.875rem] mt-[0.75rem]"
          >
            Setup this wallet now
          </button>
          <div class="flex gap-1 items-center mt-[0.625rem]">
            <input
              type="checkbox"
              class="bg-transparent"
              style="accent-color: white"
              id="dont-show-again"
            />
            <label
              class="text-[#b6b6b6] text-[0.625rem] select-none"
              for="dont-show-again"
              >Don’t show again</label
            >
          </div>
        </div>
      </div>
    </div>
  </Overlay>
</template>
