<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const emit = defineEmits(["dismiss", "retry"]);

type VerificationFailedProps = {
  message?: string;
};

const props = defineProps<VerificationFailedProps>();
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
            src="@/assets/images/illustration-icons/failed.png"
            alt="success"
            class="w-[60px] aspect-square"
          />
          <div class="flex flex-col">
            <span class="font-[700] text-xl uppercase text-center">
              Verification Failed
            </span>
            <span
              v-if="props.message?.length"
              class="text-xs text-philippine-gray text-center max-w-[360px]"
            >
              {{ props.message }}
            </span>
            <span
              v-else
              class="text-xs text-philippine-gray text-center max-w-[360px]"
            >
              Either your date of creating the social account doesn’t meet our
              criteria or something else went wrong while trying to do this.
            </span>
          </div>
        </div>
        <div class="flex gap-4 mt-4 flex-wrap justify-center">
          <button
            class="flex justify-center flex-grow items-center btn btn-submit"
            @click="emit('dismiss')"
          >
            <span class="uppercase text-sm font-bold">Close</span>
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
