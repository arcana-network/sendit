<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emits = defineEmits(["dismiss", "reject", "accept", "do-later"]);
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
          <span class="font-[500] text-xl uppercase text-center"
            >TOKENS REQUESTED</span
          >
          <span class="text-xs text-philippine-gray text-center max-w-[320px]">
            You have a request to send 0.15 ETH to karthiknathan@gmail.com.
            Would you like to do so now?
          </span>
        </div>
        <div class="flex flex-col gap-3">
          <button
            class="flex justify-center items-center btn btn-submit"
            @click="emits('accept')"
          >
            SEND TOKENS
          </button>
          <button
            class="flex justify-center items-center btn btn-submit-secondary"
            @click="emits('reject')"
          >
            REJECT REQUEST
          </button>
          <button
            class="flex justify-center items-center btn btn-submit-secondary"
            @click="emits('do-later')"
          >
            DO THIS LATER
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
