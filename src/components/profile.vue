<script setup lang="ts">
import { toRefs } from "vue";
import useAuthStore from "@/stores/auth";
import { useToast } from "vue-toastification";
import useArcanaAuth from "@/use/arcanaAuth";
import { truncateAddress } from "@/utils/truncateAddress";

import copyToClipboard from "@/utils/copyToClipboard";
import useWalletConnect from "@/use/walletconnect";
import { useConnection } from "@/stores/connection";
import useSendStore from "@/stores/send";
import useRewardsStore from "@/stores/rewards";
import useNotificationStore from "@/stores/notification";
// import useOKXWallet from "@/use/okxwallet";

// const emit = defineEmits(["invite"]);
const authStore = useAuthStore();
const { userInfo }: { userInfo: any } = toRefs(authStore);
const arcanaAuth = useArcanaAuth();
const walletConnect = useWalletConnect();
// const okxWallet = useOKXWallet();
const conn = useConnection();
const sendStore = useSendStore();
const rewardsStore = useRewardsStore();
const notificationStore = useNotificationStore();

const toast = useToast();

async function handleCopy() {
  await copyToClipboard(userInfo.value.address);
  toast.success("Wallet address copied");
}

// function getCurrentLocationUrl() {
//   return window.location.origin;
// }

// async function handleCopyRef() {
//   await copyToClipboard(
//     `${getCurrentLocationUrl()}/app/?r=${userInfo.value.address}`
//   );
//   toast.success("Referral Link copied");
// }

function logout() {
  if (authStore.loggedInWith === "walletconnect") {
    walletConnect.disconnect();
    conn.closeSocket();
    authStore.setLoginStatus(false);
  } else if (authStore.loggedInWith === "okxwallet") {
    conn.closeSocket();
    authStore.setLoginStatus(false);
  } else arcanaAuth.getAuthInstance().logout();
  sendStore.resetUserInput();
  rewardsStore.$reset();
  notificationStore.$reset();
}
</script>

<template>
  <div
    class="form-card p-0 space-y-[1px] lg:w-screen lg:max-w-xs divide-y-[1px] divide-jet"
  >
    <div class="w-full p-4 flex justify-start">
      <span class="text-base uppercase font-bold text-left">Profile</span>
    </div>
    <div class="space-y-4 w-full p-4">
      <div class="flex flex-col" v-if="userInfo.name">
        <span class="text-philippine-gray text-xs text-left">Name</span>
        <span class="text-sm text-left">{{ userInfo.name }}</span>
      </div>
      <div class="flex flex-col justify-start" v-if="userInfo.email">
        <span class="text-philippine-gray text-xs text-left"
          >Email Address</span
        >
        <span class="text-sm text-left">{{ userInfo.email }}</span>
      </div>
      <div class="flex flex-col justify-start">
        <span class="text-philippine-gray text-xs text-left"
          >Account Address</span
        >
        <div class="flex space-x-1">
          <span class="text-sm text-left overflow-hidden">{{
            truncateAddress(userInfo.address)
          }}</span>
          <button @click.stop="handleCopy">
            <img src="@/assets/images/icons/copy.svg" alt="copy" />
          </button>
        </div>
      </div>
      <!-- <div class="flex flex-col justify-start">
        <span class="text-philippine-gray text-xs text-left"
          >Referral Link</span
        >
        <div class="flex space-x-2 items-center">
          <span
            class="text-sm text-left ellipsis w-[70%]"
            @click.stop="handleCopyRef"
            >{{ getCurrentLocationUrl() }}/app/?r={{ userInfo.address }}</span
          >
          <button @click.stop="handleCopyRef">
            <img src="@/assets/images/icons/copy.svg" alt="copy" />
          </button>
          <button @click.stop="emit('invite')">
            <img
              src="@/assets/images/icons/user-add.svg"
              class="h-[24px] w-[24px]"
              alt="Invite"
            />
          </button>
        </div>
      </div> -->
      <div class="w-full" @click="logout">
        <button class="btn btn-submit-secondary text-sm w-full">Logout</button>
      </div>
    </div>
  </div>
</template>
