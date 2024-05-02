<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import Dropdown from "@/components/lib/dropdown.vue";
import chains, { ChainIds } from "@/constants/chainList";
import { reactive, computed, ref, onBeforeMount, watch } from "vue";
import useAuthStore from "@/stores/auth";
import { getCurrencies, generateTransakUrl } from "@/services/transak.service";
import useUserStore from "@/stores/user";
import useLoaderStore from "@/stores/loader";
import { fetchAllTokenBalances } from "@/services/ankr.service";
import { useToast } from "vue-toastification";
import {
  nativeTokenTransfer,
  erc20TokenTransfer,
} from "@/services/send.service";
import { switchChain } from "@/use/switchChain";

type WithdrawTokenProps = {
  address: string;
};

const emit = defineEmits(["dismiss"]);
const props = defineProps<WithdrawTokenProps>();
const authStore = useAuthStore();
const userStore = useUserStore();
const accountType = computed(() => {
  if (props.address.toLowerCase() === userStore.address.toLowerCase()) {
    return "eoa";
  }
  return "scw";
});
const isSellClicked = ref(false);
const sellAddress = ref("");
const loaderStore = useLoaderStore();
const assets = ref([] as any[]);
const toast = useToast();
const isTokensSent = ref(false);

onBeforeMount(async () => {
  // loaderStore.showLoader("Fetching Balances");
  assets.value = await fetchAllTokenBalances(props.address);
  // loaderStore.hideLoader();
});

const withdrawChainsList = computed(() =>
  getCurrencies("sell", accountType.value)
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
  return getCurrencies("sell", accountType.value)
    .filter((chain) => Number(chain.chain) === Number(userInput.chain))
    .filter((chain) =>
      assets.value.find(
        (asset) =>
          ChainIds[asset.blockchain] == chain.chain &&
          chain.symbol === asset.tokenSymbol
      )
    )
    .map((chain) => chain.symbol);
});

const userInput = reactive({
  chain: "",
  token: "",
  amount: "",
});

function getChain(chainId) {
  return withdrawChainsList.value.find((chain) => chain.chain_id === chainId);
}

function handleSell() {
  if (
    userInput.amount &&
    Number(
      assets.value.find(
        (asset) =>
          ChainIds[asset.blockchain] == userInput.chain &&
          asset.tokenSymbol === userInput.token
      )?.balance
    ) < Number(userInput.amount)
  ) {
    toast.error("Insufficient Balance");
    return;
  }
  if (!userInput.amount || !userInput.token || !userInput.chain) {
    toast.error("Please fill all the fields");
    return;
  }
  const transakUrl = generateTransakUrl({
    address: props.address,
    chain: withdrawChainsList.value.find(
      (chain) => Number(chain.chain_id) === Number(userInput.chain)
    ).networkName,
    token: userInput.token,
    amount: userInput.amount,
    email: authStore.userInfo.email,
    mode: "sell",
  });

  window.open(transakUrl.toString(), "_blank");
  isSellClicked.value = true;
}

async function handleSend() {
  if (
    !sellAddress.value ||
    sellAddress.value.length !== 42 ||
    !sellAddress.value.startsWith("0x")
  ) {
    toast.error("Please enter a valid address");
    return;
  }
  loaderStore.showLoader("Sending Tokens to Transak");
  let hasUserRejectedChainSwitching = false;
  let hasUserRejectedAccountTypeSwitching = false;
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
  if (authStore.loggedInWith === "") {
    const currentAccountType = await authStore.provider.request({
      method: "_arcana_getAccountType",
    });
    if (currentAccountType !== accountType.value) {
      try {
        loaderStore.showLoader(
          "Switching Account Type...",
          `Switching to ${
            accountType.value === "scw"
              ? "Smart Contract Wallet"
              : "User Owned Wallet"
          }. Please approve the transaction on your wallet to switch the account type.`
        );
        await authStore.provider.request({
          method: "_arcana_switchAccountType",
          params: {
            type: accountType.value,
          },
        });
      } catch (e) {
        console.error(e);
        toast.error("Switching account type rejected by user");
        hasUserRejectedAccountTypeSwitching = true;
      }
    }
  }
  if (hasUserRejectedChainSwitching || hasUserRejectedAccountTypeSwitching) {
    loaderStore.hideLoader();
    hasUserRejectedChainSwitching
      ? toast.error("Switching chain  rejected by user")
      : toast.error("Switching account type rejected by user");
    return;
  }
  try {
    const sendToken = assets.value.find(
      (asset) =>
        ChainIds[asset.blockchain] == userInput.chain &&
        asset.tokenSymbol === userInput.token
    );
    if (sendToken?.tokenType === "NATIVE") {
      await nativeTokenTransfer(
        sellAddress.value,
        authStore.provider,
        Number(userInput.amount),
        null
      );
    } else {
      await erc20TokenTransfer(
        sellAddress.value,
        authStore.provider,
        Number(userInput.amount),
        sendToken.contractAddress,
        null
      );
    }
    toast.success(
      "Tokens sent successfully. Head back to Transak to check the status."
    );
    isTokensSent.value = true;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong, please try again later");
  } finally {
    loaderStore.hideLoader();
  }
}

function handleReset() {
  isSellClicked.value = false;
  userInput.amount = "";
  userInput.chain = "";
  userInput.token = "";
  sellAddress.value = "";
}

watch(
  () => userInput.chain,
  () => {
    userInput.token = "";
    userInput.amount = "";
  }
);

watch(
  () => userInput.token,
  () => {
    userInput.amount = "";
  }
);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[360px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-4"
    >
      <div
        v-if="isTokensSent"
        class="flex flex-col gap-4 relative justify-center items-center"
      >
        <button class="absolute -right-3 -top-3" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <img
          src="@/assets/images/icons/success-tick.svg"
          class="w-[80px]"
          alt="success"
        />
        <div class="space-y-2 flex flex-col items-center">
          <h1 class="uppercase font-bold text-[20px]">
            Tokens Sent Successfully
          </h1>
          <p class="text-philippine-gray text-[10px] text-center">
            Tokens successfully sent to Transak's address:
            {{ sellAddress }}.<br />
            Head back to Transak tab to check the payment status.
          </p>
        </div>
      </div>
      <div v-else class="flex flex-col gap-4 relative justify-center">
        <button class="absolute -right-3 -top-3" @click="emit('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <span class="uppercase font-bold text-[1.5rem] text-[#545454]"
          >Withdraw Details</span
        >
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Chain</label>
          <Dropdown
            @update:model-value="(value) => (userInput.chain = value.chain_id)"
            :options="withdrawChainsList"
            :model-value="getChain(userInput.chain)"
            display-field="name"
            placeholder="Select Chain"
            :disabled="isSellClicked"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Token</label>
          <Dropdown
            @update:model-value="(value) => (userInput.token = value)"
            :options="supportedTokens"
            :model-value="userInput.token"
            placeholder="Select Token"
            :disabled="!userInput.chain || isSellClicked"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs">Amount</label>
          <input
            class="input disabled:opacity-60 text-"
            type="number"
            v-model="userInput.amount"
            :disabled="!userInput.token || isSellClicked"
            :invalid="
              userInput.amount &&
              Number(
                assets.find(
                  (asset) =>
                    ChainIds[asset.blockchain] == userInput.chain &&
                    asset.tokenSymbol === userInput.token
                )?.balance
              ) < Number(userInput.amount)
            "
          />
          <span class="flex-grow text-right text-xs">
            Balance:
            {{
              assets.find(
                (asset) =>
                  ChainIds[asset.blockchain] == userInput.chain &&
                  asset.tokenSymbol === userInput.token
              )?.balance || 0
            }}
          </span>
        </div>
        <div class="flex flex-col space-y-1" v-if="isSellClicked">
          <label class="text-xs">Transak Wallet Address</label>
          <input
            class="input disabled:opacity-60"
            type="text"
            v-model="sellAddress"
          />
        </div>
        <div class="flex justify-center gap-4 pt-4">
          <button
            v-if="!isSellClicked"
            type="submit"
            class="w-full text-sm btn btn-submit"
            @click.stop="handleSell"
          >
            Proceed
          </button>
          <button
            v-if="isSellClicked"
            type="reset"
            class="w-full text-sm btn btn-submit-secondary"
            @click.stop="handleReset"
          >
            Reset
          </button>
          <button
            v-if="isSellClicked"
            type="submit"
            class="w-full text-sm btn btn-submit"
            @click.stop="handleSend"
            :disabled="!sellAddress"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
