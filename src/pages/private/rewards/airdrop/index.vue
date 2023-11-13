<script setup lang="ts">
import AirdropPhase1 from "@/assets/images/airdrop-phase-1.png";
import { truncateAddress } from "@/utils/truncateAddress";
import AirdropVerification from "@/components/AirdropVerification.vue";
import AirdropSuccess from "@/components/AirdropVerificationSuccess.vue";
import AirdropFailed from "@/components/AirdropVerificationFailed.vue";
import { onBeforeMount, reactive, ref } from "vue";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import Decimal from "decimal.js";
import useUserStore from "@/stores/user";
import dayjs from "dayjs";

const accountVerificationModal = ref({
  verify: false,
  success: false,
  failed: false,
});
const conn = useConnection();
const user = useUserStore();
const airdropPhases = reactive([] as any[]);

enum ClaimStatus {
  init = "Claim Initiated",
  complete = "Claim Completed",
}

onBeforeMount(async () => {
  const data = await conn.sendMessage(SOCKET_IDS.GET_AIRDROP_INFO);
  airdropPhases.push({
    phase: {
      name: "Phase 1",
      image: AirdropPhase1,
      status: "ongoing",
    },
    dropDetails: {
      walletAddress: user.address,
      xp: data.total_xp,
      xar: new Decimal(data.total_xar || 0).toDecimalPlaces(10).toString(),
      distributionDates: {
        start: dayjs(data.distribution_start).format("DD MMM YYYY"),
        end: dayjs(data.distribution_end).format("DD MMM YYYY"),
      },
      isVerified: data.account_verified,
      claimStatus: data.claim_status,
    },
  });
});
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
            class="absolute inset-0 flex justify-center items-center z-[2] airdrop-card-bg font-[700] text-4.5xl uppercase text-[#f7f7f7d9]"
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
              <span>{{ airdropPhase.dropDetails.xar }} XAR</span>
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
            <div
              class="text-xs flex"
              v-if="airdropPhase.dropDetails.claimStatus"
            >
              <span class="text-philippine-gray w-[16ch]">Status:</span>
              <span
                class="capitalize"
                :class="{
                  'text-[#05c168]':
                    airdropPhase.dropDetails.claimStatus ===
                    ClaimStatus.complete,
                  'text-[#eeb113]':
                    airdropPhase.dropDetails.claimStatus !==
                    ClaimStatus.complete,
                }"
              >
                {{ airdropPhase.dropDetails.claimStatus }}
              </span>
            </div>
          </div>
          <button
            v-if="!airdropPhase.dropDetails.isVerified"
            class="btn-submit rounded-t-none text-xs font-bold uppercase p-2 flex items-center justify-center"
            @click.stop="accountVerificationModal.verify = true"
          >
            Verify Account Now
            <img
              src="@/assets/images/icons/arrow-right-black.svg"
              class="ml-2"
            />
          </button>
          <button
            v-if="
              airdropPhase.dropDetails.isVerified &&
              !airdropPhase.dropDetails.claimStatus
            "
            class="btn-submit rounded-t-none text-xs font-bold uppercase p-2 flex items-center justify-center"
            @click.stop="void 0"
          >
            Claim Now
            <img
              src="@/assets/images/icons/arrow-right-black.svg"
              class="ml-2"
            />
          </button>
        </div>
      </div>
    </div>
    <AirdropVerification
      v-if="accountVerificationModal.verify"
      @success="
        accountVerificationModal.success = true;
        accountVerificationModal.verify = false;
      "
      @failed="
        accountVerificationModal.failed = true;
        accountVerificationModal.verify = false;
      "
      @dismiss="accountVerificationModal.verify = false"
    />
    <AirdropSuccess
      v-if="accountVerificationModal.success"
      @dismiss="accountVerificationModal.success = false"
      @claim="accountVerificationModal.success = false"
    />
    <AirdropFailed
      v-if="accountVerificationModal.failed"
      @dismiss="accountVerificationModal.failed = false"
      @retry="
        accountVerificationModal.failed = false;
        accountVerificationModal.verify = true;
      "
    />
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
