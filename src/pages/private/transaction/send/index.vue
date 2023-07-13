<script setup lang="ts">
import { ref } from "vue";
import SendForm from "@/components/send/sendForm.vue";
import useSendStore from "@/stores/send";
import SendSuccess from "@/components/send/success.vue";
import TweetVerify from "@/components/TweetVerify.vue";
import { composeAndSendTweet } from "@/utils/tweet";
import useUserStore from "@/stores/user";

const sendStore = useSendStore();
const userStore = useUserStore();
const showSuccessMessage = ref(false);
const showTweetVerificationModal = ref(false);
const shareDetails = ref({
  isShareRequired: false,
  shareLink: "",
});
const verifierId = ref("");
const txHash = ref("");
const verifierHuman = ref("");

function handleTxSucces(data) {
  showSuccessMessage.value = true;
  shareDetails.value = {
    shareLink: data.share_url,
    isShareRequired: data.share_reqd,
  };
  verifierId.value = data.verifier_id;
  txHash.value = data.hash;
  verifierHuman.value = data.verifier_human;
}

function resetUserInput() {
  sendStore.resetUserInput();
}

function handleShoutout() {
  showSuccessMessage.value = false;
  composeAndSendTweet(
    `Just sent a crypto transfer on #SendIt to ${verifierHuman.value}! No wallet, no problem. Join the revolution at https://sendit.arcana.network! `
  );
  showTweetVerificationModal.value = true;
  resetUserInput();
}

function handleSuccessModalClose() {
  showSuccessMessage.value = false;
  userStore.fetchUserPointsAndRank();
  resetUserInput();
}
</script>

<template>
  <SendSuccess
    v-if="showSuccessMessage"
    :medium="sendStore.userInput.medium"
    :share-details="shareDetails"
    :verifier-id="verifierId"
    @shoutout="handleShoutout"
    @close="handleSuccessModalClose"
  />
  <TweetVerify
    v-if="showTweetVerificationModal"
    :xp="25"
    :hash="txHash"
    @close="showTweetVerificationModal = false"
  />
  <div class="flex flex-col justify-center items-center p-12 space-y-10">
    <SendForm @transaction-successful="handleTxSucces" />
  </div>
</template>
