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
const { connectMetamask } = useMetamask();

async function initAuth() {
  loaderStore.showLoader("Initializing...");
  try {
    await auth.init();
    authStore.provider = auth.getProvider();
    authStore.provider.on("connect", onWalletConnect);
    authStore.setAuthInitialized(true);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) authStore.setLoginStatus(true);
    else await router.push({ name: "Login", query: { ...route.query } });
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
    () => {
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
  authStore.setLoginStatus(true);
  await getUserInfo();
  await initSocketConnect();
  rewardsStore.fetchRewards(userStore.address);
  userStore.fetchUserPointsAndRank();
  notificationStore.getNotifications();
  if (authStore.loggedInWith !== "walletconnect") {
    authStore.provider.on("disconnect", onWalletDisconnect);
  }
  loaderStore.hideLoader();
}

async function onWalletDisconnect() {
  socketConnection.disconnect();
  authStore.setSocketLoginStatus(false);
  authStore.setLoginStatus(false);
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (!newValue) {
      router.push({ name: "Login", query: { ...route.query } });
    } else if (route.name === "Login") {
      if (
        authStore.loggedInWith === "metamask" ||
        authStore.loggedInWith === "walletconnect"
      ) {
        await onWalletConnect();
      }
      loaderStore.hideLoader();
      router.push({ name: "Send", query: { ...route.query } });
    }
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
    onWalletDisconnect();
  }
  isNotWhitelisted.value = false;
}
</script>

<template>
  <main class="text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <RouterView v-if="authStore.isAuthSDKInitialized"> </RouterView>
    <NotWhiteListed
      v-if="isNotWhitelisted"
      @go-back="handleNoAccessBack"
      @join-waitlist="router.push({ name: 'Waitlist' })"
    />
  </main>
</template>
