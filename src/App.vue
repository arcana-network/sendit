<script setup lang="ts">
import { onMounted } from "vue";
import useArcanaAuth from "./use/arcanaAuth";
import { userLoaderStore } from "./store/loader";
import FullScreenLoader from "./components/fullScreenLoader.vue";
import { useRouter } from "vue-router";

const loaderStore = userLoaderStore();
const router = useRouter();

async function initAuth() {
  loaderStore.showLoader("initializing...");
  try {
    const auth = useArcanaAuth();
    await auth.init();
    router.push({ name: "Login" });
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
