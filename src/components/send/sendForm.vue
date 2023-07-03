<script setup lang="ts">
import { toRefs, watch, ref, computed } from "vue";
import sendVia from "@/constants/sendVia";
import useSendStore from "@/stores/send";
import useAuthStore from "@/stores/auth";
import useLoaderStore from "@/stores/loader";
import { getAccountBalance } from "@/service/ankr.service.ts";
import useArcanaAuth from "@/use/arcanaAuth";
import { nativeTokenTransfer } from "@/service/send.service.ts";
import { getBytes } from "ethers";
import useSocketConnection from "@/use/socketConnection";

const sendStore = useSendStore();
const authStore = useAuthStore();
const loadStore = useLoaderStore();
const chainAssets = ref([]);
const tokenBalance = ref(0);
const arcanaAuth = useArcanaAuth();
const socketConnection = useSocketConnection();

const { userInput, supportedChains } = toRefs(sendStore);

function getSelectedChainInfo(chainId) {
  return supportedChains.value.find((chain) => chain.chain_id === chainId);
}

function getSelectedAssets(tokenSymbol, tokenType) {
  return chainAssets.value.find(
    (asset) =>
      asset.tokenSymbol === tokenSymbol && asset.tokenType === tokenType
  );
}

async function fetchAssets(chainId) {
  loadStore.showLoader("fetching assets...");
  const walletAddress = authStore.walletAddress;
  const chain = getSelectedChainInfo(chainId);
  const { result } = await getAccountBalance(walletAddress, chain.blockchain);
  chainAssets.value = result.assets;
  loadStore.hideLoader();
}

function messageArcana(
  hash: string,
  to: string,
  fromEmail: string,
  toEmail: string,
  chainId: number
) {
  const message = {
    hash: Buffer.from(getBytes(hash)),
    chainId,
    to: Buffer.from(getBytes(to)),
    fromEmail,
    toEmail,
  };

  return socketConnection.sendMessage(1, message);
}

async function proceed() {
  loadStore.showLoader("sending...");
  try {
    const senderPublicKey = await arcanaAuth
      .getAuthInstance()
      .getPublicKey(userInput.value.recipientId);
    const arcanaProvider = arcanaAuth.getProvider();
    const amount = userInput.value.amount;
    const chainId = userInput.value.chain;
    const { hash, to } = await nativeTokenTransfer(
      senderPublicKey,
      arcanaProvider,
      amount
    );
    const toEmail = userInput.value.recipientId;
    const fromEmail = authStore.userInfo.email;
    const response = await messageArcana(hash, to, fromEmail, toEmail, chainId);
    console.log({ response });
  } catch (error) {
    console.log(error);
  } finally {
    loadStore.hideLoader();
  }
}

watch(
  () => userInput.value.chain,
  async (selectedChainId) => {
    userInput.value.token = "";
    await arcanaAuth.switchChain(selectedChainId);
    fetchAssets(selectedChainId);
  }
);

watch(
  () => userInput.value.token,
  (selectedToken) => {
    if (selectedToken) {
      const [tokenSymbol, tokenType] = selectedToken.split("-");
      tokenBalance.value = getSelectedAssets(tokenSymbol, tokenType).balance;
    } else tokenBalance.value = 0;
  }
);

const disableTokenInput = computed(() => {
  return !userInput.value.chain && !chainAssets.value.length;
});

const disableAmountInput = computed(() => {
  return !userInput.value.token;
});

const disableSubmit = computed(() => {
  return (
    !userInput.value.amount ||
    !userInput.value.chain ||
    !userInput.value.medium ||
    !userInput.value.recipientId ||
    !userInput.value.token
  );
});
</script>

<template>
  <div
    class="w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase">Transaction Details</h1>
    <div class="space-y-1">
      <h2 class="text-xs font-medium">Send Via</h2>
      <div class="flex items-center space-x-2">
        <div
          v-for="medium in sendVia"
          :key="medium.value"
          @click="userInput.medium = medium.value"
          class="border-1 border-jet p-1.5 rounded-full"
          :class="{ 'border-white': userInput.medium === medium.value }"
        >
          <img :src="medium.icon" :alt="medium.value" />
        </div>
      </div>
    </div>
    <form class="space-y-4">
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Recipient's ID</label>
        <input class="input" v-model="userInput.recipientId" />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Chain</label>
        <select class="input" name="chains" v-model="userInput.chain">
          <option
            id="chains"
            v-for="chain in supportedChains"
            :key="chain.chain_id"
            :value="chain.chain_id"
          >
            {{ chain.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Token</label>
        <select
          class="input"
          name="assets"
          v-model="userInput.token"
          :disabled="disableTokenInput"
        >
          <option
            id="assets"
            v-for="asset in chainAssets"
            :key="`${asset.tokenSymbol}-${asset.tokenType}`"
            :value="`${asset.tokenSymbol}-${asset.tokenType}`"
          >
            {{ `${asset.tokenSymbol} - ${asset.tokenType}` }}
          </option>
        </select>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between">
          <label class="text-xs">Amount</label>
          <span v-if="userInput.token" class="text-xs"
            >Balance: {{ tokenBalance }}</span
          >
        </div>
        <input
          class="input"
          v-model="userInput.amount"
          :disabled="disableAmountInput"
        />
      </div>
      <input
        @click.prevent="proceed"
        type="submit"
        value="Proceed"
        class="w-full btn btn-submit"
        :disabled="disableSubmit"
        :class="{ 'opacity-50': disableSubmit }"
      />
    </form>
  </div>
</template>
