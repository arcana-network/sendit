<script setup lang="ts">
const rewards = [
  {
    image: "https://via.placeholder.com/212X218",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkdfs",
  },
  {
    image: "https://via.placeholder.com/212X218",
    name: "25 XAR NFT",
    txHash: "dsjfhssdsfshsjkdfs",
  },
  {
    image: "https://via.placeholder.com/212X218",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkwrwesdf",
  },
  {
    image: "https://via.placeholder.com/212X218",
    name: "25 XAR NFT",
    txHash: "dfgdgfgewrewrkdfs",
  },
  {
    image: "https://via.placeholder.com/212X218",
    name: "25 XAR NFT",
    txHash: "dsjfhsjdfgwerwerfwgws",
  },
];
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">My Rewards</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="flex p-4 gap-4 flex-wrap">
      <div
        class="flex flex-col rounded-[10px] overflow-hidden bg-[#171717]"
        v-for="reward in rewards"
        :key="JSON.stringify(reward)"
      >
        <img :src="reward.image" :alt="reward.name" />
        <span class="p-3 text-base font-[500]">{{ reward.name }}</span>
      </div>
    </div>
  </div>
</template>
