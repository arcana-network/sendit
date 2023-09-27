<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emits = defineEmits(["go-back", "join-waitlist"]);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/exclamation.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-[20px] uppercase">No Access</span>
          <span class="text-xs text-philippine-gray max-w-[320px] text-center">
            The email address or Twitter handle you used to sign up has not been
            whitelisted. Would you like to join the waitlist?
          </span>
        </div>
        <div class="flex justify-center">
          <button
            class="uppercase bg-white rounded-[5px] text-black text-sm font-[500] px-8 py-2 w-full"
            @click.stop="emits('join-waitlist')"
          >
            Join the Waitlist
          </button>
        </div>
        <div class="flex justify-center pb-2 pt-1">
          <button
            class="bg-transparent text-sm font-[500]"
            @click.stop="emits('go-back')"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
