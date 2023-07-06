<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import useArcanaAuth from "@/use/arcanaAuth";
import useSocketConnection from "@/use/socketConnection";
import useLoaderStore from "@/stores/loader";
import FullScreenLoader from "@/components/fullScreenLoader.vue";
import { useRouter } from "vue-router";
import useAuthStore from "@/stores/auth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";
import useNotificationStore from "@/stores/notification";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    await auth.init();
    const isLoggedIn = await auth.isLoggedIn();
    auth.getProvider().on("connect", onWalletConnect);
    auth.getProvider().on("disconnect", onWalletDisconnect);
    // @ts-ignore
    if (isLoggedIn) authStore.setLoginStatus(isLoggedIn);
    else router.push({ name: "Login" });
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  // @ts-ignore
  await socketConnection.init(auth.getProvider(), () => {
    authStore.setSocketLoginStatus(true);
  });
}

async function getUserInfo() {
  const userInfo = await auth.getUser();
  authStore.setUserInfo(userInfo);
  userStore.address = userInfo.address;
}

async function onWalletConnect() {
  authStore.setLoginStatus(await auth.isLoggedIn());
  await initSocketConnect();
  await getUserInfo();
  rewardsStore.fetchRewards(userStore.address);
  userStore.fetchUserPointsAndRank();
  notificationStore.getNotifications();
}

async function onWalletDisconnect() {
  authStore.setLoginStatus(await auth.isLoggedIn());
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (newValue) {
      router.push({ name: "Send" });
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
  <main class="bg-black text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <RouterView> </RouterView>
  </main>
</template>
