<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import useArcanaAuth from "@/use/arcanaAuth";
import useSocketConnection from "@/use/socketConnection";
import useLoaderStore from "@/stores/loader";
import FullScreenLoader from "@/components/fullScreenLoader.vue";
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "@/stores/auth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";
import useNotificationStore from "@/stores/notification";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    await auth.init();
    auth.getProvider().on("connect", onWalletConnect);
    auth.getProvider().on("disconnect", onWalletDisconnect);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) authStore.setLoginStatus(true);
    else router.push({ name: "Login" });
    authStore.isAuthSDKInitialized = true;
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  const account = {
    verifier: authStore.userInfo.loginType,
    verifier_id: authStore.userInfo.id,
  };
  // @ts-ignore
  await socketConnection.init(auth.getProvider(), account, () => {
    authStore.setSocketLoginStatus(true);
  });
}

async function getUserInfo() {
  const userInfo = await auth.getUser();
  authStore.setUserInfo(userInfo);
  userStore.address = userInfo.address;
}

async function onWalletConnect() {
  const isLoggedIn = await auth.isLoggedIn();
  if (isLoggedIn) {
    authStore.setLoginStatus(isLoggedIn);
    await getUserInfo();
    await initSocketConnect();
    rewardsStore.fetchRewards(userStore.address);
    userStore.fetchUserPointsAndRank();
    notificationStore.getNotifications();
  }
  loaderStore.hideLoader();
}

async function onWalletDisconnect() {
  authStore.setLoginStatus(await auth.isLoggedIn());
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (newValue) {
      if (route.name === "Login") router.push({ name: "Send" });
    } else router.push({ name: "Login" });
  }
);

const showFullScreenLoader = computed(() => {
  return (
    loaderStore.show || (!authStore.isSocketLoggedIn && authStore.isLoggedIn)
  );
});
</script>

<template>
  <main class="text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <RouterView v-if="authStore.isAuthSDKInitialized"> </RouterView>
  </main>
</template>
