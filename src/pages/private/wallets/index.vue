<script setup lang="ts">
import { ref } from "vue";

const wallets = ref([] as any[]);
const isSmartContractWalletCreated = ref(false);

wallets.value = [
  {
    name: "My Ethereum Wallet",
    address: "0x1234567890",
    title: "User Owned Wallet",
    description:
      "This is your primary wallet. Send and receive tokens between any wallets.",
    buttons: {
      deposit: true,
      withdraw: true,
      buy: true,
    },
  },
  {
    name: "My Smart Wallet",
    address: "0x1234567890",
    title: "Smart Contract Wallet",
    description:
      "Send and receive tokens between any SendIt Smart Wallets without paying gas fees on Polygon POS.",
    buttons: {
      deposit: true,
      withdraw: true,
      buy: true,
    },
  },
];
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
          <span>{{ wallet.address }}</span>
        </div>
        <div class="text-[0.75rem] text-[#d8d8d8] mt-4">
          {{ wallet.description }}
        </div>
        <div class="bg-[#151515] rounded-[10px] h-[10rem] mt-4"></div>
        <div class="flex gap-2 px-[1.25rem] mt-[1rem]">
          <button
            v-if="wallet.buttons.deposit"
            class="flex flex-grow flex-col justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
          >
            Deposit
          </button>
          <button
            v-if="wallet.buttons.withdraw"
            class="flex flex-grow flex-col justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
          >
            Withdraw
          </button>
          <button
            v-if="wallet.buttons.buy"
            class="flex flex-grow flex-col justify-center items-center p-[0.5rem] bg-[#222] rounded-[10px] text-white text-[0.75rem] w-full"
          >
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
  </div>
</template>
