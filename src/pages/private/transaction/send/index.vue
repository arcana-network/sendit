<script setup lang="ts">
import { ref } from "vue";
import SendForm from "@/components/send/sendForm.vue";
import useSendStore from "@/stores/send";
import SendSuccess from "@/components/send/success.vue";
import TweetVerify from "@/components/TweetVerify.vue";
import { composeAndSendTweet } from "@/utils/tweet";
import { EARN_XP_SEND_FORM } from "@/constants/rewards";
import RewardsCard from "@/components/rewards-card.vue";
import AppInvite from "@/components/AppInvite.vue";
import useUserStore from "@/stores/user";
import generateSenditUrl from "@/utils/generateSenditUrl";
import { normaliseTwitterHandle } from "@/utils/normalise";

const sendStore = useSendStore();
const showSuccessMessage = ref(false);
const showTweetVerificationModal = ref(false);
const shareDetails = ref({
  isShareRequired: false,
  shareLink: "",
});
const verifierId = ref("");
const txHash = ref("");
const verifierHuman = ref("");
const showInvitePopup = ref(false);
const userStore = useUserStore();
const verifier = ref("");
const amount = ref("");
const token = ref("");
const chain = ref("");

function handleTxSuccess(data) {
  showSuccessMessage.value = true;
  shareDetails.value = {
    shareLink: data.share_url,
    isShareRequired: data.share_reqd,
  };
  amount.value = data.amount;
  token.value = data.token;
  chain.value = data.chain;
  verifierId.value = data.verifier_id;
  txHash.value = data.hash;
  verifierHuman.value = data.verifier_human;
  verifier.value = data.verifier;
}

function resetUserInput() {
  sendStore.resetUserInput();
}

function handleShoutout() {
  showSuccessMessage.value = false;
  composeAndSendTweet(
    `Whoosh! I just sent crypto to ${getToValue(
      verifier.value,
      verifierHuman.value
    )} using #SendIt! Join the #GetOnWeb3 revolution at ${generateSenditUrl()}! `
  );
  showTweetVerificationModal.value = true;
  resetUserInput();
}

function handleSuccessModalClose() {
  showSuccessMessage.value = false;
  userStore.fetchUserPointsAndRank();
  resetUserInput();
}

function getToValue(verifier, verifier_human) {
  if (verifier === "twitter") {
    return `${normaliseTwitterHandle(verifier_human)}`;
  } else return `an email address`;
}
</script>

<template>
  <SendSuccess
    v-if="showSuccessMessage"
    :medium="sendStore.userInput.medium"
    :share-details="shareDetails"
    :verifier-id="verifierId"
    :amount="amount"
    :currency="token"
    :chain="chain"
    @shoutout="handleShoutout"
    @close="handleSuccessModalClose"
  />
  <TweetVerify
    v-if="showTweetVerificationModal"
    :xp="5"
    :hash="txHash"
    @close="showTweetVerificationModal = false"
  />
  <AppInvite v-if="showInvitePopup" @close="showInvitePopup = false" />
  <div
    class="flex flex-col justify-center items-center p-10 max-lg:px-4 space-y-10"
  >
    <SendForm @transaction-successful="handleTxSuccess" />
  </div>
  <div
    class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 max-w-[1100px] m-auto"
  >
    <RewardsCard
      v-for="item in EARN_XP_SEND_FORM"
      :reward="item"
      @invite="showInvitePopup = true"
    />
  </div>
</template>
