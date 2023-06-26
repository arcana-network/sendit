<script setup lang="ts">
const rewards = [
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkdfs",
    description: "Use 500 XP to redeem this NFT.",
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    txHash: "dsjfhssdsfshsjkdfs",
    description: "Use 500 XP to redeem this NFT.",
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkwrwesdf",
    description: "Use 500 XP to redeem this NFT.",
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    txHash: "dfgdgfgewrewrkdfs",
    description: "Use 500 XP to redeem this NFT.",
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    txHash: "dsjfhsjdfgwerwerfwgws",
    description: "Use 500 XP to redeem this NFT.",
  },
];
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Redeem XP</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="flex gap-4 p-4 flex-wrap">
      <div
        class="flex flex-col bg-[#171717] rounded-[10px] overflow-hidden min-w-[260px]"
        v-for="reward in rewards"
        :key="JSON.stringify(reward)"
      >
        <div class="flex">
          <div class="flex flex-col p-4 gap-1">
            <span class="text-base">{{ reward.name }}</span>
            <span class="text-xs text-philippine-gray">{{
              reward.description
            }}</span>
          </div>
          <img :src="reward.image" :alt="reward.name" />
        </div>
        <button
          class="bg-[#0f0f0f] text-[10px] p-3 flex gap-1 items-center justify-center"
        >
          Claim Now
          <img src="@/assets/images/arrow-right.svg" alt="arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>
