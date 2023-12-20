<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import Dropdown from "@/components/lib/dropdown.vue";
import useSendStore from "@/stores/send";
import { reactive, computed, onBeforeMount } from "vue";
// import useAuthStore from "@/stores/auth";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { ref } from "vue";
import { fetchAllTokenBalances } from "@/services/ankr.service";
import useUserStore from "@/stores/user";

type DepositTokenProps = {
  address: string;
  accountType: "eoa" | "scw";
};

const emit = defineEmits(["dismiss"]);
const sendStore = useSendStore();
const props = defineProps<DepositTokenProps>();
// const authStore = useAuthStore();
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
    sources.push("User Owned Wallet");
  } else {
    sources.push("Smart Contract Wallet");
  }
  return sources;
});

const userInput = reactive({
  sourceOfFunds: "",
  chain: "",
  token: "",
  amount: "",
});

function getChain(chainId) {
  return chainsList.value.find((chain) => chain.chain_id === chainId);
}

function isExternalWallet() {
  return userInput.sourceOfFunds === "External Wallet";
}

function handleDeposit() {
  emit("dismiss");
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
            placeholder="Select Chain"
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
          <img src="@/assets/images/icons/info-circle.svg" />
          <span class="text-[10px] text-[#8d8d8d]"
            >Only transfer tokens using the ‘Polygon POS’ chain. All other
            transfers will be lost.</span
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
