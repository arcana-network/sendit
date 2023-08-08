<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emits = defineEmits(["dismiss"]);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[500px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5 relative">
        <button class="absolute right-0" @click="emits('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-xl uppercase text-center">
            Airdrop Received
          </span>
          <span class="text-xs text-philippine-gray text-center">
            You have been airdropped 0.01 testnet MATIC to start using SendIt on
            Polygon Mumbai
          </span>
        </div>
        <button
          class="flex justify-center items-center p-2 space-x-2 border-2 rounded-md"
          @click="emits('dismiss')"
        >
          <span class="uppercase text-sm">Dismiss</span>
        </button>
      </div>
    </div>
  </Overlay>
</template>
