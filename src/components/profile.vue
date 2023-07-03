<script setup lang="ts">
import { toRefs } from "vue";
import useAuthStore from "@/stores/auth";
import CopyIcon from "@/assets/images/icons/copy.svg";
import { useToast } from "vue-toastification";
import useArcanaAuth from "@/use/arcanaAuth";

const authStore = useAuthStore();
const { userInfo } = toRefs(authStore);
const arcanaAuth = useArcanaAuth();

const toast = useToast();

function splitWalletAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function copyToClipboard() {
  const el = document.createElement("textarea");
  el.value = userInfo.value.address;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  toast.success("Wallet address copied to clipboard");
}

function logout() {
  arcanaAuth.getAuthInstance().logout();
}
</script>

<template>
  <div
    class="form-card p-0 space-y-[1px] w-80 divide-y-[1px] divide-philippine-gray"
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
            splitWalletAddress(userInfo.address)
          }}</span>
          <button @click.prevent="copyToClipboard">
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
