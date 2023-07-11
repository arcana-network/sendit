<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useLoaderStore from "@/stores/loader";
import AppHeader from "@/components/layout/AppHeader.vue";
import LandingDescription from "@/components/LandingDescription.vue";
import { socialLogins, walletLogins } from "@/constants/logins";
import { useToast } from "vue-toastification";

const arcanaAuth = useArcanaAuth();
const route = useRoute();
const loaderStore = useLoaderStore();
const passwordlessEmailId = ref("");
const toast = useToast();

const query = route.query;
const verifier = query.verifier;
const verifierId = query.verifierId;

async function connectToArcana() {
  await arcanaAuth.connect();
}

async function socialLogin(type: string) {
  try {
    loaderStore.showLoader("Logging in...");
    await arcanaAuth.getAuthInstance().loginWithSocial(type);
  } catch (e) {
    toast.error(e);
  } finally {
    loaderStore.hideLoader();
  }
}

async function passwordlessLogin() {
  try {
    loaderStore.showLoader("Logging in...");
    await arcanaAuth.getAuthInstance().loginWithLink(passwordlessEmailId.value);
  } catch (e) {
    toast.error(e);
  } finally {
    loaderStore.hideLoader();
  }
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
          <section class="w-full max-w-[360px] mx-auto space-y-6 flex flex-col">
            <header class="flex flex-col gap-1 text-center max-md:text-left">
              <h1 class="text-[1.5rem] lg:text-[2rem] text-white font-bold">
                Welcome to SendIt
              </h1>
              <p
                class="text-xs lg:text-base text-philippine-gray max-w-[280px] md:text-center md:mx-auto"
              >
                Sign-in using any of these methods to get started
              </p>
            </header>
            <section class="space-y-3 w-full flex flex-col items-start">
              <span class="text-xs text-philippine-gray">Social Login</span>
              <div
                class="flex flex-col space-y-2 w-full"
                v-for="login in socialLogins"
                :key="login.value"
              >
                <button
                  class="btn btn-login flex w-full justify-center items-center space-x-2"
                  @click="socialLogin(login.value)"
                >
                  <img :src="login.icon" :alt="login.label" class="w-4" />
                  <span class="text-sm font-semibold text-white">
                    {{ login.label }}
                  </span>
                </button>
              </div>
            </section>
            <section class="space-y-3 w-full flex flex-col items-start">
              <span class="text-xs text-philippine-gray">Connect Wallet</span>
              <div
                class="flex flex-col space-y-2 w-full"
                v-for="login in walletLogins"
                :key="login.value"
              >
                <button
                  class="btn btn-login flex w-full justify-center items-center space-x-2"
                  @click="connectToArcana"
                >
                  <img :src="login.icon" :alt="login.label" class="w-4" />
                  <span class="text-sm font-semibold text-white">
                    {{ login.label }}
                  </span>
                </button>
              </div>
            </section>
            <section class="space-y-3 w-full flex flex-col items-start">
              <span class="text-xs text-philippine-gray">Email ID</span>
              <div
                class="flex justify-center items-center space-y-2 w-full bg-dark-charcoal px-2.5 rounded-md"
              >
                <input
                  type="email"
                  class="flex-1 bg-transparent input text-white"
                  v-model="passwordlessEmailId"
                />
                <button
                  @click="passwordlessLogin"
                  :disabled="!passwordlessEmailId.length"
                >
                  <img
                    src="@/assets/images/icons/arrow-right.svg"
                    alt="email login"
                  />
                </button>
              </div>
            </section>
          </section>
        </section>
        <div class="mt-20 text-sm">
          Need access?
          <RouterLink :to="{ name: 'Waitlist' }">Join the Waitlist</RouterLink>
        </div>
      </div>
      <LandingDescription class="flex-grow" />
    </div>
  </div>
</template>
