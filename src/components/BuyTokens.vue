<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import Dropdown from "@/components/lib/dropdown.vue";
import chains from "@/constants/chainList";
import { reactive, computed } from "vue";
import useAuthStore from "@/stores/auth";
import { getCurrencies, generateTransakUrl } from "@/services/transak.service";
import useUserStore from "@/stores/user";

type BuyTokenProps = {
  address: string;
};

const emit = defineEmits(["dismiss"]);
const props = defineProps<BuyTokenProps>();
const authStore = useAuthStore();
const userStore = useUserStore();
const accountType = computed(() => {
  if (props.address.toLowerCase() === userStore.address.toLowerCase()) {
    return "eoa";
  }
  return "scw";
});

const buyChainsList = computed(() =>
  getCurrencies("buy", accountType.value)
    .map((chain) => {
      return {
        chain_id: chain.chain,
        name: chains[Number(chain.chain)].name,
        networkName: chain.networkName,
      };
    })
    .reduce((acc, curr) => {
      console.log({ curr });
      if (!acc.find((chain) => chain.chain_id === curr.chain_id)) {
        acc.push(curr);
      }
      return acc;
    }, [] as any[])
);

const supportedTokens = computed(() => {
  return getCurrencies("buy", accountType.value)
    .filter((chain) => Number(chain.chain) === Number(userInput.chain))
    .map((chain) => chain.symbol);
});

const userInput = reactive({
  chain: "",
  token: "",
  amount: "",
});

function getChain(chainId) {
  return buyChainsList.value.find((chain) => chain.chain_id === chainId);
}

function handleBuy() {
  const transakUrl = generateTransakUrl({
    address: props.address,
    chain: buyChainsList.value.find(
      (chain) => Number(chain.chain_id) === Number(userInput.chain)
    ).networkName,
    token: userInput.token,
    amount: userInput.amount,
    email: authStore.userInfo.email,
    mode: "buy",
  });

  window.open(transakUrl.toString(), "_blank");
  emit("dismiss");
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-4"
    >
      <div class="flex flex-col gap-4 relative justify-center">
        <button class="absolute -right-3 -top-3" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <span class="uppercase font-bold text-[1.5rem] text-[#545454]"
          >Purchase Details</span
        >
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Chain</label>
          <Dropdown
            @update:model-value="(value) => (userInput.chain = value.chain_id)"
            :options="buyChainsList"
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
            placeholder="Select Token"
            :disabled="!userInput.chain"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Amount</label>
          <input
            class="input disabled:opacity-60 text-"
            type="number"
            v-model="userInput.amount"
            :disabled="!userInput.token"
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
