<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useLoaderStore from "@/stores/loader";
import AppHeader from "@/components/layout/AppHeader.vue";
import LandingDescription from "@/components/LandingDescription.vue";
import { socialLogins } from "@/constants/logins";
import { useToast } from "vue-toastification";
import { isValidEmail } from "@/utils/validation";
import { toUnicode } from "punycode";
import useAuthStore from "@/stores/auth";
import useUserStore from "@/stores/user";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createConfig, getAccount } from "@wagmi/core";
import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";

const chains = [arbitrum, mainnet, polygon];
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);

const arcanaAuth = useArcanaAuth();
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const loaderStore = useLoaderStore();
const passwordlessEmailId = ref("");
const toast = useToast();

const query = route.query;
const verifier = query.verifier;
const verifierId = query.verifierId;
const isWhitelistedLogin = computed(() => {
  return route.query.user !== undefined;
});

const isValidPasswordlessEmail = computed(() => {
  return (
    passwordlessEmailId.value.length > 0 &&
    isValidEmail(passwordlessEmailId.value)
  );
});

async function socialLogin(type: string) {
  try {
    loaderStore.showLoader("Logging in...");
    await arcanaAuth.getAuthInstance().loginWithSocial(type);
  } catch (e: any) {
    toast.error(e);
  } finally {
    loaderStore.hideLoader();
  }
}

async function passwordlessLogin() {
  try {
    loaderStore.showLoader(
      `Click on the verification mail sent to ${passwordlessEmailId.value}...`
    );
    await arcanaAuth
      .getAuthInstance()
      .loginWithLink(toUnicode(passwordlessEmailId.value));
  } catch (e: any) {
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

async function onConnectToWalletConnect() {
  const accountDetails = getAccount();
  const isConnected = accountDetails.isConnected;
  if (!isConnected) {
    web3modal.subscribeModal(async () => {
      const accountDetails = getAccount();
      if (accountDetails.isConnected) onLoginWalletConnected(accountDetails);
    });
    web3modal.openModal();
  } else onLoginWalletConnected(accountDetails);
}

async function onLoginWalletConnected(accountDetails) {
  authStore.provider = await accountDetails.connector?.getProvider();
  authStore.setUserInfo({
    address: accountDetails.address,
    loginType: "null",
    id: "null",
  });
  authStore.isLoggedIn = true;
  authStore.loggedInWith = "walletconnect";
  userStore.address = accountDetails.address;
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
            <section
              class="space-y-3 w-full flex flex-col items-start"
              v-if="isWhitelistedLogin"
            >
              <span class="text-xs text-philippine-gray">Connect Wallet</span>
              <div class="flex flex-col space-y-2 w-full">
                <button
                  class="btn btn-login flex w-full justify-center items-center space-x-2"
                  @click="onConnectToWalletConnect"
                >
                  <img
                    src="@/assets/images/icons/wallet-connect.svg"
                    alt="metamask"
                    class="w-4"
                  />
                  <span class="text-sm font-semibold text-white">
                    Wallet Connect
                  </span>
                </button>
              </div>
            </section>
            <section class="space-y-3 w-full flex flex-col items-start">
              <span class="text-xs text-philippine-gray">Email ID</span>
              <form
                class="flex justify-center items-center w-full bg-dark-charcoal px-2.5 rounded-md"
                @submit.prevent="passwordlessLogin"
              >
                <input
                  type="email"
                  class="flex-1 bg-transparent input text-white"
                  v-model.trim="passwordlessEmailId"
                />
                <button
                  class="flex items-center justify-center"
                  :disabled="!isValidPasswordlessEmail"
                >
                  <img
                    src="@/assets/images/icons/arrow-right.svg"
                    alt="email login"
                  />
                </button>
              </form>
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
