<script setup lang="ts">
import { toRefs, watch, ref, computed, type Ref } from "vue";
import requestVia from "@/constants/requestVia";
import useAuthStore from "@/stores/auth";
import useLoaderStore from "@/stores/loader";
import { useConnection } from "@/stores/connection";
import { useToast } from "vue-toastification";
import { SOCKET_IDS } from "@/constants/socket-ids";
import { isValidEmail, isValidTwitterHandle } from "@/utils/validation";
import Dropdown from "@/components/lib/dropdown.vue";
import chains from "@/constants/chainList";
import { Decimal } from "decimal.js";
import { requestableTokens } from "@/constants/requestableTokens";
import useRequestStore from "@/stores/request";
import useSendStore from "@/stores/send";
import useArcanaAuth from "@/use/arcanaAuth";
import { normaliseEmail } from "@/utils/normalise";
import { computeAddress, ethers } from "ethers";
import { switchChain } from "@/use/switchChain";

const emits = defineEmits(["transaction-successful"]);
const ACTION_REJECTED = "ACTION_REJECTED";
const INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
const SELF_TX_ERROR = "self-transactions are not permitted";

const requestStore = useRequestStore();
const sendStore = useSendStore();
const arcanaAuth = useArcanaAuth();
const { userInput } = toRefs(requestStore);
const { supportedChains } = toRefs(sendStore);
const authStore = useAuthStore();
const loadStore = useLoaderStore();
const chainAssets: Ref<any[]> = computed(() => {
  return requestableTokens[userInput.value.chain] || [];
});
const tokenBalance = ref(0);
const conn = useConnection();
const toast = useToast();
const twitterId = ref("");
const hasTwitterError = ref(false);
const isEmailDisposable = ref(false);
const hasStartedTyping = ref(false);

const requestSupportedChains = computed(() => {
  return supportedChains.value.filter(
    (chain) => chain.sendit_contract !== ethers.ZeroAddress
  );
});

const isEmailValid = computed(() => {
  if (userInput.value.medium === "mail") {
    hasTwitterError.value = false;
    return isValidEmail(userInput.value.recipientId);
  }
  return true;
});

const isWalletValid = computed(() => {
  if (userInput.value.medium === "wallet") {
    hasTwitterError.value = false;
    return userInput.value.recipientId.length === 42;
  }
  return true;
});

const isTwitterValid = computed(() => {
  if (userInput.value.medium === "twitter") {
    return isValidTwitterHandle(userInput.value.recipientId);
  }
  return true;
});

function getSelectedChainInfo(chainId) {
  //@ts-ignore
  return requestSupportedChains.value.find(
    (chain) => Number(chain.chain_id) === Number(chainId)
  );
}

function serializeDecimal(dec: Decimal): string {
  const weird = dec.toHexadecimal().slice(2);
  const len = Math.ceil(weird.length / 2) * 2;
  return "0x" + weird.padStart(len, "0");
}

async function proceed() {
  loadStore.showLoader("Sending tokens...");
  let hasUserRejectedChainSwitching = false;
  if (userInput.value.chain !== "") {
    const chainId = await authStore.provider.request({
      method: "eth_chainId",
    });
    if (Number(chainId) !== Number(userInput.value.chain)) {
      loadStore.showLoader(
        "Switching chain...",
        `Switch to ${
          chains[Number(userInput.value.chain)].name
        } chain before sending tokens`
      );
      try {
        await switchChain(userInput.value.chain as string);
      } catch (e) {
        hasUserRejectedChainSwitching = true;
      }
    }
  } else {
    toast.error("Please select a chain to continue");
    return;
  }
  if (!hasUserRejectedChainSwitching) {
    loadStore.showLoader(
      "Requesting signature to request tokens...",
      `Please sign the message on your wallet.`
    );
    try {
      if (userInput.value.medium === "wallet") {
        userInput.value.address = userInput.value.recipientId;
      } else {
        const publicKey = await arcanaAuth
          .getAuthInstance()
          .getPublicKey(
            twitterId.value || normaliseEmail(userInput.value.recipientId)
          );
        userInput.value.address = computeAddress(`0x${publicKey}`);
      }
      if (userInput.value.address === authStore.userInfo.address) {
        throw SELF_TX_ERROR;
      }
      const amount = serializeDecimal(
        new Decimal(userInput.value.amount || 0).mul(Decimal.pow(10, 18))
      );
      const selectedChain = getSelectedChainInfo(userInput.value.chain);
      const response = await requestStore.sendRequest({
        amount,
        senditContractAddress: selectedChain?.sendit_contract,
        twitterId: twitterId.value,
      });
      response.recipientId =
        twitterId.value || normaliseEmail(userInput.value.recipientId);
      response.amount = userInput.value.amount;
      response.symbol = getTokenModelValue(userInput.value.token).symbol;
      emits("transaction-successful", response);
      //@ts-ignore
      resetAll();
    } catch (error: any) {
      console.error(error);
      if (error === SELF_TX_ERROR || error.message === SELF_TX_ERROR) {
        toast.error("You cannot request tokens from yourself");
      } else if (error.code === ACTION_REJECTED) {
        toast.error(
          "Signature request rejected. Please retry sending, approve the transaction on your wallet and wait until it is completed."
        );
      } else if (error.code === INSUFFICIENT_FUNDS) {
        toast.error("Insufficient Gas to make this transaction.");
      } else {
        if (error.error?.data?.originalError?.body) {
          const body = error.error?.data?.originalError?.body;
          const errorBody =
            typeof body === "string"
              ? JSON.parse(error.error?.data?.originalError?.body)
              : body;
          if (errorBody?.error?.message) {
            toast.error(errorBody?.error?.message);
          } else {
            toast.error(errorBody?.error || errorBody);
          }
        } else {
          const displayError = (error.error?.data?.originalError?.error
            ?.message ||
            error.error?.data?.originalError?.reason ||
            error.error?.data?.originalError?.code ||
            error.message ||
            error) as string;
          toast.error(displayError);
        }
      }
    } finally {
      loadStore.hideLoader();
      hasStartedTyping.value = false;
    }
  } else {
    loadStore.hideLoader();
    toast.error(
      "Switching chain rejected by user. Cannot proceed with this transaction."
    );
  }
}

function resetAll() {
  tokenBalance.value = 0;
  twitterId.value = "";
  hasTwitterError.value = false;
  hasStartedTyping.value = false;
}

watch(
  () => userInput.value.chain,
  async (selectedChainId, oldChain) => {
    if (userInput.value.chain !== "") {
      const chainId = await authStore.provider.request({
        method: "eth_chainId",
      });
      if (selectedChainId !== oldChain) {
        userInput.value.token = "";
      }
      if (Number(chainId) !== Number(selectedChainId)) {
        try {
          loadStore.showLoader(
            "Switching Chain...",
            `Switching to ${
              chains[Number(userInput.value.chain)].name
            } chain. Please approve the transaction on your wallet to switch the chain.`
          );
          await switchChain(selectedChainId as string);
        } catch (e) {
          console.error({ e });
          userInput.value.chain = oldChain;
          toast.error("Switching chain rejected by user");
        }
      }
      loadStore.hideLoader();
    }
  }
);

watch(
  () => authStore.userInfo.address,
  () => {
    requestStore.resetUserInput();
  }
);

const disableTokenInput = computed(() => {
  return !userInput.value.chain && !chainAssets.value.length;
});

const disableSubmit = computed(() => {
  return (
    !userInput.value.amount ||
    !userInput.value.chain ||
    !userInput.value.token ||
    hasTwitterError.value ||
    !isTwitterValid.value ||
    !isEmailValid.value ||
    isEmailDisposable.value ||
    !isWalletValid.value ||
    !userInput.value.medium ||
    !userInput.value.recipientId
  );
});

async function handleServerSideFieldValidation() {
  if (
    userInput.value.medium === "twitter" &&
    userInput.value.recipientId &&
    isTwitterValid.value
  ) {
    isEmailDisposable.value = false;
    const message = {
      username: userInput.value.recipientId.replace("@", ""),
    };
    try {
      const res = (await conn.sendMessage(
        SOCKET_IDS.TWITTER_USERNAME_TO_ID,
        message
      )) as { id: string };
      twitterId.value = res.id;
    } catch (error) {
      hasTwitterError.value = true;
    }
  } else if (
    userInput.value.medium === "mail" &&
    userInput.value.recipientId &&
    isEmailValid.value
  ) {
    twitterId.value = "";
    hasTwitterError.value = false;
    const message = {
      email_address: userInput.value.recipientId,
    };
    const res = await conn.sendMessage(SOCKET_IDS.CHECK_EMAIL, message);
    isEmailDisposable.value = res.disposable;
  }
}

function handleMediumChange(medium) {
  userInput.value.medium = medium;
  handleServerSideFieldValidation();
}

function getTokenModelValue(tokenAddress) {
  return (
    chainAssets.value.find((asset) => asset.address === tokenAddress) || {}
  );
}
</script>

<template>
  <div
    class="w-full max-w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase font-bold">Request</h1>
    <hr class="border-0 border-b border-solid border-[#363636] -mx-4" />
    <div class="space-y-1">
      <h2 class="text-xs">Request Via</h2>
      <div class="flex items-center space-x-2">
        <div
          v-for="medium in requestVia"
          :key="medium.value"
          @click="handleMediumChange(medium.value)"
          class="border-1 p-1.5 rounded-full transition-all hover:bg-[#313131] cursor-pointer h-[44px] w-[44px] flex items-center justify-center"
          :class="{
            'border-[#4D4D4D]': userInput.medium !== medium.value,
            'border-white bg-[#313131]': userInput.medium === medium.value,
          }"
        >
          <img :src="medium.icon" :alt="medium.value" />
        </div>
      </div>
    </div>
    <form class="space-y-3">
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Request From</label>
        <input
          class="input"
          v-model.trim="userInput.recipientId"
          @input="
            hasTwitterError = false;
            hasStartedTyping = true;
            twitterId = '';
          "
          autocomplete="off"
          @blur="handleServerSideFieldValidation"
          :placeholder="
            userInput.medium === 'twitter'
              ? 'Enter twitter username eg @mytwitterhandle'
              : userInput.medium === 'mail'
              ? 'Enter email. eg abc@example.com'
              : 'Enter wallet address. eg 0x1234...'
          "
        />
        <div
          class="text-[#ff4264] text-[10px]"
          v-if="!userInput.recipientId.trim() && userInput.chain"
        >
          Please enter the recipient's ID
        </div>
        <div
          class="text-[#ff4264] text-[10px]"
          v-else-if="hasStartedTyping && (!isTwitterValid || hasTwitterError)"
        >
          Invalid twitter username
        </div>
        <div
          class="text-[#ff4264] text-[10px]"
          v-else-if="hasStartedTyping && !isEmailValid"
        >
          Invalid email
        </div>
        <div
          class="text-[#ff4264] text-[10px]"
          v-else-if="hasStartedTyping && isEmailDisposable"
        >
          Email address is problematic. Please enter a different email address
        </div>
        <div
          class="text-[#ff4264] text-[10px]"
          v-else-if="hasStartedTyping && !isWalletValid"
        >
          Invalid wallet address
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Chain</label>
        <Dropdown
          @update:model-value="(value) => (userInput.chain = value.chain_id)"
          :options="requestSupportedChains"
          :model-value="getSelectedChainInfo(userInput.chain)"
          display-field="name"
          placeholder="Select Chain"
        />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Token</label>
        <Dropdown
          @update:model-value="(value) => (userInput.token = value.address)"
          :options="chainAssets"
          display-field="symbol"
          :model-value="getTokenModelValue(userInput.token)"
          placeholder="Select Token"
          :disabled="disableTokenInput"
        />
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between">
          <label class="text-xs">Amount</label>
        </div>
        <input
          class="input disabled:opacity-60"
          type="number"
          v-model="userInput.amount"
          :disabled="!userInput.chain || !userInput.token"
        />
      </div>
      <div class="flex justify-center pt-4">
        <button
          @click.prevent="proceed"
          type="submit"
          class="w-full text-sm btn btn-submit"
          :disabled="disableSubmit"
          :class="{ 'opacity-50': disableSubmit }"
        >
          Request
        </button>
      </div>
    </form>
  </div>
</template>
