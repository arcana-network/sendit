<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import useArcanaAuth from "./use/arcanaAuth";
import useSocketConnection from "./use/socketConnection";
import useLoaderStore from "./stores/loader";
import FullScreenLoader from "./components/fullScreenLoader.vue";
import { useRouter } from "vue-router";
import useAuthStore from "./stores/auth";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    await auth.init();
    const isLoggedIn = await auth.isLoggedIn();
    auth.getProvider().on("connect", onWalletConnect);
    auth.getProvider().on("disconnect", onWalletDisconnect);
    if (isLoggedIn) authStore.setLoginStatus(await auth.isLoggedIn());
    else router.push({ name: "Login" });
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  await socketConnection.init(auth.getProvider(), () => {
    authStore.setSocketLoginStatus(true);
  });
}

function onWalletConnect() {
  initSocketConnect();
}

async function onWalletDisconnect() {
  authStore.setLoginStatus(await auth.isLoggedIn());
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  (newValue) => {
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
  <main class="bg-black text-white">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <router-view> </router-view>
  </main>
</template>
