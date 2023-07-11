<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import arcanaLogo from "@/assets/images/arcana.svg";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import useLoaderStore from "@/stores/loader";
import AppHeader from "@/components/layout/AppHeader.vue";
import LandingDescription from "@/components/LandingDescription.vue";

const arcanaAuth = useArcanaAuth();
const route = useRoute();
const loaderStore = useLoaderStore();

const query = route.query;
const verifier = query.verifier;
const verifierId = query.verifierId;

async function connectToArcana() {
  await arcanaAuth.connect();
}

async function loginAutomatically(verifier: string, verifierId: string) {
  loaderStore.showLoader("Logging in...");
  try {
    const authInstance = arcanaAuth.getAuthInstance();
    if (verifier === "passwordless") {
      loaderStore.showLoader(
        `Click on the verification mail sent to ${verifierId}...`
      );
      await authInstance.loginWithLink(verifierId);
    } else {
      await authInstance.loginWithSocial(verifier);
    }
    await authInstance.isLoggedIn();
  } catch (error) {
    console.error({ error });
  } finally {
    loaderStore.hideLoader();
  }
}

onMounted(async () => {
  if (verifier) {
    await loginAutomatically(
      verifier as unknown as string,
      verifierId as string
    );
  }
});
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <AppHeader hide-nav hide-user-data />
    <div
      class="flex h-full container flex-grow max-lg:flex-col max-lg:gap-12 p-4 max-lg:py-12"
    >
      <div class="flex flex-col items-center justify-center w-full lg:w-1/2">
        <section
          class="w-full flex flex-col md:justify-center md:items-center md:text-center relative"
        >
          <section class="w-full max-w-[360px] mx-auto space-y-4 flex flex-col">
            <header class="flex flex-col gap-1 text-center max-md:text-left">
              <h1 class="text-[1.5rem] lg:text-[2rem] text-white font-bold">
                Welcome to SendIt
              </h1>
              <p
                class="text-sm lg:text-base text-philippine-gray max-w-[280px] md:text-center md:mx-auto"
              >
                Sign-in using any of these methods to get started
              </p>
            </header>
            <section class="space-y-0.5 w-full">
              <div class="flex flex-col space-y-2 w-full">
                <button
                  class="btn btn-login flex w-full justify-center items-center space-x-2"
                  @click="connectToArcana"
                >
                  <span>Connect with</span>
                  <img :src="arcanaLogo" alt="Arcana" class="w-20" />
                </button>
              </div>
            </section>
          </section>
        </section>
        <div class="mt-20 text-sm">
          <RouterLink :to="{ name: 'Waitlist' }"
            >Need access? Join the Waitlist</RouterLink
          >
        </div>
      </div>
      <LandingDescription class="flex-grow" />
    </div>
  </div>
</template>
