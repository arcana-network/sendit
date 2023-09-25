<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { ref, onBeforeMount } from "vue";
import SendForm from "@/components/send/sendForm.vue";
import useSendStore from "@/stores/send";
import SendSuccess from "@/components/send/success.vue";
import RequestSendSuccess from "@/components/send/requestSuccess.vue";
import TweetVerify from "@/components/TweetVerify.vue";
import { composeAndSendTweet } from "@/utils/tweet";
import { EARN_XP } from "@/constants/rewards";
import RewardsCard from "@/components/rewards-card.vue";
import AppInvite from "@/components/AppInvite.vue";
import useUserStore from "@/stores/user";
import generateSenditUrl from "@/utils/generateSenditUrl";
import { normaliseTwitterHandle } from "@/utils/normalise";
import TwitterFollowVerify from "@/components/TwitterFollowVerify.vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { useRoute } from "vue-router";
import RequestSendForm from "@/components/send/requestForm.vue";

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
const showFollowVerify = ref({
  show: false,
  type: "",
});
const userStore = useUserStore();
const verifier = ref("");
const amount = ref("");
const token = ref("");
const chain = ref("");
const rewardCards = ref([] as typeof EARN_XP);
const route = useRoute();

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
  sendStore.resetRequestInput();
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

function handleRequestShoutout() {
  showSuccessMessage.value = false;
  composeAndSendTweet(
    `Whoosh! I just sent crypto using #SendIt! Join the #GetOnWeb3 revolution at ${generateSenditUrl()}! `
  );
  showTweetVerificationModal.value = true;
  resetUserInput();
}

async function handleSuccessModalClose() {
  showSuccessMessage.value = false;
  await userStore.fetchUserPointsAndRank();
  resetUserInput();
}

function getToValue(verifier, verifier_human) {
  if (verifier === "twitter") {
    return `${normaliseTwitterHandle(verifier_human)}`;
  } else return `an email address`;
}

function OpenVerifyFollow() {
  showFollowVerify.value.show = true;
  showFollowVerify.value.type = "twitter";
}

onBeforeMount(async () => {
  await userStore.fetchUserPointsAndRank();
  rewardCards.value = EARN_XP.filter((item) =>
    userStore.followedOnTwitter ? item.medium !== "twitter" : true
  );
});
</script>

<template>
  <RequestSendSuccess
    v-if="
      showSuccessMessage &&
      route.query.requestId &&
      sendStore.requestInput.signature
    "
    :hash="txHash"
    :chainId="chain"
    @shoutout="handleRequestShoutout"
    @close="handleSuccessModalClose"
  />
  <SendSuccess
    v-if="
      showSuccessMessage &&
      !route.query.requestId &&
      !sendStore.requestInput.signature
    "
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
  <TwitterFollowVerify
    v-if="showFollowVerify.show"
    @close="showFollowVerify.show = false"
    :medium="showFollowVerify.type"
  />
  <div
    class="flex flex-col justify-center items-center p-10 max-lg:px-4 space-y-10"
  >
    <RequestSendForm
      v-if="route.query.requestId && sendStore.requestInput.signature"
      @transaction-successful="handleTxSuccess"
    />
    <SendForm v-else @transaction-successful="handleTxSuccess" />
  </div>
  <Carousel
    wrap-around
    pause-autoplay-on-hover
    :autoplay="3000"
    :transition="500"
    class="w-full max-w-[600px] m-auto mb-3"
  >
    <Slide v-for="item in rewardCards" :key="item.name">
      <RewardsCard
        class="carousel__item"
        :reward="item"
        @invite="showInvitePopup = true"
        @verify-follow="OpenVerifyFollow"
      />
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
  <span class="text-xs text-philippine-gray max-w-[720px] mb-5 px-4 mx-auto"
    >* Note: Earn Send XP for up to 50 transactions daily; no limits on 10%
    bonus XP.</span
  >
</template>
