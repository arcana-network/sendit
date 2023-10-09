<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import copyToClipboard from "@/utils/copyToClipboard";
import { composeAndSendDM } from "@/utils/tweet";
import { useToast } from "vue-toastification";

type SendSuccessProps = {
  medium: string;
  verifierId: string;
  shareDetails: {
    isShareRequired: boolean;
    shareLink: string;
  };
  amount: string | number;
  currency: string;
  chain: string;
};

const props = defineProps<SendSuccessProps>();
const emit = defineEmits(["close", "shoutout"]);
const toast = useToast();
const message = `Hello!
\r\n
I have sent you ${props.amount} ${props.currency} on ${props.chain} through SendIt!
Login here using this email to claim (please ensure the URL is of the format "sendit.arcana.network") - ${props.shareDetails.shareLink}
\r\n
SendIt is a product made by Arcana Network to allow users to send crypto to anyone even if they don't have a wallet yet.
Find out more about Arcana here - https://arcana.network`;

async function handleLinkCopy() {
  await copyToClipboard(props.shareDetails.shareLink);
  toast.success("SendIt link copied");
}

function handleTwitterDM() {
  composeAndSendDM(props.verifierId, message);
}

function handleMail() {
  window.open(
    `mailto:${
      props.verifierId
    }?subject=SendIt%20-%20Claim%20your%20tokens&body=${encodeURIComponent(
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
        <h1 class="uppercase font-bold text-[20px]">Link Created</h1>
        <p class="text-philippine-gray text-[10px] w-3/4 text-center">
          Copy the link to send it to your recipient or click the button below
          to share it using the sharing methods supported by your OS.
        </p>
      </div>
      <div
        class="p-4 bg-chinese-black w-full rounded-md cursor-pointer break-all flex gap-4 items-center"
        @click.stop="handleLinkCopy"
      >
        <span>{{ props.shareDetails.shareLink }}</span>
        <button @click.stop="handleLinkCopy" title="Click to copy">
          <img
            src="@/assets/images/icons/copy.svg"
            alt="copy"
            class="w-12 h-12"
          />
        </button>
      </div>
      <div class="flex flex-col space-y-3 w-full">
        <button
          class="btn btn-submit text-sm w-full font-bold"
          v-if="
            props.shareDetails.isShareRequired && props.medium === 'twitter'
          "
          @click.stop="handleTwitterDM"
        >
          Send via twitter DM
        </button>
        <button
          class="btn btn-submit text-sm w-full font-bold"
          v-if="props.shareDetails.isShareRequired && props.medium === 'mail'"
          @click.stop="handleMail"
        >
          Send Email
        </button>
        <button
          class="btn btn-submit-secondary flex justify-center gap-2 items-center w-full text-center"
          @click.stop="emit('shoutout')"
        >
          <span class="font-bold text-xs">Shoutout on twitter</span>
          <!-- <span
            class="text-cornflower-blue text-xs font-light bg-feep-koamaru p-1 rounded-md"
            >Earn 5 XP</span
          > -->
        </button>
      </div>
    </div>
  </Overlay>
</template>
