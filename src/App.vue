<script setup lang="ts">
import { onMounted } from "vue";
import useArcanaAuth from "./use/arcanaAuth";
import useSocketConnection from "./use/socketConnection";
import { userLoaderStore } from "./stores/loader";
import FullScreenLoader from "./components/fullScreenLoader.vue";
import { useRouter } from "vue-router";

const loaderStore = userLoaderStore();
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
    if (await auth.isLoggedIn()) {
      await initConnection();
      router.push({ name: "Send" });
    } else router.push({ name: "Login" });
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

onMounted(initAuth);
</script>

<template>
  <main class="bg-black h-[100vh]">
    <FullScreenLoader v-if="loaderStore.show" />
    <router-view> </router-view>
  </main>
</template>
