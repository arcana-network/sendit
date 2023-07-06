<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import arcanaLogo from "@/assets/images/arcana.svg";
import { onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import useLoaderStore from "@/stores/loader";
import AppHeader from "@/components/layout/AppHeader.vue";

const arcanaAuth = useArcanaAuth();
const router = useRouter();
const loaderStore = useLoaderStore();

async function connectToArcana() {
  await arcanaAuth.connect();
}

async function loginAutomatically(verifier: string, verifierId: string) {
  loaderStore.showLoader("Logging in...");
  try {
    const authInstance = arcanaAuth.getAuthInstance();
    if (verifier === "passwordless") {
      await authInstance.loginWithLink(verifierId);
    } else {
      await authInstance.loginWithSocial(verifier);
    }
    await authInstance.isLoggedIn();
  } catch (error) {
    console.error({ error });
    loaderStore.hideLoader();
  }
}

onMounted(async () => {
  const query = router.currentRoute.value.query;
  const { verifier, verifierId } = query;
  if (verifier) {
    await loginAutomatically(verifier as string, verifierId as string);
  }
});

onUnmounted(() => {
  loaderStore.hideLoader();
});

watch(
  () => loaderStore.show,
  (newValue) => {
    if (!newValue) loaderStore.showLoader("Logging in...");
  }
);
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <AppHeader hide-nav hide-user-data />
    <div class="flex container flex-grow">
      <section class="w-1/2 flex flex-col justify-center items-center relative">
        <section class="min-w-96 space-y-4 flex flex-col items-center">
          <header class="space-y-0.5 text-center">
            <h1 class="text-3.5xl text-white font-bold">Welcome to SendIt</h1>
            <p class="text-sm text-philippine-gray">
              Sign-in using any of these methods to get started
            </p>
          </header>
          <section class="space-y-0.5 w-full">
            <div class="flex flex-col space-y-2">
              <button
                class="btn btn-login flex justify-center items-center space-x-2"
                @click="connectToArcana"
              >
                <span>Connect with</span>
                <img :src="arcanaLogo" alt="Arcana" class="w-20" />
              </button>
            </div>
          </section>
        </section>
      </section>
      <section class="space-y-3 w-1/2 p-7.5">
        <div class="bg-eerie-black p-10 h-full space-y-3 rounded-2xl">
          <p class="text-3xl">
            Send Digital Assets to anyone even if they don’t have a wallet!
          </p>
          <p class="text-sm text-philippine-gray">
            Send digital assets over email, GitHub, Twitter or many other
            channels in a cryptographically secure way and earn rewards while
            doing it
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
