<script setup lang="ts">
import { toRefs, watch } from "vue";
import SendForm from "@/components/send/sendForm.vue";
import useSocketConnection from "@/use/socketConnection";
import useAuthStore from "@/stores/auth";
import useSendStore from "@/stores/send";
import useLoaderStore from "@/stores/loader";
import chainList from "@/constants/chainList.ts";

const socketConnection = useSocketConnection();
const authStore = useAuthStore();
const sendStore = useSendStore();
const loaderStore = useLoaderStore();
const { isSocketLoggedIn } = toRefs(authStore);

async function fetchSupportedChains() {
  loaderStore.showLoader("fetching chains...");
  const { chains } = await socketConnection.sendMessage(7);
  sendStore.setSupportedChains(
    chains.map((chain) => {
      return {
        ...chain,
        blockchain: chainList[chain.chain_id].block_chain,
      };
    })
  );
  loaderStore.hideLoader();
}

watch(isSocketLoggedIn, (newValue) => {
  if (newValue) fetchSupportedChains();
});
</script>

<template>
  <div class="flex flex-col justify-center items-center p-12 space-y-10">
    <SendForm />
  </div>
</template>
