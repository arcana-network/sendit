<script setup lang="ts">
import { toRefs, watch, ref, computed, type Ref } from "vue";
import sendVia from "@/constants/sendVia";
import useSendStore from "@/stores/send";
import useAuthStore from "@/stores/auth";
import useLoaderStore from "@/stores/loader";
import { getAccountBalance } from "@/services/ankr.service.ts";
import useArcanaAuth from "@/use/arcanaAuth";
import {
  nativeTokenTransfer,
  erc20TokenTransfer,
} from "@/services/send.service.ts";
import { getBytes } from "ethers";
import useSocketConnection from "@/use/socketConnection";
import { useToast } from "vue-toastification";

const emits = defineEmits(["transaction-successful"]);

const sendStore = useSendStore();
const authStore = useAuthStore();
const loadStore = useLoaderStore();
const chainAssets: Ref<any[]> = ref([]);
const tokenBalance = ref(0);
const arcanaAuth = useArcanaAuth();
const socketConnection = useSocketConnection();
const toast = useToast();

const {
  userInput,
  supportedChains,
}: { userInput: Ref<any>; supportedChains: Ref<any[]> } = toRefs(sendStore);

function getSelectedChainInfo(chainId) {
  //@ts-ignore
  return supportedChains.value.find((chain) => chain.chain_id === chainId);
}

function getSelectedAssets(tokenSymbol, tokenType) {
  return chainAssets.value.find(
    (asset) =>
      //@ts-ignore
      asset.tokenSymbol === tokenSymbol && asset.tokenType === tokenType
  );
}

async function fetchAssets(chainId) {
  loadStore.showLoader("fetching assets...");
  try {
    const walletAddress = authStore.walletAddress;
    const chain = getSelectedChainInfo(chainId);
    //@ts-ignore
    const { result } = await getAccountBalance(walletAddress, chain.blockchain);
    chainAssets.value = result.assets;
  } catch (error) {
    console.log(error);
  } finally {
    loadStore.hideLoader();
  }
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
    chain_id: chainId,
    to: Buffer.from(getBytes(to)),
    from_id: fromEmail,
    from_verifier: "passwordless",
    to_id: toEmail,
    to_verifier: "passwordless",
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
    const [tokenSymbol, tokenType] = userInput.value.token.split("-");
    const asset = getSelectedAssets(tokenSymbol, tokenType);
    const tx =
      tokenType === "NATIVE"
        ? await nativeTokenTransfer(senderPublicKey, arcanaProvider, amount)
        : await erc20TokenTransfer(
            senderPublicKey,
            arcanaProvider,
            amount,
            //@ts-ignore
            asset.contractAddress
          );
    const { hash, to } = tx;
    const toEmail = userInput.value.recipientId;
    //@ts-ignore
    const fromEmail = authStore.userInfo.email;
    //@ts-ignore
    const sendRes = await messageArcana(hash, to, fromEmail, toEmail, chainId);
    toast.success("Transaction Successful");
    emits("transaction-successful", sendRes);
  } catch (error) {
    console.log(error);
    toast.error(error as string);
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
      //@ts-ignore
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
      <button
        @click.prevent="proceed"
        type="submit"
        class="w-full text-sm btn btn-submit"
        :disabled="disableSubmit"
        :class="{ 'opacity-50': disableSubmit }"
      >
        Proceed
      </button>
    </form>
  </div>
</template>
