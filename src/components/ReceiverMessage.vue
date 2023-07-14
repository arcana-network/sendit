<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import useArcanaAuth from "@/use/arcanaAuth";

const emit = defineEmits(["dismiss"]);

function handleShowWallet() {
  const arcanaAuth = useArcanaAuth();
  arcanaAuth.getAuthInstance().showWallet();
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('dismiss')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <div class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-[20px] uppercase font-bold"
            >Received Crypto</span
          >
          <span class="text-xs text-philippine-gray max-w-[320px] text-center">
            You have received some tokens from a SendIt user. Please check out
            the wallet in the bottom right corner.
          </span>
        </div>
        <div class="flex justify-end">
          <button
            class="uppercase w-full border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
            @click.stop="handleShowWallet"
          >
            Show Wallet
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
