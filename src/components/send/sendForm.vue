<script setup lang="ts">
import {
  toRefs,
  watch,
  ref,
  computed,
  type Ref,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import sendVia from "@/constants/sendVia";
import useSendStore from "@/stores/send";
import useAuthStore from "@/stores/auth";
import useLoaderStore from "@/stores/loader";
import {
  getAccountBalance,
  getNativeTokenBalances,
} from "@/services/ankr.service.ts";
import useArcanaAuth from "@/use/arcanaAuth";
import {
  nativeTokenTransfer,
  erc20TokenTransfer,
  type FeeData,
} from "@/services/send.service.ts";
import { getBytes } from "ethers";
import { useConnection } from "@/stores/connection";
import { useToast } from "vue-toastification";
import { SOCKET_IDS, TOKEN_TYPES } from "@/constants/socket-ids";
import { isValidEmail, isValidTwitterHandle } from "@/utils/validation";
import { normaliseEmail, normaliseTwitterHandle } from "@/utils/normalise";
import Dropdown from "@/components/lib/dropdown.vue";
import chains, { testnetChains } from "@/constants/chainList";
import { hexlify } from "ethers";
import { GAS_SUPPORTED_CHAINS } from "@/constants/socket-ids";
import { Decimal } from "decimal.js";
import copyToClipboard from "@/utils/copyToClipboard";
import { switchChain } from "@/use/switchChain";

const emits = defineEmits(["transaction-successful"]);
const ACTION_REJECTED = "ACTION_REJECTED";
const INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
const SELF_TX_ERROR = "self-transactions are not permitted";
let assetInterval: NodeJS.Timer;
const refreshIconAnimating = ref(false);

async function handleRefresh() {
  refreshIconAnimating.value = true;
  await fetchAssets();
  refreshIconAnimating.value = false;
}

onBeforeMount(async () => {
  await fetchAssets();
});

onBeforeUnmount(() => {
  clearInterval(assetInterval);
});

const sendStore = useSendStore();
const authStore = useAuthStore();
const loadStore = useLoaderStore();
const chainAssets: Ref<any[]> = computed(() => {
  return getChainAssets(userInput.value.chain);
});
const tokenBalance = ref(0);
const arcanaAuth = useArcanaAuth();
const conn = useConnection();
const toast = useToast();
const twitterId = ref("");
const hasTwitterError = ref(false);
const isEmailDisposable = ref(false);
const hasStartedTyping = ref(false);
const allAssets: Ref<any[]> = ref([]);
const isBalanceFetching = ref(false);

sendStore.resetUserInput();
const { userInput, supportedChains } = toRefs(sendStore);

const isEmailValid = computed(() => {
  if (userInput.value.medium === "mail") {
    hasTwitterError.value = false;
    return isValidEmail(userInput.value.recipientId);
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
  return supportedChains.value.find(
    (chain) => Number(chain.chain_id) === Number(chainId)
  );
}

function getSelectedAssets(contractAddress: string) {
  return chainAssets.value.find(
    (asset) =>
      //@ts-ignore
      asset.contractAddress === contractAddress
  );
}

function getChainAssets(chainId) {
  const chain = getSelectedChainInfo(chainId);
  if (chain) {
    return allAssets.value.filter(
      (asset) => asset.blockchain === chain.blockchain
    );
  }
  return [];
}

async function fetchAssets() {
  try {
    isBalanceFetching.value = true;
    const walletAddress = authStore.walletAddress;
    let nativeAssets = [] as any[];
    const nativeData = await getNativeTokenBalances(walletAddress);
    if (nativeData?.length) {
      nativeAssets = nativeData?.map((asset) => {
        const address = "NATIVE";
        return {
          ...asset,
          contractAddress: address,
          name: `${asset.tokenSymbol || "Unknown"}-${asset.tokenType}`,
        };
      });
    }
    allAssets.value = [...nativeAssets];
    await findFallbackBalanceInAnkr(walletAddress, nativeAssets);
  } catch (error) {
    console.error(error);
  } finally {
    loadStore.hideLoader();
    isBalanceFetching.value = false;
  }
}

async function findFallbackBalanceInAnkr(walletAddress, nativeAssets) {
  const data = await getAccountBalance(walletAddress, [
    "eth",
    "polygon",
    "arbitrum",
    "bsc",
  ]);
  let erc20Assets = [] as any[];
  if (data?.result?.assets?.length) {
    erc20Assets = data?.result?.assets
      .map((asset) => {
        const address =
          asset.tokenType === "NATIVE" ? "NATIVE" : asset.contractAddress;
        return {
          ...asset,
          contractAddress: address,
          name: `${asset.tokenSymbol || "Unknown"}-${asset.tokenType}`,
        };
      })
      .filter((asset) => asset.tokenType !== "NATIVE");
  }
  allAssets.value = [...nativeAssets, ...erc20Assets];
}

function messageArcana(
  hash: string,
  to: string,
  fromEmail: string,
  toEmail: string,
  chainId: number,
  from_verifier: "passwordless" | "twitter" | "null",
  to_verifier: "passwordless" | "twitter" | "null",
  type: number
) {
  const message = {
    hash: Buffer.from(getBytes(hash)),
    chain_id: chainId,
    to: Buffer.from(getBytes(to)),
    from_id: fromEmail,
    from_verifier,
    to_id: toEmail,
    to_verifier,
    type,
  };
  return conn.sendMessage(SOCKET_IDS.SEND_TX, message);
}

function getVerifier(verifier: string) {
  if (verifier === "twitter") {
    return "twitter";
  }
  if (verifier === "null") {
    return "null";
  }
  return "passwordless";
}

function getCurrency(chainId: string | number) {
  return userInput.value.token === "NATIVE"
    ? chains[Number(chainId)].currency
    : getTokenModelValue(userInput.value.token)?.tokenSymbol || "Unnamed Token";
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
      "Sending tokens...",
      `Sending ${new Decimal(
        userInput.value.amount as number
      ).toString()} ${getCurrency(userInput.value.chain)} to ${
        userInput.value.recipientId
      } on ${
        chains[Number(userInput.value.chain)].name
      } chain. Please approve the transaction on your wallet and wait until it is completed.`
    );
    try {
      const normalisedEmail =
        userInput.value.medium === "mail"
          ? normaliseEmail(userInput.value.recipientId)
          : null;
      const normalisedTwitterId =
        userInput.value.medium === "twitter"
          ? normaliseTwitterHandle(userInput.value.recipientId)
          : null;
      const recipientId = twitterId.value || normalisedEmail;
      if (!recipientId || recipientId === null) {
        throw new Error("Invalid recipient id");
      }
      const senderPublicKey = await arcanaAuth
        .getAuthInstance()
        .getPublicKey(recipientId);
      const arcanaProvider = authStore.provider;
      const amount = userInput.value.amount as number;
      const chainId = userInput.value.chain;
      let feeData: FeeData | null = null;
      if (GAS_SUPPORTED_CHAINS.includes(Number(chainId))) {
        const gasStation: any = await conn.sendMessage(
          SOCKET_IDS.GET_GAS_STATION,
          {
            chain_id: chainId,
          }
        );
        feeData = {
          maxFeePerGas: hexlify(gasStation.max_fee),
          maxPriorityFeePerGas: hexlify(gasStation.max_priority_fee),
        };
      }
      const tx =
        userInput.value.token === "NATIVE"
          ? await nativeTokenTransfer(
              senderPublicKey,
              arcanaProvider,
              amount,
              feeData
            )
          : await erc20TokenTransfer(
              senderPublicKey,
              arcanaProvider,
              amount,
              //@ts-ignore
              userInput.value.token,
              feeData
            );
      loadStore.showLoader("Generating SendIt link...");
      const { hash, to } = tx;
      if (to == null) {
        throw new Error("Invalid transaction");
      }
      const toEmail = recipientId;
      //@ts-ignore
      const fromEmail = authStore.userInfo.email || authStore.userInfo.id;
      const fromVerifier = getVerifier(authStore.userInfo.loginType);
      const toVerifier =
        userInput.value.medium === "twitter" ? "twitter" : "passwordless";
      //@ts-ignore
      const sendRes = (await messageArcana(
        hash,
        to,
        fromEmail,
        toEmail,
        Number(chainId),
        fromVerifier,
        toVerifier,
        userInput.value.token === "NATIVE"
          ? TOKEN_TYPES.NATIVE
          : TOKEN_TYPES.ERC20
      )) as any;
      sendRes.verifier_id = recipientId;
      sendRes.hash = hash;
      sendRes.verifier_human =
        normalisedTwitterId || normalisedEmail || userInput.value.recipientId;
      sendRes.verifier = toVerifier;
      sendRes.amount = amount;
      sendRes.chain = chains[Number(chainId)].name;
      sendRes.token = getCurrency(chainId);
      fetchAssets();
      resetAll();
      emits("transaction-successful", sendRes);
    } catch (error: any) {
      console.error(error);
      if (error === SELF_TX_ERROR || error.message === SELF_TX_ERROR) {
        toast.error("You cannot send tokens to yourself");
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
      await fetchAssets();
      loadStore.hideLoader();
    }
  }
);

watch(
  () => userInput.value.token,
  async (selectedToken) => {
    if (selectedToken) {
      await fetchAssets();
      //@ts-ignore
      tokenBalance.value = getSelectedAssets(selectedToken)?.balance || 0;
    } else tokenBalance.value = 0;
  }
);

watch(
  () => authStore.userInfo.address,
  () => {
    sendStore.resetUserInput();
    fetchAssets();
  }
);

const disableTokenInput = computed(() => {
  return !userInput.value.chain && !chainAssets.value.length;
});

const disableSubmit = computed(() => {
  return (
    !userInput.value.amount ||
    !userInput.value.chain ||
    !userInput.value.medium ||
    !userInput.value.recipientId ||
    !userInput.value.token ||
    hasTwitterError.value ||
    !isTwitterValid.value ||
    !isEmailValid.value ||
    isEmailDisposable.value ||
    Number(tokenBalance.value) < Number(userInput.value.amount) ||
    loadStore.show
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
    chainAssets.value.find((asset) => asset.contractAddress === tokenAddress) ||
    {}
  );
}

async function copyWalletAddress() {
  await copyToClipboard(authStore.walletAddress);
  toast.success("Wallet address copied");
}
</script>

<template>
  <div
    class="w-full max-w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase font-bold">Send Tokens</h1>
    <hr class="border-0 border-b border-solid border-[#363636] -mx-4" />
    <div class="space-y-1">
      <h2 class="text-xs">Send Via</h2>
      <div class="flex items-center space-x-2">
        <div
          v-for="medium in sendVia"
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
        <label class="text-xs">Recipient ID</label>
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
              : 'Enter email. eg abc@example.com'
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
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Chain</label>
        <Dropdown
          @update:model-value="(value) => (userInput.chain = value.chain_id)"
          :options="supportedChains"
          :model-value="getSelectedChainInfo(userInput.chain)"
          display-field="name"
          placeholder="Select Chain"
        />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Token</label>
        <Dropdown
          @update:model-value="
            (value) => (userInput.token = value.contractAddress)
          "
          :options="chainAssets"
          display-field="name"
          :model-value="getTokenModelValue(userInput.token)"
          placeholder="Select Token"
          :disabled="disableTokenInput"
        />
        <div
          class="text-[#ff4264] text-[10px]"
          v-if="userInput.chain && !chainAssets.length"
        >
          You don't own any tokens on this chain. Please switch the chain or
          load some tokens to continue
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between">
          <label class="text-xs">Amount</label>
          <div v-if="userInput.token" class="flex items-center gap-2">
            <span class="text-xs">Balance: {{ tokenBalance }}</span>
            <button
              type="button"
              @click.stop="handleRefresh"
              :title="
                refreshIconAnimating ? 'Refreshing...' : 'Refresh Balance'
              "
              :disabled="refreshIconAnimating"
              class="w-[16px] h-[16px] rounded-full"
              :class="{ 'animate-spin': refreshIconAnimating }"
            >
              <img src="@/assets/images/icons/refresh.svg" />
            </button>
          </div>
        </div>
        <input
          class="input disabled:opacity-60"
          type="number"
          v-model="userInput.amount"
          :disabled="!userInput.chain || !userInput.token"
        />
        <div
          v-if="
            testnetChains.includes(Number(userInput.chain)) &&
            userInput.token &&
            !isBalanceFetching &&
            Number(tokenBalance) === 0
          "
          class="flex flex-col gap-2 text-[10px]"
        >
          <div class="flex gap-2 mt-2">
            <span
              >Your wallet address is:
              <span class="text-[12px]">{{
                authStore.walletAddress
              }}</span></span
            >
            <button
              type="button"
              @click.stop="copyWalletAddress"
              title="Copy Wallet Address"
            >
              <img src="@/assets/images/icons/copy.svg" />
            </button>
          </div>
          <a
            class="text-[#ff4264] text-[10px] underline"
            href="https://arcananetwork.notion.site/arcananetwork/SendIT-Get-testnet-tokens-from-the-faucet-61901bdecd82476bb19fce3c3059d65d"
            target="_blank"
          >
            Balance too low. Click here to get testnet tokens from faucet
          </a>
        </div>
        <div
          class="text-[#ff4264] text-[10px]"
          v-else-if="
            !isBalanceFetching &&
            Number(tokenBalance) < Number(userInput.amount)
          "
        >
          Entered amount is greater than your wallet balance.
        </div>
      </div>
      <div class="flex justify-center pt-4">
        <button
          @click.prevent="proceed"
          type="submit"
          class="w-full text-sm btn btn-submit"
          :disabled="disableSubmit"
          :class="{ 'opacity-50': disableSubmit }"
        >
          Send It
        </button>
      </div>
    </form>
  </div>
</template>
