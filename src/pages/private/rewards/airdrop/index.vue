<script setup lang="ts">
import AirdropPhase1 from "@/assets/images/airdrop-phase-1.png";
import { truncateAddress } from "@/utils/truncateAddress";

const airdropPhases = [
  {
    phase: {
      name: "Phase 1",
      image: AirdropPhase1,
      status: "ongoing",
    },
    dropDetails: {
      walletAddress: "sjdhfksdfjkdshfjksdfs",
      xp: 500,
      xar: 50,
      distributionDates: {
        start: "22 Jan 2024",
        end: "22 Mar 2024",
      },
      isVerified: false,
      verifiedOn: null,
      claimStatus: null,
    },
  },
];
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Airdrop</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="flex p-4 gap-4 flex-wrap">
      <div
        v-for="airdropPhase in airdropPhases"
        :key="JSON.stringify(airdropPhase.phase)"
        class="flex flex-col w-full max-w-[400px] rounded-[10px] overflow-hidden bg-[#171717]"
      >
        <div class="relative">
          <img
            :src="airdropPhase.phase.image"
            class="w-full h-[150px] object-cover object-center z-[1]"
          />
          <div
            class="absolute inset-0 flex justify-center items-center z-[2] airdrop-card-bg font-[700] text-4.5xl uppercase"
          >
            {{ airdropPhase.phase.name }}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-col gap-1 p-4">
            <span class="font-[700] text-sm uppercase">Drop Details</span>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch]">Wallet Address:</span>
              <span>{{
                truncateAddress(airdropPhase.dropDetails.walletAddress)
              }}</span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch]">XP Gained:</span>
              <span>{{ airdropPhase.dropDetails.xp }}</span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch]"
                >XAR Eligible Reward:</span
              >
              <span>{{ airdropPhase.dropDetails.xar }}</span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch]"
                >Distribution Date:</span
              >
              <span>
                {{ airdropPhase.dropDetails.distributionDates.start }} -
                {{ airdropPhase.dropDetails.distributionDates.end }}
              </span>
            </div>
          </div>
          <button
            v-if="!airdropPhase.dropDetails.isVerified"
            class="btn-submit rounded-t-none text-xs font-bold uppercase p-2 flex items-center justify-center"
          >
            Verify Account Now
            <img
              src="@/assets/images/icons/arrow-right-black.svg"
              class="ml-2"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.airdrop-card-bg {
  background: linear-gradient(
    360deg,
    rgba(17, 17, 17, 0.75) 0%,
    rgba(17, 17, 17, 0.01) 100%
  );
}
</style>
