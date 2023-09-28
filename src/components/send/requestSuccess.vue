<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  hash: string;
  chainId: string;
}>();

const router = useRouter();
const emit = defineEmits(["close", "shoutout"]);

const chainSpecificExplorers = {
  56: "https://bscscan.com/",
  97: "https://testnet.bscscan.com/",
};

function getChainSpecificExplorer() {
  return `${chainSpecificExplorers[props.chainId]}tx/${props.hash}`;
}
</script>

<template>
  <Overlay>
    <div
      class="w-screen max-w-[450px] flex flex-col items-center border-1 border-jet p-4 pb-8 rounded-md bg-eerie-black space-y-5 relative"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('close')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <img src="@/assets/images/icons/success-tick.svg" alt="success" />
      <div class="space-y-2 flex flex-col items-center">
        <h1 class="uppercase font-bold text-[20px]">Tokens Sent</h1>
        <p
          class="text-philippine-gray text-[12px] max-w-[450px] w-[90%] text-center text-ellipsis overflow-hidden"
        >
          Tokens sent successfully. You can view the transaction here
          <a
            :href="getChainSpecificExplorer()"
            target="_blank"
            class="text-cornflower-blue underline"
          >
            {{ getChainSpecificExplorer() }}</a
          >
        </p>
        <button
          class="btn btn-submit-secondary flex justify-center gap-2 items-center w-full text-center"
          @click.stop="router.push({ name: 'History' })"
        >
          <span class="font-bold text-xs">View Transaction</span>
        </button>
      </div>
    </div>
  </Overlay>
</template>
