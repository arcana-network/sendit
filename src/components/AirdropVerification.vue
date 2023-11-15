<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emit = defineEmits(["dismiss", "success", "failed"]);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[460px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5 relative">
        <button class="absolute right-0" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <div class="flex flex-col justify-center items-center gap-6 mt-2">
          <img
            src="@/assets/images/illustration-icons/default.png"
            alt="success"
            class="w-[60px] aspect-square"
          />
          <div class="flex flex-col">
            <span class="font-[700] text-xl uppercase text-center">
              Verify you account
            </span>
            <span
              class="text-xs text-philippine-gray text-center max-w-[360px]"
            >
              Verify your account to be eligible to claim XAR tokens. Your
              account should be created
              <span class="font-[500] text-white">before Oct 1st, 2023.</span>
            </span>
          </div>
        </div>
        <div class="flex gap-4 mt-4 flex-wrap justify-center">
          <button
            class="flex justify-center flex-grow items-center p-2 space-x-2 border-2 rounded-md"
            @click="emit('success')"
          >
            <span class="uppercase text-sm font-bold">Verify with Twitter</span>
          </button>
          <button
            class="flex justify-center flex-grow items-center p-2 space-x-2 border-2 rounded-md"
            @click="emit('failed')"
          >
            <span class="uppercase text-sm font-bold"
              >Verify with Linkedin</span
            >
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
