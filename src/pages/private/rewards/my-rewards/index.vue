<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import useRewardsStore from "@/stores/rewards";
import useUserStore from "@/stores/user";

const rewardsStore = useRewardsStore();
const userStore = useUserStore();

rewardsStore.fetchRewards(userStore.address);
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">My Rewards</span>
    <hr class="border-0 border-b border-b-jet" />
    <div v-if="rewardsStore.rewards.length" class="flex p-4 gap-4 flex-wrap">
      <div
        class="flex flex-col rounded-[10px] overflow-hidden bg-[#171717]"
        v-for="reward in rewardsStore.rewards"
        :key="JSON.stringify(reward)"
      >
        <img
          :src="reward.imageUrl"
          :alt="reward.name"
          class="w-[212px] h-[218px] object-cover object-center"
        />
        <span class="p-3 text-base font-[500]">{{ reward.name }}</span>
      </div>
    </div>
    <div v-else class="flex p-4 flex-wrap items-center justify-center">
      <span class="text-sm text-philippine-gray">No rewards yet.</span>
    </div>
  </div>
</template>
