<script setup lang="ts">
import { onMounted, watch } from "vue";
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

async function initConnection() {
  socketConnection.init(auth.getProvider());
}

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    await auth.init();
    const isLoggedIn = await auth.isLoggedIn();
    authStore.setLoginStatus(isLoggedIn);
    if (!isLoggedIn) router.push({ name: "Login" });
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (newValue) {
      await initConnection();
      router.push({ name: "Send" });
    } else router.push({ name: "Login" });
  }
);

onMounted(initAuth);
</script>

<template>
  <main class="bg-black h-[100vh]">
    <FullScreenLoader v-if="loaderStore.show" />
    <router-view> </router-view>
  </main>
</template>
