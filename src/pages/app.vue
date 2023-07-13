<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useArcanaAuth from "@/use/arcanaAuth";
import useSocketConnection from "@/use/socketConnection";
import useLoaderStore from "@/stores/loader";
import FullScreenLoader from "@/components/fullScreenLoader.vue";
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "@/stores/auth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";
import { useToast } from "vue-toastification";
import useNotificationStore from "@/stores/notification";
import Overlay from "@/components/overlay.vue";
import useMetamask from "@/use/metamask";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const auth = useArcanaAuth();
const socketConnection = useSocketConnection();
const rewardsStore = useRewardsStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const toast = useToast();
const isNotWhitelisted = ref(false);
const { connectMetamask } = useMetamask();

async function initAuth() {
  loaderStore.showLoader("Initializing...");
  try {
    await auth.init();
    authStore.provider = auth.getProvider();
    authStore.provider.on("connect", onWalletConnect);
    authStore.setAuthInitialized(true);
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) authStore.setLoginStatus(true);
    else router.push({ name: "Login" });
  } catch (error) {
    toast.error(error as string);
  } finally {
    loaderStore.hideLoader();
  }
}

async function initSocketConnect() {
  const account = {
    verifier: authStore.userInfo.loginType,
    verifier_id: authStore.userInfo.id,
  };
  await socketConnection.init(
    // @ts-ignore
    authStore.provider,
    account,
    () => {
      authStore.setSocketLoginStatus(true);
    },
    () => {
      isNotWhitelisted.value = true;
      loaderStore.hideLoader();
    }
  );
}

async function getUserInfo() {
  if (authStore.loggedInWith === "metamask") {
    const data = await connectMetamask();
    authStore.provider = data.provider;
    authStore.setUserInfo({
      address: data.accounts[0],
      loginType: "null",
      id: "null",
    });
    userStore.address = data.accounts[0];
  } else {
    authStore.provider = auth.getProvider();
    const userInfo = await auth.getUser();
    authStore.setUserInfo(userInfo);
    userStore.address = userInfo.address;
  }
}

async function onWalletConnect() {
  loaderStore.showLoader("Connecting...");
  authStore.setLoginStatus(true);
  await getUserInfo();
  await initSocketConnect();
  rewardsStore.fetchRewards(userStore.address);
  userStore.fetchUserPointsAndRank();
  notificationStore.getNotifications();
  if (authStore.loggedInWith !== "metamask") {
    authStore.provider.on("disconnect", onWalletDisconnect);
  }
  loaderStore.hideLoader();
}

async function onWalletDisconnect() {
  socketConnection.disconnect();
  authStore.setSocketLoginStatus(false);
  authStore.setLoginStatus(false);
}

onMounted(initAuth);

watch(
  () => authStore.isLoggedIn,
  async (newValue) => {
    if (!newValue) {
      router.push({ name: "Login" });
    } else if (route.name === "Login") {
      if (authStore.loggedInWith === "metamask") {
        await onWalletConnect();
      }
      loaderStore.hideLoader();
      router.push({ name: "Send" });
    }
  }
);

const showFullScreenLoader = computed(() => {
  return (
    loaderStore.show || (!authStore.isSocketLoggedIn && authStore.isLoggedIn)
  );
});

async function handleNoAccessBack() {
  if (authStore.loggedInWith !== "metamask") {
    await auth.getAuthInstance().logout();
  } else {
    onWalletDisconnect();
  }
  isNotWhitelisted.value = false;
}
</script>

<template>
  <main class="text-white h-full min-h-screen">
    <FullScreenLoader v-if="showFullScreenLoader" />
    <RouterView v-if="authStore.isAuthSDKInitialized"> </RouterView>
    <Overlay v-if="isNotWhitelisted">
      <div
        class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
      >
        <div class="flex flex-col gap-5">
          <div class="flex flex-col justify-center items-center gap-4">
            <img
              src="@/assets/images/icons/exclamation.svg"
              alt="success"
              class="w-[50px] aspect-square"
            />
            <span class="font-[500] text-[20px] uppercase font-bold"
              >No Access</span
            >
            <span
              class="text-xs text-philippine-gray max-w-[320px] text-center"
            >
              The email ID or Twitter handle you used to sign up has not been
              whitelisted. Would you like to join the waitlist?
            </span>
          </div>
          <div class="flex justify-center">
            <button
              class="uppercase bg-white rounded-[5px] text-black text-sm font-[500] px-8 py-2 w-full"
              @click.stop="router.push({ name: 'Waitlist' })"
            >
              Join the Waitlist
            </button>
          </div>
          <div class="flex justify-center pb-2 pt-1">
            <button
              class="bg-transparent text-sm font-[500]"
              @click.stop="handleNoAccessBack"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  </main>
</template>
