<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useArcanaAuth from "@/use/arcanaAuth";
import useSocketConnection from "@/use/socketConnection";
import useLoaderStore from "@/stores/loader";
import FullScreenLoader from "@/components/fullScreenLoader.vue";
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "@/stores/auth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";
import { useToast } from "vue-toastification";
import useNotificationStore from "@/stores/notification";
import useMetamask from "@/use/metamask";
import NotWhiteListed from "@/components/not-whitelisted.vue";
import useSendStore from "@/stores/send";
import useWalletConnect from "@/use/walletconnect";
import { getAccountBalance } from "@/services/ankr.service";
import ReceiverMessage from "@/components/ReceiverMessage.vue";
import { SOCKET_IDS } from "@/constants/socket-ids";
import TweetVerify from "@/components/TweetVerify.vue";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const toast = useToast();
const isNotWhitelisted = ref(false);
const hasBalance = ref(false);
const sendStore = useSendStore();
const { connectMetamask } = useMetamask();
const walletConnect = useWalletConnect();
const showReceivedCryptoMessage = ref(false);
const showTweetVerificationModal = ref(false);
const tweetHash = ref("");

async function initAuth() {
  loaderStore.showLoader("Initializing...");
  try {
    await auth.init();
    const arcanaAuthProvider = auth.getProvider();
    authStore.provider = arcanaAuthProvider;
    arcanaAuthProvider.on("connect", onWalletConnect);
    authStore.setAuthInitialized(true);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      authStore.isLoggedIn = true;
      authStore.loggedInWith = "";
    } else await router.push({ name: "Login", query: { ...route.query } });
  } catch (error) {
    toast.error(error as string);
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  const account = {
    verifier: authStore.userInfo.loginType,
    verifier_id: authStore.userInfo.id,
  };
  await socketConnection.init(
    // @ts-ignore
    authStore.provider,
    account,
    () => {
      authStore.setSocketLoginStatus(true);
    },
    async () => {
      const { verifier, verifierId } = route.query;
      if (verifier && verifierId) {
        try {
          const data = await getAccountBalance(userStore.address, [
            "eth",
            "polygon",
            "polygon_mumbai",
          ]);
          if (data?.result?.assets?.length) {
            hasBalance.value = true;
          } else {
            hasBalance.value = false;
          }
        } catch (error) {
          console.log(error);
          hasBalance.value = false;
        }
      }
      isNotWhitelisted.value = true;
      loaderStore.hideLoader();
    }
  );
}

async function getUserInfo() {
  if (authStore.loggedInWith === "metamask") {
    const data = await connectMetamask();
    authStore.provider = data.provider;
    authStore.setUserInfo({
      address: data.accounts[0],
      loginType: "null",
      id: "null",
    });
    userStore.address = data.accounts[0];
  } else if (authStore.loggedInWith === "") {
    authStore.provider = auth.getProvider();
    const userInfo = await auth.getUser();
    authStore.setUserInfo(userInfo);
    userStore.address = userInfo.address;
  }
}

async function onWalletConnect() {
  loaderStore.showLoader("Connecting...");
  authStore.provider.on("accountsChanged", (accounts) => {
    authStore.setUserInfo({
      address: accounts[0],
    });
    userStore.address = accounts[0];
  });
  await getUserInfo();
  await initSocketConnect();
}

async function onWalletDisconnect() {
  socketConnection.disconnect();
  authStore.setSocketLoginStatus(false);
  authStore.setLoginStatus(false);
}

onMounted(initAuth);

watch(
  () => authStore.isSocketLoggedIn,
  async (newValue) => {
    if (newValue) {
      if (route.query.id && route.query.id !== "-1") {
        await socketConnection.sendMessage(SOCKET_IDS.VERIFY_INVITE, {
          id: Number(route.query.id),
        });
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
      router.push({ name: "Login", query: { ...route.query } });
    } else if (route.name === "Login") {
      await onWalletConnect();
      loaderStore.hideLoader();
      router.push({ name: "Send", query: { ...route.query } });
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
  return (
    loaderStore.show || (!authStore.isSocketLoggedIn && authStore.isLoggedIn)
  );
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
