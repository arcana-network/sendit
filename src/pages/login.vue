<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import useLoaderStore from "@/stores/loader";
import AppHeader from "@/components/layout/AppHeader.vue";
import LandingDescription from "@/components/LandingDescription.vue";
import { socialLogins } from "@/constants/logins";
import { useToast } from "vue-toastification";
import { isValidEmail } from "@/utils/validation";
import useAuthStore from "@/stores/auth";
import useUserStore from "@/stores/user";
import useWalletConnect from "@/use/walletconnect";
import type { GetAccountResult, PublicClient } from "@wagmi/core";
import { normaliseEmail } from "@/utils/normalise";

const arcanaAuth = useArcanaAuth();
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const loaderStore = useLoaderStore();
const passwordlessEmailId = ref("");
const toast = useToast();
const walletConnect = useWalletConnect();

const query = route.query;
const verifier = query.verifier as string;
const verifierId = query.verifierId as string;

if (verifier === "passwordless" && verifierId) {
  passwordlessEmailId.value = verifierId;
}

const socialLoginsFiltered = computed(() => {
  if (verifier && verifierId) {
    return socialLogins.filter((login) => {
      return (
        login.value === verifier ||
        (login.value === "google" && verifier === "passwordless")
      );
    });
  }
  return socialLogins;
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
    authStore.provider = arcanaAuth.getProvider();
    authStore.isLoggedIn = true;
    authStore.loggedInWith = "";
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
      .loginWithLink(normaliseEmail(passwordlessEmailId.value));
    authStore.provider = arcanaAuth.getProvider();
    authStore.isLoggedIn = true;
    authStore.loggedInWith = "";
  } catch (e: any) {
    toast.error(e);
  } finally {
    loaderStore.hideLoader();
  }
}

async function onConnectToWalletConnect() {
  const accountDetails = walletConnect.getAccount();
  const isConnected = accountDetails.isConnected;
  if (!isConnected) {
    walletConnect.web3modal.subscribeModal(async () => {
      const accountDetails = walletConnect.getAccount();
      if (accountDetails.isConnected) onLoginWalletConnected(accountDetails);
    });
    walletConnect.web3modal.openModal();
  } else onLoginWalletConnected(accountDetails);
}

async function onLoginWalletConnected(
  accountDetails: GetAccountResult<PublicClient>
) {
  authStore.provider = await accountDetails.connector?.getProvider();
  authStore.setUserInfo({
    address: accountDetails.address as string,
    loginType: "null",
    id: accountDetails.address,
  });
  authStore.isLoggedIn = true;
  authStore.loggedInWith = "walletconnect";
  userStore.address = accountDetails.address as string;
}
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <!-- <div class="bg-[#7fdca4] p-2 text-center text-[#212123] font-[500] text-sm">
      Passwordless email login is experiencing disruption. Please use Google
      login if you have a Google email.
    </div> -->
    <AppHeader hide-nav hide-user-data />
    <div
      class="flex h-full justify-center items-center container flex-grow max-lg:flex-col max-lg:gap-12 p-4 max-lg:py-12"
    >
      <div
        class="flex flex-col flex-grow items-center justify-center w-full lg:w-1/2"
      >
        <section
          class="w-full flex flex-col md:justify-center md:items-center md:text-center relative"
        >
          <section class="w-full max-w-[360px] mx-auto space-y-6 flex flex-col">
            <header class="flex flex-col gap-1 text-center max-md:text-left">
              <h1 class="text-[1.5rem] lg:text-[2rem] text-white font-bold">
                Welcome to SendIt
              </h1>
              <p
                v-if="verifier && verifierId"
                class="text-xs lg:text-base text-philippine-gray max-w-[280px] md:text-center md:mx-auto"
              >
                Sign-in using the below method to get started
              </p>
              <p
                v-else
                class="text-xs lg:text-base text-philippine-gray max-w-[280px] md:text-center md:mx-auto"
              >
                Sign-in using any of these methods to get started
              </p>
            </header>
            <section class="space-y-3 w-full flex flex-col items-start">
              <span v-if="!verifier" class="text-xs text-philippine-gray"
                >Social Login</span
              >
              <div
                class="flex flex-col space-y-2 w-full"
                v-for="login in socialLoginsFiltered"
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
              v-if="!verifier && !verifierId"
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
                    Connect Wallet
                  </span>
                </button>
              </div>
            </section>
            <section
              v-if="!verifier || verifier === 'passwordless'"
              class="space-y-3 w-full flex flex-col items-start"
            >
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
                  :disabled="!isValidPasswordlessEmail || loaderStore.show"
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
      </div>
      <LandingDescription class="flex-grow" />
    </div>
  </div>
</template>
