<script setup lang="ts">
import Overlay from "@/components/overlay.vue";

const props = defineProps<{
  hash: string;
  chainId: string;
}>();

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
      </div>
      <!-- <div class="flex flex-col space-y-3 w-full">
        <button
          class="btn btn-submit-secondary flex justify-center gap-2 items-center w-full text-center"
          @click.stop="emit('shoutout')"
        >
          <span class="font-bold text-xs">Shoutout on twitter</span>
          <span
            class="text-cornflower-blue text-xs font-light bg-feep-koamaru p-1 rounded-md"
            >Earn 5 XP</span
          >
        </button>
      </div> -->
    </div>
  </Overlay>
</template>
