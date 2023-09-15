<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import copyToClipboard from "@/utils/copyToClipboard";
import { composeAndSendDM } from "@/utils/tweet";
import { useToast } from "vue-toastification";
import useRequestStore from "@/stores/request";
import { normaliseEmail } from "@/utils/normalise";

type RequestSuccessProps = {
  shareDetails: {
    requestId: string;
    shareLink: string;
  };
  recipientId: string;
};

const props = defineProps<RequestSuccessProps>();
const requestStore = useRequestStore();
const emit = defineEmits(["close", "shoutout"]);
const toast = useToast();
const message = `Hello!
\r\n
I have requested some funds from you through SendIt!
Login here to send - ${props.shareDetails.shareLink}
\r\n
SendIt is a product made by Arcana Network to allow users to send crypto to anyone even if they don't have a wallet yet.
Find out more about Arcana here - https://arcana.network`;

async function handleLinkCopy() {
  await copyToClipboard(props.shareDetails.shareLink);
  toast.success("SendIt link copied");
}

function handleTwitterDM() {
  composeAndSendDM(props.recipientId, message);
}

function handleMail() {
  window.open(
    `mailto:${normaliseEmail(
      props.recipientId
    )}?subject=SendIt%20-%20Claim%20your%20tokens&body=${encodeURIComponent(
      message
    )}`
  );
}
</script>

<template>
  <Overlay>
    <div
      class="w-screen max-w-[450px] flex flex-col items-center border-1 border-jet p-4 rounded-md bg-eerie-black space-y-5 relative"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('close')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <img src="@/assets/images/icons/success-tick.svg" alt="success" />
      <div class="space-y-2 flex flex-col items-center">
        <h1 class="uppercase font-bold text-[20px]">Request Created</h1>
        <p class="text-philippine-gray text-[10px] w-3/4 text-center">
          The link below will let the person you share it with to send you the
          tokens you’ve requested. Send it through an email by clicking the
          button below or copy and share it some other way.
        </p>
      </div>
      <div
        class="p-4 bg-chinese-black w-full rounded-md cursor-pointer break-all"
        @click.stop="handleLinkCopy"
      >
        {{ props.shareDetails.shareLink }}
      </div>
      <div class="flex flex-col space-y-3 w-full">
        <button
          class="btn btn-submit text-sm w-full font-bold"
          v-if="requestStore.userInput.medium === 'twitter'"
          @click.stop="handleTwitterDM"
        >
          Send via twitter DM
        </button>
        <button
          class="btn btn-submit text-sm w-full font-bold"
          v-else
          @click.stop="handleMail"
        >
          Send Email
        </button>
      </div>
    </div>
  </Overlay>
</template>
