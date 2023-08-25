<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-8">
      <span class="text-3.5xl">Rewards</span>
      <span class="text-sm text-philippine-gray max-w-[540px]"
        >Find all your rewards below. Earn more XP to increase your leaderboard
        rank. Testnet transactions are worth ⅕ XP of mainnet transactions.</span
      >
      <span class="text-sm text-philippine-gray max-w-[720px] mt-4"
        ><strong
          >* Note: Gain Send XP for upto 50 transactions per day. No limit on
          10% bonus XP.</strong
        ></span
      >
    </div>
    <div
      class="flex mx-8 my-0 bg-eerie-black max-w-max flex-wrap py-1 px-2 border border-jet rounded-[10px] text-philippine-gray text-sm"
    >
      <router-link
        class="px-2 py-1 cursor-pointer rounded-[5px]"
        :class="{ 'bg-[#141414] text-white': route.name === 'Earn XP' }"
        :to="{ name: 'Earn XP' }"
        >Earn XP</router-link
      >
      <router-link
        class="px-2 py-1 cursor-pointer rounded-[5px]"
        :class="{ 'bg-[#141414] text-white': route.name === 'My Rewards' }"
        :to="{ name: 'My Rewards' }"
        >My Rewards</router-link
      >
    </div>
    <router-view class="m-8 mt-5"></router-view>
  </div>
</template>
