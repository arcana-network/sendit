<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import Dropdown from "@/components/lib/dropdown.vue";
import { gaslessChains } from "@/constants/chainList";
import useSendStore from "@/stores/send";
import { reactive, computed } from "vue";
import { requestableTokens } from "@/constants/requestableTokens";
import useAuthStore from "@/stores/auth";

type BuyTokenProps = {
  address: string;
};

const emit = defineEmits(["dismiss"]);
const sendStore = useSendStore();
const props = defineProps<BuyTokenProps>();
const authStore = useAuthStore();

const gaslessChainsList = computed(() =>
  sendStore.supportedChains.filter((chain) =>
    gaslessChains.includes(Number(chain.chain_id))
  )
);

const supportedTokens = computed(() => {
  return requestableTokens[userInput.chain]
    ? requestableTokens[userInput.chain].map((token) => token.symbol)
    : [];
});

const userInput = reactive({
  chain: "",
  token: "",
  amount: "",
});

function getChain(chainId) {
  return gaslessChainsList.value.find((chain) => chain.chain_id === chainId);
}

function getTransakNetwork(chainId) {
  if (chainId === 137) {
    return "polygon";
  }
  return "";
}

function handleBuy() {
  const Transak =
    import.meta.env.VITE_TRANSAK_ENV === "STAGING"
      ? "https://global-stg.transak.com"
      : "https://global.transak.com";

  const transakUrl = new URL(Transak);
  transakUrl.searchParams.append(
    "apiKey",
    import.meta.env.VITE_TRANSAK_API_KEY
  );
  transakUrl.searchParams.append("walletAddress", props.address);
  transakUrl.searchParams.append("email", authStore.userInfo.email || "");
  transakUrl.searchParams.append("network", getTransakNetwork(userInput.chain));
  transakUrl.searchParams.append("themeColor", "#262626");
  transakUrl.searchParams.append("cryptoCurrencyCode", userInput.token);
  transakUrl.searchParams.append("defaultCryptoAmount", userInput.amount);

  window.open(transakUrl.toString(), "_blank");
  emit("dismiss");
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-[1.75rem] gap-4"
    >
      <div class="flex flex-col gap-4 relative justify-center">
        <button class="absolute -right-5 -top-5" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <span class="uppercase font-bold text-[1.5rem] text-[#545454]"
          >Purchase Details</span
        >
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Chain</label>
          <Dropdown
            @update:model-value="(value) => (userInput.chain = value.chain_id)"
            :options="gaslessChainsList"
            :model-value="getChain(userInput.chain)"
            display-field="name"
            placeholder="Select Chain"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Token</label>
          <Dropdown
            @update:model-value="(value) => (userInput.token = value)"
            :options="supportedTokens"
            :model-value="userInput.token"
            placeholder="Select Chain"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Amount</label>
          <input
            class="input disabled:opacity-60"
            type="number"
            v-model="userInput.amount"
          />
        </div>
        <div class="flex justify-center pt-4">
          <button
            type="submit"
            class="w-full text-sm btn btn-submit"
            @click.stop="handleBuy"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
