<script setup lang="ts">
import { computed, onMounted, ref, watch, defineAsyncComponent } from "vue";
import useArcanaAuth from "@/use/arcanaAuth";
import useLoaderStore from "@/stores/loader";
import FullScreenLoader from "@/components/fullScreenLoader.vue";
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "@/stores/auth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";
import { useToast } from "vue-toastification";
import useNotificationStore from "@/stores/notification";
import NotWhiteListed from "@/components/not-whitelisted.vue";
import useSendStore from "@/stores/send";
import useWalletConnect from "@/use/walletconnect";
import ReceiverMessage from "@/components/ReceiverMessage.vue";
import RequestTokensMessage from "@/components/RequestTokensMessage.vue";
import { SOCKET_IDS } from "@/constants/socket-ids";
import TweetVerify from "@/components/TweetVerify.vue";
import {
  Connection,
  useConnection,
  SocketConnectionAccount,
} from "@/stores/connection.ts";
import AirdropSuccess from "@/components/AirdropSuccess.vue";
import { getBytes, hexlify } from "ethers";
import Decimal from "decimal.js";

const AppMaintenance = defineAsyncComponent(
  () => import("@/pages/maintenance.vue")
);

const ACTION_REJECTED = "ACTION_REJECTED";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const auth = useArcanaAuth();
const conn = useConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const toast = useToast();
const isNotWhitelisted = ref(false);
const hasBalance = ref(false);
const sendStore = useSendStore();
const walletConnect = useWalletConnect();
const showReceivedCryptoMessage = ref(false);
const showTweetVerificationModal = ref(false);
const tweetHash = ref("");
const faucetFundsReceived = ref(false);
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const showRequestPopup = ref(false);
const requestPopupData = ref({} as any);

loaderStore.showLoader("Initializing...");

onMounted(() => {
  initAuth();
});

function renderGrecaptcha() {
  window.grecaptcha.render("recaptcha-v2", {
    sitekey: recaptchaSiteKey,
    size: "invisible",
    callback: recaptchaCallback,
  });
}

async function recaptchaCallback(response: string) {
  conn.recaptchaToken = response;
  console.log("Recaptcha token: ", response);
  const account: SocketConnectionAccount = {
    verifier: authStore.userInfo.loginType,
    verifier_id: authStore.userInfo.id,
  };
  await conn.initialize(
    // @ts-ignore
    authStore.provider,
    account
  );
  conn.onceEvent(Connection.ON_ERROR, (error) => {
    if (error.code === ACTION_REJECTED) {
      loaderStore.hideLoader();
      toast.error("Signature rejected");
      if (authStore.loggedInWith === "walletconnect") {
        walletConnect.disconnect();
        onWalletDisconnect();
      } else {
        auth.getAuthInstance().logout();
      }
      router.replace({ name: "Login", query: { ...route.query } });
    }
  });
}

async function initAuth() {
  loaderStore.showLoader("Initializing...");
  try {
    if (!authStore.isAuthSDKInitialized) {
      await auth.init();
    }
    const arcanaAuthProvider = auth.getProvider();
    authStore.provider = arcanaAuthProvider;
    arcanaAuthProvider.on("connect", () => {
      authStore.provider = arcanaAuthProvider;
      authStore.isLoggedIn = true;
      authStore.loggedInWith = "";
      onWalletConnect();
    });
    authStore.setAuthInitialized(true);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      authStore.provider = arcanaAuthProvider;
      authStore.isLoggedIn = true;
      authStore.loggedInWith = "";
      if (route.query["try-it-out"] === "1") {
        await onWalletConnect();
        router.replace({ name: "Send", query: { ...route.query } });
      }
    } else await router.replace({ name: "Login", query: { ...route.query } });
  } catch (error) {
    toast.error(error as string);
  } finally {
    loaderStore.hideLoader();
    renderGrecaptcha();
  }
}

async function initSocketConnect() {
  window.grecaptcha.execute();
}

async function getUserInfo() {
  if (authStore.loggedInWith === "") {
    authStore.provider = auth.getProvider();
    const userInfo = await auth.getUser();
    authStore.setUserInfo(userInfo);
    userStore.address = userInfo.address;
  }
}

async function requestFaucetFunds() {
  try {
    loaderStore.showLoader("Airdrop in progress...");
    await conn.connection.sendMessage(SOCKET_IDS.REQUEST_SOCKET_FUNDS);
    faucetFundsReceived.value = true;
  } catch (error) {
    console.log({ error });
    toast.error("Airdrop already claimed for this account");
  } finally {
    loaderStore.hideLoader();
  }
}

async function onWalletConnect() {
  loaderStore.showLoader("Connecting...");
  if (authStore.loggedInWith === "walletconnect") {
    authStore.provider.on("accountsChanged", async (accounts) => {
      loaderStore.showLoader(
        "Switching account...",
        "Accounts switched by the wallet. Please approve the new signature request to continue."
      );
      await initSocketConnect();
      authStore.setUserInfo({
        address: accounts[0],
        loginType: "null",
        id: accounts[0],
      });
      userStore.address = accounts[0];
    });
  }
  await getUserInfo();
  await initSocketConnect();
}

async function onWalletDisconnect() {
  conn.closeSocket();
  authStore.setLoginStatus(false);
}

watch(
  () => conn.connected,
  async (newValue) => {
    if (newValue) {
      if (route.query["try-it-out"] === "1") {
        await requestFaucetFunds();
        const query = { ...route.query };
        delete query["try-it-out"];
        router.replace({ name: "Send", query });
      }
      await sendStore.fetchSupportedChains();
      if (route.query.requestId) {
        try {
          const request = await conn.sendMessage(SOCKET_IDS.GET_REQUEST, {
            request_id: getBytes(route.query.requestId as string),
          });
          if (request && request.state === 0) {
            showRequestPopup.value = true;
            requestPopupData.value = request;
          } else {
            router.push({ name: "Send" });
          }
        } catch (e) {
          console.log(e);
        }
      }
      rewardsStore.fetchRewards(userStore.address);
      await userStore.fetchUserPointsAndRank();
      notificationStore.getNotifications();
      if (authStore.loggedInWith !== "walletconnect") {
        authStore.provider.on("disconnect", onWalletDisconnect);
      }
      loaderStore.hideLoader();
    }
  }
);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (!newValue) {
      router.replace({ name: "Login", query: { ...route.query } });
    } else if (route.name === "Login") {
      if (authStore.loggedInWith !== "") {
        await onWalletConnect();
      }
      loaderStore.hideLoader();
      router.replace({ name: "Send", query: { ...route.query } });
    }
  }
);

watch(
  () => notificationStore.notificationReceivedToken.length,
  (newValue) => {
    showReceivedCryptoMessage.value = !!newValue;
  }
);

const showFullScreenLoader = computed(() => {
  return loaderStore.show || (!conn.connected && authStore.isLoggedIn);
});

async function handleNoAccessBack() {
  if (
    authStore.loggedInWith !== "metamask" &&
    authStore.loggedInWith !== "walletconnect"
  ) {
    await auth.getAuthInstance().logout();
  } else {
    walletConnect.disconnect();
    onWalletDisconnect();
  }
  isNotWhitelisted.value = false;
}

function handleShoutout({ hash }: any) {
  showTweetVerificationModal.value = true;
  tweetHash.value = hash;
  showReceivedCryptoMessage.value = false;
}

const isAppDown = import.meta.env.VITE_APP_DOWN === "true";

function handleRequestDoLater() {
  showRequestPopup.value = false;
  sendStore.resetRequestInput();
  router.replace({ name: "Send" });
}

function handleRequestAccept() {
  sendStore.requestInput.amount = new Decimal(
    hexlify(requestPopupData.value.data.value)
  ).toNumber();
  sendStore.requestInput.recipientAddress = hexlify(
    requestPopupData.value.data.requester
  );
  sendStore.requestInput.requestId = route.query.requestId as string;
  sendStore.requestInput.chain = requestPopupData.value.chain_id;
  sendStore.requestInput.token = hexlify(
    requestPopupData.value.data.token_address
  );
  sendStore.requestInput.nonce = hexlify(requestPopupData.value.data.nonce);
  sendStore.requestInput.signature = hexlify(requestPopupData.value.signature);
  sendStore.requestInput.expiry = requestPopupData.value.data.expiry;
  router.replace({ name: "Send", query: { ...route.query } });
  showRequestPopup.value = false;
}

async function handleRequestReject() {
  loaderStore.showLoader("Rejecting request...");
  showRequestPopup.value = false;
  await conn.sendMessage(SOCKET_IDS.REJECT_REQUEST, {
    request_id: getBytes(route.query.requestId as string),
  });
  router.replace({ name: "Send" });
  loaderStore.hideLoader();
}
</script>

<template>
  <main class="text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <div v-if="isAppDown">
      <AppMaintenance />
    </div>
    <div v-else>
      <div
        class="flex justify-center items-center h-[36px] bg-[#16AD65] text-[14px] font-[500] px-4 text-center"
      >
        <div class="flex items-baseline flex-wrap justify-center">
          SendIT weekly rewards have been sent out.&nbsp;
          <a
            href="https://www.arcana.network/blog/sendit-weekly-reward-announcements"
            target="_blank"
            class="text-[12px] font-[800] uppercase"
            >Learn more</a
          >
        </div>
      </div>
      <RouterView v-if="authStore.isAuthSDKInitialized"> </RouterView>
    </div>
    <AirdropSuccess
      v-if="faucetFundsReceived"
      @dismiss="faucetFundsReceived = false"
    />
    <ReceiverMessage
      v-if="!faucetFundsReceived && showReceivedCryptoMessage"
      @dismiss="showReceivedCryptoMessage = false"
      @tweet-shoutout="handleShoutout"
    />
    <TweetVerify
      v-if="showTweetVerificationModal"
      :xp="5"
      :hash="tweetHash"
      @close="showTweetVerificationModal = false"
    />
    <NotWhiteListed
      v-if="isNotWhitelisted && !hasBalance"
      @go-back="handleNoAccessBack"
      @join-waitlist="router.push({ name: 'Waitlist' })"
    />
    <RequestTokensMessage
      v-if="showRequestPopup"
      :data="requestPopupData"
      @do-later="handleRequestDoLater"
      @accept="handleRequestAccept"
      @reject="handleRequestReject"
      @dismiss="showRequestPopup = false"
    />
    <div id="recaptcha-v2" data-size="invisible" style="display: none"></div>
  </main>
</template>

<style>
.carousel__next,
.carousel__prev {
  color: #f7f7f7 !important;
}
</style>
