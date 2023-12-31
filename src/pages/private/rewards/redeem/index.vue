<script setup lang="ts">
import { useRouter } from "vue-router";
import { REDEEM_XP } from "@/constants/rewards";
import ClaimNFT from "@/components/ClaimNFT.vue";
import { ref } from "vue";
import useUserStore from "@/stores/user";

const router = useRouter();
const showClaimNFTPopup = ref(false);
const redeemDetails = ref({});
const userStore = useUserStore();

type Reward = {
  image: string;
  name: string;
  requiredXP: number;
};

function handleRedeem(reward: Reward) {
  if (reward.requiredXP <= userStore.points) {
    showClaimNFTPopup.value = true;
    redeemDetails.value = reward;
  } else {
    router.push({ name: "Earn XP" });
  }
}
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Redeem XP</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="flex gap-5 p-4 flex-wrap">
      <div
        class="flex flex-col bg-[#171717] rounded-[10px] overflow-hidden w-[280px]"
        v-for="reward in REDEEM_XP"
        :key="JSON.stringify(reward)"
      >
        <div
          class="flex justify-between select-none"
          :class="{ 'opacity-50': reward.requiredXP > userStore.points }"
        >
          <div class="flex flex-col p-4 gap-1">
            <span class="text-base">{{ reward.name }}</span>
            <span
              v-if="reward.requiredXP <= userStore.points"
              class="text-xs text-philippine-gray"
              >Use {{ reward.requiredXP }} XP to redeem this NFT.</span
            >
            <span v-else class="text-xs text-philippine-gray"
              >Earn XP to redeem this NFT.</span
            >
            <span class="text-sm text-philippine-gray"
              >Costs {{ reward.requiredXP }} XP</span
            >
          </div>
          <img
            :src="reward.image"
            :alt="reward.name"
            class="w-[120px] h-[120px] object-contain bg-[#252344]"
          />
        </div>
        <button
          class="bg-[#0f0f0f] text-[10px] p-3 flex gap-1 items-center justify-center"
          @click.stop="handleRedeem(reward)"
        >
          <span v-if="reward.requiredXP <= userStore.points">Claim Now</span>
          <span v-else>Earn XP</span>
          <img src="@/assets/images/icons/arrow-right.svg" alt="arrow-right" />
        </button>
      </div>
    </div>
    <ClaimNFT
      v-if="showClaimNFTPopup"
      :details="redeemDetails"
      @close="showClaimNFTPopup = false"
    />
  </div>
</template>
