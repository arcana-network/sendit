<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import { truncateAddress } from "@/utils/truncateAddress";
import BuyTokens from "@/components/BuyTokens.vue";
import DepositTokens from "@/components/DepositTokens.vue";
import WithdrawTokens from "@/components/WithdrawTokens.vue";
import { fetchAllTokenBalances } from "@/services/ankr.service";
import { ChainNames } from "@/constants/chainList";
import { Decimal } from "decimal.js";
import useUserStore from "@/stores/user";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";
import useAuthStore from "@/stores/auth";
import { router } from "@/router";
import { getCurrencyCoverage } from "@/services/transak.service";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const wallets = ref([] as any[]);
const isSmartContractWalletCreated = computed(() => userStore.gaslessOptedIn);
const showBuyModal = ref(false);
const buyModalDetails = ref({} as any);
const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositModalDetails = ref({} as any);
const withdrawModalDetails = ref({} as any);
const loaderStore = useLoaderStore();
const toast = useToast();
const gaslesschains = ["polygon", "polygon_amoy"];
const authStore = useAuthStore();
const isFirstTimeGasless = ref(false);
const route = useRoute();

if (route.query.optin === "1") {
  isFirstTimeGasless.value = true;
}

watch(
  () => route.query,
  () => {
    if (route.query.optin === "1") {
      isFirstTimeGasless.value = true;
    }
  }
);

const scwWallet = {
  name: "Smart Account",
  address: () => userStore.gaslessAddress,
  title: "SCW operated by Smart Contract",
  description:
    "Transact between any SendIt Smart Accounts without gas fees on Polygon POS",
  buttons: {
    deposit: true,
    withdraw: true,
    buy: true,
  },
  accountType: "scw",
};

const eoaWallet = {
  name: "Regular Account",
  address: () => userStore.address,
  title: "EOA Owned by You",
  description:
    "This is your primary wallet. Send and receive tokens between any wallets.",
  buttons: {
    deposit: true,
    withdraw: true,
    buy: true,
  },
  accountType: "eoa",
};

wallets.value.push(eoaWallet);

if (isSmartContractWalletCreated.value && authStore.loggedInWith === "") {
  wallets.value.push(scwWallet);
}

function handleBuy(wallet) {
  showBuyModal.value = true;
  buyModalDetails.value = {
    address: wallet.address(),
  };
}

function handleDeposit(wallet) {
  showDepositModal.value = true;
  depositModalDetails.value = {
    address: wallet.address(),
    accountType: wallet.accountType,
  };
}

function handleWithdraw(wallet) {
  showWithdrawModal.value = true;
  withdrawModalDetails.value = {
    address: wallet.address(),
  };
}

onBeforeMount(async () => {
  loaderStore.showLoader(
    "Loading wallets",
    "Loading your wallets and fetching balances."
  );
  wallets.value[0].assets = await fetchAllTokenBalances(userStore.address);
  if (wallets.value[1]) {
    wallets.value[1].assets = (
      await fetchAllTokenBalances(userStore.gaslessAddress)
    ).filter((asset) => gaslesschains.includes(asset.blockchain));
  }
  await getCurrencyCoverage();
  loaderStore.hideLoader();
});

watch(isSmartContractWalletCreated, () => {
  wallets.value.push(scwWallet);
});

async function createSCWWallet() {
  loaderStore.showLoader(
    "CREATING SMART WALLET",
    "Hang tight! Your Smart Contract Wallet with amazing new features such as gasless transactions is being created."
  );

  try {
    await userStore.createGaslessWallet();
    isFirstTimeGasless.value = true;
  } catch (e) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    loaderStore.hideLoader();
  }
}

async function handleDepositSuccess() {
  showDepositModal.value = false;
  if (depositModalDetails.value.accountType === "eoa") {
    wallets.value[0].assets = await fetchAllTokenBalances(userStore.address);
  } else {
    wallets.value[1].assets = (
      await fetchAllTokenBalances(userStore.gaslessAddress)
    ).filter((asset) => gaslesschains.includes(asset.blockchain));
  }
}

function handleSendToken(asset: any, accountType: string) {
  router.push({
    name: "Send",
    query: {
      sourceOfFunds: accountType,
      token: asset.contractAddress,
      blockchain: asset.blockchain,
    },
  });
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-8">
      <span class="text-3.5xl">Wallets</span>
      <span class="text-sm text-philippine-gray max-w-[720px]"
        >View all your wallets with Arcana below. Clicking on any of these
        wallets will allow you to perform actions like sending from, adding to,
        withdrawing from and transferring funds between them.
      </span>
    </div>
    <div
      class="flex gap-5 flex-wrap bg-eerie-black rounded-[10px] border border-jet mx-8 my-5 p-4"
    >
      <div
        class="relative bg-[#0e0e0e] border border-[#666] rounded-[10px] w-full max-w-[21rem] flex flex-col p-3"
        v-for="wallet in wallets"
        :key="wallet"
      >
        <div class="flex items-center gap-2">
          <span class="text-[1.25rem] font-bold text-[#d8d8d8]">{{
            wallet.name
          }}</span>
          <img
            src="@/assets/images/icons/info.svg"
            :title="wallet.description"
            class="w-[14px] h-[14px] cursor-pointer"
          />
        </div>
        <div class="flex justify-between text-[12px] text-philippine-gray">
          <span>{{ wallet.title }}</span>
          <span :title="wallet.address()">{{
            truncateAddress(wallet.address())
          }}</span>
        </div>
        <!-- <div class="text-[0.75rem] text-[#d8d8d8] mt-4">
          {{ wallet.description }}
        </div> -->
        <div
          class="bg-[#151515] rounded-[10px] h-[10rem] overflow-y-auto mt-4 p-1"
        >
          <div
            v-for="asset in wallet.assets"
            :key="JSON.stringify(asset)"
            class="p-2 flex rounded-[10px] hover:bg-[#383838] select-none text-[0.75rem] text-white mb-2 asset gap-3 items-center"
          >
            <img :src="asset.thumbnail" class="w-5 h-5" />
            <div class="flex flex-col">
              <span class="font-[400] text-[14px]">{{
                asset.tokenSymbol
              }}</span>
              <span class="text-[10px] text-[#8d8d8d]">{{
                ChainNames[asset.blockchain]
              }}</span>
            </div>
            <div class="ml-auto text-[14px]">
              {{ new Decimal(asset.balance).toDecimalPlaces(6) }}
            </div>
            <button
              class="asset-button"
              @click="handleSendToken(asset, wallet.accountType)"
            >
              <img src="@/assets/images/icons/arrow-right.svg" alt="arrow" />
            </button>
          </div>
        </div>
        <div class="flex gap-2 mt-[1rem]">
          <button
            v-if="wallet.buttons.deposit"
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
            @click.stop="handleDeposit(wallet)"
          >
            <img src="@/assets/images/icons/deposit.svg" alt="deposit" />
            Deposit Crypto
          </button>
          <button
            v-if="wallet.buttons.withdraw"
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
            @click.stop="handleWithdraw(wallet)"
          >
            <img src="@/assets/images/icons/withdraw.svg" alt="deposit" />
            Withdraw Fiat
          </button>
          <button
            v-if="wallet.buttons.buy"
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
            @click.stop="handleBuy(wallet)"
          >
            <img src="@/assets/images/icons/buy.svg" alt="deposit" />
            Buy Crypto
          </button>
        </div>
        <div
          v-if="wallet.accountType === 'scw' && isFirstTimeGasless"
          class="absolute -right-[90px] max-md:right-0 w-[100px] max-md:w-[36px]"
        >
          <img
            class="absolute top-[30px] max-md:-scale-x-[1] max-md:rotate-[90deg] max-md:top-[8px] max-md:-left-[80px]"
            src="@/assets/images/wallet-tutor-arrow-1.svg"
          />
          <span
            class="absolute capitalize font-caveat left-[50px] w-max max-md:-left-[56px] max-md:-top-[16px] text-[14px] md:text-[22px]"
            style="font-weight: 400"
            >Your new wallet</span
          >
        </div>
        <div
          v-if="wallet.accountType === 'scw' && isFirstTimeGasless"
          class="absolute bottom-[10px] left-[20px] max-md:left-[30px] w-[30px] max-md:w-[16px]"
        >
          <img
            class="absolute left-[40px]"
            src="@/assets/images/wallet-tutor-arrow-2.svg"
          />
          <span
            class="absolute font-caveat left-[80px] top-[30px] max-md:left-[60px] max-md:top-[12px] w-max text-[14px] md:text-[22px]"
            style="font-weight: 400"
            >Click deposit to start</span
          >
        </div>
      </div>
      <div
        class="bg-[#0e0e0e] border border-[#666] rounded-[10px] w-full max-w-[20rem] flex flex-col p-6"
        v-if="!isSmartContractWalletCreated && authStore.loggedInWith === ''"
      >
        <img
          class="mx-auto max-w-[12rem]"
          src="@/assets/images/illustration-icons/gasless-img.png"
        />
        <span class="text-[1.25rem] font-bold text-[#d8d8d8] mt-2"
          >My Smart Wallet</span
        >
        <div class="text-[0.75rem] text-[#d8d8d8] mt-1">
          Send and receive tokens between any SendIt Smart Wallets without
          paying gas fees on Polygon POS.
        </div>
        <button
          class="p-[0.5rem] rounded-[5px] bg-white text-black uppercase font-bold text-[0.875rem] mt-[0.75rem]"
          @click.stop="createSCWWallet"
        >
          Setup this wallet now
        </button>
      </div>
    </div>
    <BuyTokens
      v-if="showBuyModal"
      :address="buyModalDetails.address"
      @dismiss="showBuyModal = false"
    />
    <DepositTokens
      v-if="showDepositModal"
      :address="depositModalDetails.address"
      :account-type="depositModalDetails.accountType"
      @dismiss="showDepositModal = false"
      @success="handleDepositSuccess"
    />
    <WithdrawTokens
      v-if="showWithdrawModal"
      :address="withdrawModalDetails.address"
      @dismiss="showWithdrawModal = false"
    />
  </div>
</template>

<style scoped>
.asset-button {
  opacity: 0;
}
.asset:where(:hover, :focus-visible) .asset-button {
  opacity: 1;
}
</style>
