<script setup lang="ts">
import { toRefs } from "vue";
import useAuthStore from "@/stores/auth";
import CopyIcon from "@/assets/images/icons/copy.svg";
import { useToast } from "vue-toastification";
import useArcanaAuth from "@/use/arcanaAuth";
import { truncateAddress } from "@/utils/truncateAddress";

import copyToClipboard from "@/utils/copyToClipboard";
import useWalletConnect from "@/use/walletconnect";
import useSocketConnection from "@/use/socketConnection";
import useSendStore from "@/stores/send";
import useRewardsStore from "@/stores/rewards";
import useNotificationStore from "@/stores/notification";

const authStore = useAuthStore();
const { userInfo }: { userInfo: any } = toRefs(authStore);
const arcanaAuth = useArcanaAuth();
const walletConnect = useWalletConnect();
const socketConnection = useSocketConnection();
const sendStore = useSendStore();
const rewardsStore = useRewardsStore();
const notificationStore = useNotificationStore();

const toast = useToast();

async function handleCopy() {
  await copyToClipboard(userInfo.value.address);
  toast.success("Wallet address copied to clipboard");
}

function logout() {
  if (authStore.loggedInWith === "walletconnect") {
    walletConnect.disconnect();
    socketConnection.disconnect();
    authStore.setSocketLoginStatus(false);
    authStore.setLoginStatus(false);
  } else arcanaAuth.getAuthInstance().logout();
  sendStore.resetUserInput();
  rewardsStore.$reset();
  notificationStore.$reset();
}
</script>

<template>
  <div
    class="form-card p-0 space-y-[1px] w-screen lg:max-w-xs divide-y-[1px] divide-philippine-gray"
  >
    <div class="w-full p-4 flex justify-start">
      <span class="text-base uppercase font-bold text-left">Profile</span>
    </div>
    <div class="space-y-4 w-full p-4">
      <div class="flex flex-col">
        <span class="text-philippine-gray text-xs text-left">Name</span>
        <span class="text-sm text-left">{{ userInfo.name }}</span>
      </div>
      <div class="flex flex-col justify-start">
        <span class="text-philippine-gray text-xs text-left">Email ID</span>
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
            <img :src="CopyIcon" alt="copy" />
          </button>
        </div>
      </div>
      <div class="w-full" @click="logout">
        <button class="btn btn-submit-secondary text-sm w-full">Logout</button>
      </div>
    </div>
  </div>
</template>
