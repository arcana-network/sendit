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
import { getAccountBalance } from "@/services/ankr.service.ts";
import useArcanaAuth from "@/use/arcanaAuth";
import {
  nativeTokenTransfer,
  erc20TokenTransfer,
} from "@/services/send.service.ts";
import { getBytes } from "ethers";
import useSocketConnection from "@/use/socketConnection";
import { useToast } from "vue-toastification";
import { SOCKET_IDS, TOKEN_TYPES } from "@/constants/socket-ids";
import { isValidEmail, isValidTwitterHandle } from "@/utils/validation";
import { normaliseEmail, normaliseTwitterHandle } from "@/utils/normalise";
import Dropdown from "@/components/lib/dropdown.vue";

const emits = defineEmits(["transaction-successful"]);
const ACTION_REJECTED = "ACTION_REJECTED";
const INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
const SELF_TX_ERROR = "self-transactions are not permitted";
let assetInterval: NodeJS.Timer;

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
const socketConnection = useSocketConnection();
const toast = useToast();
const twitterId = ref("");
const hasTwitterError = ref(false);
const hasStartedTyping = ref(false);
const allAssets: Ref<any[]> = ref([]);

const { userInput, supportedChains } = toRefs(sendStore);

const isEmailValid = computed(() => {
  if (userInput.value.medium === "mail") {
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
    const walletAddress = authStore.walletAddress;
    const data = await getAccountBalance(walletAddress, [
      "eth",
      "polygon",
      "polygon_mumbai",
    ]);
    if (data?.result?.assets?.length) {
      allAssets.value = data?.result?.assets.map((asset) => {
        const address =
          asset.tokenType === "NATIVE" ? "NATIVE" : asset.contractAddress;
        return {
          ...asset,
          contractAddress: address,
          name: `${asset.tokenSymbol || "Unknown"}-${asset.tokenType}`,
        };
      });
    } else {
      allAssets.value = [];
    }
  } catch (error) {
    console.error(error);
  }
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
  return socketConnection.sendMessage(SOCKET_IDS.SEND_TX, message);
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

async function proceed() {
  loadStore.showLoader("Sending tokens...");
  let hasUserRejectedChainSwitching = false;
  if (userInput.value.chain !== "") {
    const chainId = await authStore.provider.request({
      method: "eth_chainId",
    });
    if (Number(chainId) !== Number(userInput.value.chain)) {
      try {
        await authStore.provider.switchChain(userInput.value.chain);
      } catch (e) {
        hasUserRejectedChainSwitching = true;
        toast.error(
          "Switching chain rejected by user. Cannot proceed with this transaction."
        );
      }
    }
  }
  if (!hasUserRejectedChainSwitching) {
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
      loadStore.showLoader(
        "Transferring Tokens...",
        "Please approve the transaction and wait until it is completed."
      );
      const tx =
        userInput.value.token === "NATIVE"
          ? await nativeTokenTransfer(senderPublicKey, arcanaProvider, amount)
          : await erc20TokenTransfer(
              senderPublicKey,
              arcanaProvider,
              amount,
              //@ts-ignore
              userInput.value.token
            );
      loadStore.showLoader("Generating SendIt link...");
      const { hash, to } = tx;
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
      fetchAssets();
      emits("transaction-successful", sendRes);
    } catch (error: any) {
      if (error === SELF_TX_ERROR || error.message === SELF_TX_ERROR) {
        toast.error("You cannot send tokens to yourself");
      } else if (error.code === ACTION_REJECTED) {
        toast.error(
          "Signature request rejected. Please refresh the page again to login"
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
  }
}

async function switchChain(chainId: string) {
  await authStore.provider.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: `0x${Number(chainId).toString(16)}`,
      },
    ],
  });
}

watch(
  () => userInput.value.chain,
  async (selectedChainId, oldChain) => {
    await fetchAssets();
    if (userInput.value.chain !== "") {
      userInput.value.token = "";
      const chainId = await authStore.provider.request({
        method: "eth_chainId",
      });
      if (Number(chainId) !== Number(selectedChainId)) {
        try {
          await switchChain(selectedChainId as string);
        } catch (e) {
          console.error({ e });
          userInput.value.chain = oldChain;
          toast.error("Switching chain rejected by user");
        }
      }
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
    Number(tokenBalance.value) < Number(userInput.value.amount)
  );
});

async function handleTwitterUsername() {
  if (userInput.value.medium === "twitter" && userInput.value.recipientId) {
    const message = {
      username: userInput.value.recipientId,
    };
    try {
      const res = (await socketConnection.sendMessage(
        SOCKET_IDS.TWITTER_USERNAME_TO_ID,
        message
      )) as { id: string };
      twitterId.value = res.id;
    } catch (error) {
      hasTwitterError.value = true;
      toast.error("Invalid twitter username");
    }
  }
}

function handleMediumChange(medium) {
  userInput.value.medium = medium;
  handleTwitterUsername();
}

function getTokenModelValue(tokenAddress) {
  return (
    chainAssets.value.find((asset) => asset.contractAddress === tokenAddress) ||
    {}
  );
}
</script>

<template>
  <div
    class="w-full max-w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase font-bold">Transaction Details</h1>
    <div class="space-y-1">
      <h2 class="text-xs font-medium">Send Via</h2>
      <div class="flex items-center space-x-2">
        <div
          v-for="medium in sendVia"
          :key="medium.value"
          @click="handleMediumChange(medium.value)"
          class="border-1 border-jet p-1.5 bg-[#666] rounded-full hover:border-white hover:bg-[#999] cursor-pointer"
          :class="{
            'border-white': userInput.medium === medium.value,
          }"
        >
          <img :src="medium.icon" :alt="medium.value" />
        </div>
      </div>
    </div>
    <form class="space-y-3">
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Recipient's ID</label>
        <input
          class="input"
          v-model.trim="userInput.recipientId"
          @input="
            hasTwitterError = false;
            hasStartedTyping = true;
          "
          @blur="handleTwitterUsername"
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
          <span v-if="userInput.token" class="text-xs"
            >Balance: {{ tokenBalance }}</span
          >
        </div>
        <input class="input" type="number" v-model="userInput.amount" />
        <div
          class="text-[#ff4264] text-[10px]"
          v-if="Number(tokenBalance) < Number(userInput.amount)"
        >
          Entered amount is greater than your wallet balance.
        </div>
      </div>
      <button
        @click.prevent="proceed"
        type="submit"
        class="w-full text-sm btn btn-submit"
        :disabled="disableSubmit"
        :class="{ 'opacity-50': disableSubmit }"
      >
        Send it
      </button>
    </form>
  </div>
</template>
