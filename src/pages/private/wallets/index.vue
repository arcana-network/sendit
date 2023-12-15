<script setup lang="ts">
// import GaslessAnnouncementModal from "@/components/GaslessAnnouncementModal.vue";
import { ref } from "vue";
import { truncateAddress } from "@/utils/truncateAddress";
import useAuthStore from "@/stores/auth";
import BuyTokens from "@/components/BuyTokens.vue";
import DepositTokens from "@/components/DepositTokens.vue";

const wallets = ref([] as any[]);
const isSmartContractWalletCreated = ref(true);
const showBuyModal = ref(false);
const buyModalDetails = ref({} as any);
const authStore = useAuthStore();
const showDepositModal = ref(true);
const depositModalDetails = ref({} as any);

wallets.value = [
  {
    name: "My Ethereum Wallet",
    address: authStore.walletAddress,
    title: "User Owned Wallet",
    description:
      "This is your primary wallet. Send and receive tokens between any wallets.",
    buttons: {
      deposit: true,
      withdraw: true,
      buy: true,
    },
    accountType: "eoa",
  },
  {
    name: "My Smart Wallet",
    address: authStore.walletAddress,
    title: "Smart Contract Wallet",
    description:
      "Send and receive tokens between any SendIt Smart Wallets without paying gas fees on Polygon POS.",
    buttons: {
      deposit: true,
      withdraw: true,
      buy: true,
    },
    accountType: "scw",
  },
];

function handleBuy(wallet) {
  showBuyModal.value = true;
  buyModalDetails.value = {
    address: wallet.address,
  };
}

function handleDeposit(wallet) {
  showDepositModal.value = true;
  depositModalDetails.value = {
    address: wallet.address,
    accountType: wallet.accountType,
  };
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
        class="bg-[#0e0e0e] border border-[#666] rounded-[10px] w-full max-w-[20rem] flex flex-col p-3"
        v-for="wallet in wallets"
        :key="wallet"
      >
        <span class="text-[1.25rem] font-bold text-[#d8d8d8]">{{
          wallet.name
        }}</span>
        <div class="flex justify-between text-[0.75rem] text-philippine-gray">
          <span>{{ wallet.title }}</span>
          <span :title="wallet.address">{{
            truncateAddress(wallet.address)
          }}</span>
        </div>
        <div class="text-[0.75rem] text-[#d8d8d8] mt-4">
          {{ wallet.description }}
        </div>
        <div class="bg-[#151515] rounded-[10px] h-[10rem] mt-4"></div>
        <div class="flex gap-2 px-[1.25rem] mt-[1rem]">
          <button
            v-if="wallet.buttons.deposit"
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
            @click.stop="handleDeposit(wallet)"
          >
            <img src="@/assets/images/icons/deposit.svg" alt="deposit" />
            Deposit
          </button>
          <button
            v-if="wallet.buttons.withdraw"
            disabled
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="@/assets/images/icons/withdraw.svg" alt="deposit" />
            Withdraw
          </button>
          <button
            v-if="wallet.buttons.buy"
            class="flex flex-grow flex-col gap-1 justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
            @click.stop="handleBuy(wallet)"
          >
            <img src="@/assets/images/icons/buy.svg" alt="deposit" />
            Buy
          </button>
        </div>
      </div>
      <div
        class="bg-[#0e0e0e] border border-[#666] rounded-[10px] w-full max-w-[20rem] flex flex-col p-6"
        v-if="!isSmartContractWalletCreated"
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
        >
          Setup this wallet now
        </button>
      </div>
    </div>
    <!-- <GaslessAnnouncementModal /> -->
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
    />
  </div>
</template>
