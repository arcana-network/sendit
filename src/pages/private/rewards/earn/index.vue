<script setup lang="ts">
const rewards = [
  {
    image: "https://via.placeholder.com/30",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkdfs",
    description:
      "Invite a friend and earn XP as soon as they make their first transaction.",
    task: "Invite",
  },
  {
    image: "https://via.placeholder.com/30",
    name: "25 XAR NFT",
    txHash: "dsjfhssdsfshsjkdfs",
    description:
      "Invite a friend and earn XP as soon as they make their first transaction.",
    task: "Invite",
  },
  {
    image: "https://via.placeholder.com/30",
    name: "25 XAR NFT",
    txHash: "dsjfhsjkfhsjkwrwesdf",
    description:
      "Invite a friend and earn XP as soon as they make their first transaction.",
    task: "Tweet",
  },
  {
    image: "https://via.placeholder.com/30",
    name: "25 XAR NFT",
    txHash: "dfgdgfgewrewrkdfs",
    description:
      "Invite a friend and earn XP as soon as they make their first transaction.",
    task: "Transact",
  },
  {
    image: "https://via.placeholder.com/30",
    name: "25 XAR NFT",
    txHash: "dsjfhsjdfgwerwerfwgws",
    description:
      "Invite a friend and earn XP as soon as they make their first transaction.",
    task: "Transact",
  },
];
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Earn XP</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="grid grid-cols-3 gap-4 p-4">
      <div
        class="flex rounded-[10px] overflow-hidden border border-jet pr-5 bg-[#0e0e0e]"
        v-for="reward in rewards"
        :key="JSON.stringify(reward)"
      >
        <div
          class="flex items-center justify-center p-6 bg-[#151515] border-r-jet border-r"
        >
          <img :src="reward.image" :alt="reward.name" />
        </div>
        <div class="flex flex-col px-4 py-5">
          <span class="text-base font-bold text-[#d8d8d8]">{{
            reward.name
          }}</span>
          <span class="text-sm text-philippine-gray">{{
            reward.description
          }}</span>
        </div>
        <div class="flex items-center justify-center ml-5">
          <button class="flex gap-1 items-center justify-center text-xs">
            {{ reward.task }}
            <img src="@/assets/images/arrow-right.svg" alt="arrow" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
