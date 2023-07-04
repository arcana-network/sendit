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

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    await auth.init();
    const isLoggedIn = await new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await auth.isLoggedIn());
      }, 1000);
    });
    if (!isLoggedIn) router.push({ name: "Login" });
    auth.getProvider().on("connect", onWalletConnect);
    auth.getProvider().on("disconnect", onWalletDisconnect);
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
    rewardsStore.fetchRewards(userStore.address);
    userStore.fetchUserPointsAndRank();
  });
}

async function getUserInfo() {
  authStore.setUserInfo(await auth.getUser());
}

async function onWalletConnect() {
  authStore.setLoginStatus(true);
  initSocketConnect();
  getUserInfo();
}

async function onWalletDisconnect() {
  authStore.setLoginStatus(await auth.isLoggedIn());
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (newValue) router.push({ name: "Send" });
    else router.push({ name: "Login" });
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
    <router-view> </router-view>
  </main>
</template>

<style scoped>
main {
  background: url("@/assets/images/bg.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
