<script setup lang="ts">
import SuccessTick from "@/assets/images/icons/success-tick.svg";
import Overlay from "@/components/overlay.vue";

const props = defineProps({
  medium: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Overlay>
    <div
      class="w-[450px] h-96 flex flex-col items-center border-1 border-jet p-4 rounded-md bg-eerie-black space-y-5"
    >
      <img :src="SuccessTick" alt="success" />
      <div class="space-y-2 flex flex-col items-center">
        <h1 class="uppercase">Link Created</h1>
        <p class="text-philippine-gray text-[10px] w-3/4 text-center">
          Copy the link to send it to your recipient or click the button below
          to share it using the sharing methods supported by your OS.
        </p>
      </div>
      <div class="p-4 h-16 bg-chinese-black w-full rounded-md"></div>
      <div class="flex flex-col space-y-3 w-full">
        <button class="btn btn-submit w-full" v-if="props.medium === 'twitter'">
          Send on twitter DM
        </button>
        <button class="btn btn-submit w-full" v-if="props.medium === 'mail'">
          Send Email
        </button>
        <a
          class="btn btn-submit-secondary flex justify-center space-x-2 w-full text-center"
          href="https://twitter.com/intent/tweet?text=Hello%20world"
          target="_blank"
        >
          <span>SHOUTOUT on twitter</span>
          <span
            class="text-cornflower-blue text-xs font-light bg-feep-koamaru p-1 rounded-md"
            >Earn 40 XP</span
          >
        </a>
      </div>
    </div>
  </Overlay>
</template>
