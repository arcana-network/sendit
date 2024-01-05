<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import { computed } from "vue";

const emit = defineEmits(["dismiss"]);

type VerificationFailedProps = {
  reason: number;
};

enum FailureCodes {
  inactive = 1,
  ineligible = 5,
}

const props = defineProps<VerificationFailedProps>();

const failureTitle = computed(() => {
  if (props.reason === FailureCodes.inactive) {
    return "Airdrop is not active";
  } else if (props.reason === FailureCodes.ineligible) {
    return "Ineligible for airdrop";
  }
});

const failureMessage = computed(() => {
  if (props.reason === FailureCodes.inactive) {
    return "The airdrop is not active at the moment. The airdrop will be active from Jan 08, 2024 to Jan 12, 2024.";
  } else if (props.reason === FailureCodes.ineligible) {
    return "The connected wallet must hold 1000 BICO tokens or the early adopter NFT to claim $XAR. Please come back and try again during the claim window if you think the wallet is eligible.";
  }
});
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
              {{ failureTitle }}
            </span>
            <span
              v-if="props.reason && props.reason !== 0"
              class="text-xs text-philippine-gray text-center max-w-[360px]"
            >
              {{ failureMessage }}
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
