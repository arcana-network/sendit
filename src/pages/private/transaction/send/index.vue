<script setup lang="ts">
import { toRefs, watch, ref, onMounted } from "vue";
import SendForm from "@/components/send/sendForm.vue";
import useSocketConnection from "@/use/socketConnection";
import useAuthStore from "@/stores/auth";
import useSendStore from "@/stores/send";
import useLoaderStore from "@/stores/loader";
import chainList from "@/constants/chainList.ts";
import SendSuccess from "@/components/send/success.vue";
import TweetVerify from "@/components/TweetVerify.vue";
import { SOCKET_IDS } from "@/constants/socket-ids";
import { composeAndSendTweet } from "@/utils/tweet";
import useUserStore from "@/stores/user";

const socketConnection = useSocketConnection();
const authStore = useAuthStore();
const sendStore = useSendStore();
const userStore = useUserStore();
const loaderStore = useLoaderStore();
const { isSocketLoggedIn } = toRefs(authStore);
const showSuccessMessage = ref(false);
const showTweetVerificationModal = ref(false);
const shareDetails = ref({
  isShareRequired: false,
  shareLink: "",
});
const verifierId = ref("");

async function fetchSupportedChains() {
  loaderStore.showLoader("Fetching list of chains...");
  try {
    // @ts-ignore
    const { chains } = await socketConnection.sendMessage(
      SOCKET_IDS.GET_CHAINS
    );
    sendStore.setSupportedChains(
      chains.map((chain) => {
        return {
          ...chain,
          blockchain: chainList[chain.chain_id].block_chain,
        };
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    loaderStore.hideLoader();
  }
}

onMounted(fetchSupportedChains);

watch(isSocketLoggedIn, (newValue) => {
  if (newValue) fetchSupportedChains();
});

function handleTxSucces(e) {
  showSuccessMessage.value = true;
  shareDetails.value = {
    shareLink: e.share_url,
    isShareRequired: e.share_reqd,
  };
  verifierId.value = e.verifier_id;
}

function resetUserInput() {
  sendStore.resetUserInput();
}

function handleShoutout() {
  showSuccessMessage.value = false;
  composeAndSendTweet(
    `Just did a crypto transfer on #SendIt! No wallet, no problem. Join the revolution at https://sendit.arcana.network! `
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
    :xp="40"
    @close="showTweetVerificationModal = false"
  />
  <div class="flex flex-col justify-center items-center p-12 space-y-10">
    <SendForm @transaction-successful="handleTxSucces" />
  </div>
</template>
