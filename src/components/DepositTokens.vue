<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import Dropdown from "@/components/lib/dropdown.vue";
import useSendStore from "@/stores/send";
import { reactive, computed, onBeforeMount } from "vue";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { ref } from "vue";
import { fetchAllTokenBalances } from "@/services/ankr.service";
import useUserStore from "@/stores/user";
import useLoaderStore from "@/stores/loader";
import useAuthStore from "@/stores/auth";
import chains, { ChainIds } from "@/constants/chainList";
import { useToast } from "vue-toastification";
import {
  nativeTokenTransfer,
  erc20TokenTransfer,
  type FeeData,
} from "@/services/send.service";
import { hexlify } from "ethers";
import { GAS_SUPPORTED_CHAINS } from "@/constants/socket-ids";
import { switchChain } from "@/use/switchChain";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";

type DepositTokenProps = {
  address: string;
  accountType: "eoa" | "scw";
};

const emit = defineEmits(["dismiss", "success"]);
const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const sendStore = useSendStore();
const conn = useConnection();
const toast = useToast();
const props = defineProps<DepositTokenProps>();
const qrcode = useQRCode(props.address, {
  margin: 2,
  width: 240,
});
const allAssets = ref([] as any[]);
const allGaslessAssets = ref([] as any[]);
const userStore = useUserStore();

const chainsList = computed(() => {
  return sendStore.supportedChains.filter(
    (chain) => chain.gasless_enabled || chain.chain_id == "80001"
  );
});

const selectedTokenBalance = computed(() => {
  if (userInput.sourceOfFunds === "scw") {
    return (
      allGaslessAssets.value.find(
        (asset) =>
          ChainIds[asset.blockchain] == userInput.chain &&
          asset.contractAddress === userInput.token
      )?.balance || 0
    );
  }
  return (
    allAssets.value.find(
      (asset) =>
        ChainIds[asset.blockchain] == userInput.chain &&
        asset.contractAddress === userInput.token
    )?.balance || 0
  );
});

async function fetchAssets() {
  allAssets.value = await fetchAllTokenBalances(userStore.address);
  allGaslessAssets.value = await fetchAllTokenBalances(
    userStore.gaslessAddress
  );
}

const selectedTypeAssets = computed(() => {
  return getChainAssets(userInput.chain);
});

function getSelectedChainInfo(chainId) {
  //@ts-ignore
  return chainsList.value.find(
    (chain) => Number(chain.chain_id) === Number(chainId)
  );
}

function getChainAssets(chainId) {
  const chain = getSelectedChainInfo(chainId);
  if (chain) {
    const assets =
      props.accountType === "scw" ? allGaslessAssets.value : allAssets.value;
    return (
      assets.filter((asset) => asset.blockchain === chain.blockchain) || []
    );
  }
  return [];
}

const fundSources = computed(() => {
  const sources = ["External Wallet"];
  if (props.accountType === "scw") {
    sources.push("Regular Account");
  } else if (authStore.loggedInWith === "") {
    sources.push("Smart Account");
  }
  return sources;
});

const userInput = reactive({
  sourceOfFunds: "",
  chain: "",
  token: "",
  amount: 0,
});

function getChain(chainId) {
  return chainsList.value.find((chain) => chain.chain_id === chainId);
}

function isExternalWallet() {
  return userInput.sourceOfFunds === "External Wallet";
}

function isSmartContractWallet() {
  return userInput.sourceOfFunds === "Smart Contract Wallet";
}

function isEoaWallet() {
  return userInput.sourceOfFunds === "User Owned Wallet";
}

async function handleDeposit() {
  loaderStore.showLoader(
    "DEPOSITING TOKENS",
    "Hang tight! Your tokens are being deposited."
  );
  let hasUserRejectedChainSwitching = false;
  if (userInput.chain !== "") {
    const chainId = await authStore.provider.request({
      method: "eth_chainId",
    });
    if (Number(chainId) !== Number(userInput.chain)) {
      loaderStore.showLoader(
        "Switching chain...",
        `Switch to ${
          chains[Number(userInput.chain)].name
        } chain before sending tokens`
      );
      try {
        await switchChain(userInput.chain as string);
      } catch (e) {
        hasUserRejectedChainSwitching = true;
      }
    }
  } else {
    toast.error("Please select a chain to continue");
    return;
  }
  const currentAccountType = await authStore.provider.request({
    method: "_arcana_getAccountType",
  });
  const sourceOfFunds = isSmartContractWallet()
    ? "scw"
    : isEoaWallet()
    ? "eoa"
    : "";
  if (sourceOfFunds && currentAccountType !== sourceOfFunds) {
    try {
      loaderStore.showLoader(
        "Switching Account Type...",
        `Switching to ${
          sourceOfFunds === "scw"
            ? "Smart Contract Wallet"
            : "User Owned Wallet"
        }. Please approve the transaction on your wallet to switch the account type.`
      );
      await authStore.provider.request({
        method: "_arcana_switchAccountType",
        params: {
          type: sourceOfFunds,
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Switching account type rejected by user");
    }
  }
  if (!hasUserRejectedChainSwitching) {
    loaderStore.showLoader(
      "DEPOSITING TOKENS",
      "Hang tight! Your tokens are being deposited."
    );
    try {
      const arcanaProvider = authStore.provider;
      const amount = userInput.amount;
      const chainId = userInput.chain;
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
      userInput.token === "NATIVE"
        ? await nativeTokenTransfer(
            props.accountType === "eoa"
              ? userStore.address
              : userStore.gaslessAddress,
            arcanaProvider,
            amount,
            feeData,
            false,
            userInput.chain
          )
        : await erc20TokenTransfer(
            props.accountType === "eoa"
              ? userStore.address
              : userStore.gaslessAddress,
            arcanaProvider,
            amount,
            //@ts-ignore
            userInput.value.token,
            feeData,
            false,
            userInput.chain
          );
      toast.success("Tokens deposited successfully");
      emit("success");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      loaderStore.hideLoader();
    }
  }
}

function getSelectedAssets(contractAddress: string) {
  return selectedTypeAssets.value.find(
    (asset) =>
      //@ts-ignore
      asset.contractAddress === contractAddress
  );
}

onBeforeMount(async () => {
  await fetchAssets();
});
</script>

<template>
  <Overlay>
    <div
      class="max-w-[480px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-4"
    >
      <div class="flex flex-col gap-4 relative justify-center">
        <button class="absolute -right-3 -top-3" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <span class="uppercase font-bold text-[1.5rem] text-[#545454]"
          >Deposit Details</span
        >
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Source of funds</label>
          <Dropdown
            :options="fundSources"
            v-model="userInput.sourceOfFunds"
            placeholder="Select fund source"
          />
        </div>
        <div
          v-if="userInput.sourceOfFunds && !isExternalWallet()"
          class="flex flex-col space-y-1"
        >
          <label class="text-xs">Source Chain</label>
          <Dropdown
            @update:model-value="(value) => (userInput.chain = value.chain_id)"
            :options="chainsList"
            display-field="name"
            :model-value="getChain(userInput.chain)"
            placeholder="Select Chain"
          />
        </div>
        <div
          v-if="userInput.sourceOfFunds && !isExternalWallet()"
          class="flex flex-col space-y-1"
        >
          <label class="text-xs">Token</label>
          <Dropdown
            @update:model-value="
              (value) => (userInput.token = value.contractAddress)
            "
            :options="selectedTypeAssets"
            :model-value="getSelectedAssets(userInput.token)"
            display-field="tokenSymbol"
            placeholder="Select Token"
          />
        </div>
        <div
          v-if="userInput.sourceOfFunds && !isExternalWallet()"
          class="flex flex-col space-y-1"
        >
          <label class="text-xs">Amount</label>
          <input
            class="input disabled:opacity-60"
            type="number"
            v-model="userInput.amount"
          />
          <span class="flex-grow text-right text-xs">
            Balance:
            {{ selectedTokenBalance }}
          </span>
        </div>
        <div v-if="isExternalWallet()" class="flex flex-col space-y-1">
          <label class="text-xs">Wallet address</label>
          <div class="input flex gap-1 items-center">
            <input
              class="disabled:opacity-60 text-[0.875rem] bg-transparent ellipsis flex-grow"
              disabled
              :value="props.address"
            />
            <button>
              <img
                src="@/assets/images/icons/copy.svg"
                alt="copy"
                title="Click to copy wallet address"
              />
            </button>
          </div>
        </div>
        <div v-if="isExternalWallet()" class="flex justify-center items-center">
          <img
            :src="qrcode"
            class="max-w-[7.5rem] aspect-square rounded-[10px]"
          />
        </div>
        <div
          v-if="isExternalWallet()"
          class="flex items-center gap-2 bg-[#313131] p-[0.625rem] rounded-[5px]"
        >
          <img
            src="@/assets/images/icons/info-circle-yellow.svg"
            class="w-5 h-5"
          />
          <span class="text-[10px] text-[#EEB113]"
            >Only transfer tokens using the ‘Polygon POS’ chain. All other
            transfers will be lost.</span
          >
        </div>
        <div
          v-if="
            props.accountType === 'scw' &&
            userInput.sourceOfFunds === 'Regular Account'
          "
          class="flex items-center gap-2 bg-[#313131] p-[0.625rem] rounded-[5px]"
        >
          <img
            src="@/assets/images/icons/info-circle-yellow.svg"
            class="w-5 h-5"
          />
          <span class="text-[10px] text-[#EEB113]"
            >You will be charged gas fees for moving funds from your Regular
            Account to your Smart Account.</span
          >
        </div>
        <div
          v-if="userInput.sourceOfFunds && !isExternalWallet()"
          class="flex justify-center pt-4"
        >
          <button
            type="submit"
            class="w-full text-sm btn btn-submit"
            @click.stop="handleDeposit"
          >
            Proceed
          </button>
        </div>
        <div v-if="isExternalWallet()" class="flex justify-center pt-4">
          <button
            type="submit"
            class="w-full text-sm btn btn-submit"
            @click.stop="emit('dismiss')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
