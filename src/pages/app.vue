<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
import { SOCKET_IDS } from "@/constants/socket-ids";
import TweetVerify from "@/components/TweetVerify.vue";
import {
  Connection,
  useConnection,
  SocketConnectionAccount,
} from "@/stores/connection.ts";

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

async function initAuth() {
  loaderStore.showLoader("Initializing...");
  try {
    if (!authStore.isAuthSDKInitialized) {
      await auth.init();
    }
    const arcanaAuthProvider = auth.getProvider();
    authStore.provider = arcanaAuthProvider;
    arcanaAuthProvider.on("connect", () => {
      onWalletConnect();
    });
    authStore.setAuthInitialized(true);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      authStore.isLoggedIn = true;
      authStore.loggedInWith = "";
      await onWalletConnect();
      router.replace({ name: "Send", query: { ...route.query } });
    } else await router.replace({ name: "Login", query: { ...route.query } });
  } catch (error) {
    toast.error(error as string);
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  const account: SocketConnectionAccount = {
    verifier: authStore.userInfo.loginType,
    verifier_id: authStore.userInfo.id,
  };
  await conn.initialize(
    // @ts-ignore
    authStore.provider,
    account
  );
  conn.onEvent(Connection.ON_ERROR, (error) => {
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
    loaderStore.showLoader("Requesting faucet funds...");
    await conn.connection.sendMessage(SOCKET_IDS.REQUEST_SOCKET_FUNDS);
    toast.success("Faucet funds requested");
  } catch (error) {
    console.log({ error });
    toast.error("Faucet funds already claimed for this account");
  } finally {
    loaderStore.hideLoader();
  }
}

async function onWalletConnect() {
  loaderStore.showLoader("Connecting...");
  if (authStore.loggedInWith === "walletconnect") {
    authStore.provider.on("accountsChanged", async (accounts) => {
      await initSocketConnect();
      authStore.setUserInfo({
        address: accounts[0],
        loginType: "null",
        id: "null",
      });
      userStore.address = accounts[0];
      loaderStore.hideLoader();
    });
  }
  await getUserInfo();
  await initSocketConnect();
}

async function onWalletDisconnect() {
  conn.closeSocket();
  authStore.setLoginStatus(false);
}

onMounted(initAuth);

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
      if (route.query.r) {
        try {
          await conn.connection.sendMessage(SOCKET_IDS.VERIFY_REFERRER, {
            referrer: route.query.r,
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (route.query.id && route.query.id !== "-1") {
        try {
          await conn.connection.sendMessage(SOCKET_IDS.VERIFY_INVITE, {
            id: Number(route.query.id),
          });
        } catch (error) {
          console.log(error);
        }
      }
      await sendStore.fetchSupportedChains();
      rewardsStore.fetchRewards(userStore.address);
      userStore.fetchUserPointsAndRank();
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
</script>

<template>
  <main class="text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <RouterView v-if="authStore.isAuthSDKInitialized"> </RouterView>
    <ReceiverMessage
      v-if="showReceivedCryptoMessage"
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
  </main>
</template>
