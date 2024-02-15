<script setup lang="ts">
import AirdropPhase1 from "@/assets/images/airdrop-phase-1.png";
import DiamondHandsAirdrop from "@/assets/images/diamond-hands-airdrop.jpg";
import { truncateAddress } from "@/utils/truncateAddress";
import AirdropVerification from "@/components/AirdropVerification.vue";
import AirdropSuccess from "@/components/AirdropVerificationSuccess.vue";
import AirdropFailed from "@/components/AirdropVerificationFailed.vue";
import DiamondHandsAirdropFailed from "@/components/DiamondHandsAirdropFailed.vue";
import { onBeforeMount, reactive, ref } from "vue";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import Decimal from "decimal.js";
import useUserStore from "@/stores/user";
import dayjs from "dayjs";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";
import useAuthStore from "@/stores/auth";
import { useRoute } from "vue-router";
import { hexlify } from "ethers";

const accountVerificationModal = ref({
  verify: false,
  success: false,
  failed: false,
});
const conn = useConnection();
const user = useUserStore();
const airdropPhases = reactive([] as any[]);
const loaderStore = useLoaderStore();
const verificationFailMsg = ref("");
const toast = useToast();
const selectedAirdropPhase = ref({} as any);
const authStore = useAuthStore();
const route = useRoute();
const isDiamondHandAirdropFailed = ref(false);
const diamondHandError = ref(0);

enum ClaimStatus {
  init = "Claim Initiated",
  complete = "Claim Completed",
  failed = "Claim Failed - Verification Unsuccessful.",
  verified = "Account Verified",
}

enum PhaseStatus {
  ongoing,
  upcoming,
  closed,
}

enum PhaseIds {
  ph1,
  ph2,
  dha,
}

const claimFailedReason = {
  64: "Claim Failed - Twitter account already linked to another wallet.",
  128: "Claim Failed - Twitter account was created post 01 Sep'23.",
};

function generateFailMsg(code) {
  selectedAirdropPhase.value.dropDetails.claimStatus = ClaimStatus.failed;
  if (code === 564) {
    verificationFailMsg.value =
      "Claim Failed - Twitter account already linked to another wallet.";
    selectedAirdropPhase.value.dropDetails.claimFailedReason =
      claimFailedReason[64];
  } else if (code === 570) {
    verificationFailMsg.value =
      "Claim Failed - Twitter account was created post 01 Sep'23.";
    selectedAirdropPhase.value.dropDetails.claimFailedReason =
      claimFailedReason[128];
  }
}

onBeforeMount(async () => {
  loaderStore.showLoader("Fetching airdrop details...");
  try {
    const data = await conn.sendMessage(SOCKET_IDS.GET_AIRDROP_INFO);
    airdropPhases.push({
      phase: {
        name: "Sendit Drop Phase 2",
        image: AirdropPhase1,
        status: PhaseStatus.closed,
        id: PhaseIds.ph2,
      },
      dropDetails: {
        walletAddress: user.address,
        xp: data.ph2?.eligible_xp ?? 0,
        xar: data.ph2.eligible_xar
          ? new Decimal(data.ph2.eligible_xar).toDecimalPlaces(9).toString()
          : null,
        distributionDates: {
          desc: "3 to 6 months post TGE",
        },
        isVerified: data.twitter_verified,
        claimStatus: data.ph2?.claimed
          ? ClaimStatus.init
          : data.twitter_verified && data.twitter_errors
          ? ClaimStatus.failed
          : data.twitter_verified
          ? ClaimStatus.verified
          : false,
        claimFailedReason: claimFailedReason[data.twitter_errors],
      },
    });
    airdropPhases.push({
      phase: {
        name: "Sendit Drop Phase 1",
        image: AirdropPhase1,
        status: PhaseStatus.closed,
        id: PhaseIds.ph1,
      },
      dropDetails: {
        walletAddress: user.address,
        xp: data.ph1?.eligible_xp ?? 0,
        xar: new Decimal(data.ph1.eligible_xar || 0)
          .toDecimalPlaces(9)
          .toString(),
        distributionDates: {
          desc: "1 to 3 months post TGE",
        },
        isVerified: data.twitter_verified,
        claimStatus: data.ph1?.claimed
          ? ClaimStatus.init
          : data.twitter_verified && data.twitter_errors
          ? ClaimStatus.failed
          : data.twitter_verified
          ? ClaimStatus.verified
          : false,
        claimFailedReason: claimFailedReason[data.twitter_errors],
      },
    });
    if (
      authStore.loggedInWith !== "" ||
      route.query.campaign === "diamond-hands-airdrop"
    ) {
      const balance = hexlify(
        data.diamond_hands_eligibility_report.bico_balance
      );
      const nftBalance = hexlify(
        data.diamond_hands_eligibility_report.bcr_balance
      );
      const bico =
        balance === "0x"
          ? new Decimal(0)
          : new Decimal(balance).div(Decimal.pow(10, 18));
      const bicoNFT =
        nftBalance === "0x" ? new Decimal(0) : new Decimal(nftBalance);
      const xar =
        bico.greaterThanOrEqualTo(1000) || bicoNFT.greaterThanOrEqualTo(1)
          ? 250
          : 0;
      // const status =
      //   dayjs().isBefore(data.diamond_hands?.claim_start) ||
      //   dayjs().isAfter(data.diamond_hands?.claim_end)
      //     ? PhaseStatus.closed
      //     : PhaseStatus.ongoing;
      airdropPhases.push({
        phase: {
          name: "Diamond Hands",
          image: DiamondHandsAirdrop,
          status: PhaseStatus.closed,
          id: PhaseIds.dha,
          eligibility:
            "1,000 BICO tokens or 1 Bico Early Adopter NFT required on both claim and distribution dates.",
        },
        dropDetails: {
          walletAddress: user.address,
          bico: bico.toString(),
          bicoNFT: bicoNFT.toString(),
          isEligible: data.diamond_hands_eligibility_report.eligible,
          xar,
          distributionDates: {
            start: dayjs(
              data.diamond_hands?.distribution_start || new Date()
            ).format("DD MMM YYYY"),
          },
          claimDates: {
            start: dayjs(data.diamond_hands?.claim_start || new Date()).format(
              "DD MMM YYYY"
            ),
            end: dayjs(data.diamond_hands?.claim_end || new Date()).format(
              "DD MMM YYYY"
            ),
          },
          isVerified: data.twitter_verified,
          claimStatus: data.diamond_hands?.claimed ? ClaimStatus.init : false,
        },
      });
    }
  } finally {
    loaderStore.hideLoader();
  }
});

async function handleClaim(phaseId: PhaseIds) {
  loaderStore.showLoader("Claiming airdrop...");
  const socketId =
    phaseId === PhaseIds.dha
      ? SOCKET_IDS.CLAIM_DIAMOND_HANDS_AIRDROP
      : phaseId === PhaseIds.ph1
      ? SOCKET_IDS.CLAIM_PHASE_1
      : SOCKET_IDS.CLAIM_PHASE_2;
  const phaseIndex = airdropPhases.findIndex(
    (phase) => phase.phase.id === phaseId
  );
  accountVerificationModal.value.success = false;
  if (airdropPhases[phaseIndex].phase.status !== PhaseStatus.ongoing) {
    toast.error(
      `Airdrop ${airdropPhases[phaseIndex].phase.name} is not live yet.`
    );
    loaderStore.hideLoader();
    return;
  }
  try {
    const airdropData = await conn.sendMessage(socketId);
    console.log({ airdropData });
    airdropPhases[phaseIndex].dropDetails.claimStatus = ClaimStatus.init;
    airdropPhases[phaseIndex].dropDetails.isVerified = true;
  } catch (e: any) {
    console.log(e);
    if (phaseId === PhaseIds.dha) {
      isDiamondHandAirdropFailed.value = true;
      diamondHandError.value = e.code;
    } else {
      toast.error(e.message);
    }
  } finally {
    loaderStore.hideLoader();
  }
}

function handleVerificationFailed(msg) {
  airdropPhases.forEach((phase) => {
    phase.dropDetails.claimStatus = ClaimStatus.failed;
    phase.dropDetails.isVerified = true;
    phase.dropDetails.claimFailedReason = msg;
  });
}

function handleVerificationSuccess() {
  airdropPhases.forEach((phase) => {
    phase.dropDetails.claimStatus = ClaimStatus.verified;
    phase.dropDetails.isVerified = true;
  });
}
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Airdrop</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="flex p-4 gap-4 flex-wrap">
      <div
        v-for="airdropPhase in airdropPhases"
        :key="JSON.stringify(airdropPhase.phase)"
        class="relative isolate flex flex-col w-full max-w-[400px] rounded-[10px] overflow-hidden bg-[#171717]"
      >
        <div
          class="absolute inset-0 bg-[#111111c2] z-[10] flex justify-center items-center text-center"
          v-if="
            airdropPhase.phase.status === PhaseStatus.closed &&
            airdropPhase.dropDetails.claimStatus !== ClaimStatus.complete &&
            airdropPhase.dropDetails.claimStatus !== ClaimStatus.init
          "
        >
          <span class="text-[24px] font-bold text-[#f7f7f7a6] uppercase"
            >Closed</span
          >
        </div>
        <div class="relative">
          <img
            :src="airdropPhase.phase.image"
            loading="lazy"
            class="w-full h-[150px] object-cover object-center z-[1] opacity-85"
          />
          <div
            class="absolute inset-0 flex justify-center items-center text-center z-[2] font-[700] text-4xl uppercase text-[#f7f7f7d9]"
            :class="{
              'airdrop-card-bg': airdropPhase.phase.id !== PhaseIds.dha,
              '-mt-3': airdropPhase.phase.id === PhaseIds.dha,
            }"
          >
            {{ airdropPhase.phase.name }}
          </div>
        </div>
        <div class="flex flex-col h-full">
          <div class="flex flex-col gap-1 p-4">
            <span class="font-[700] text-sm uppercase">Drop Details</span>
            <div v-if="airdropPhase.phase.eligibility" class="text-xs flex">
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >Eligibility:</span
              >
              <span>{{ airdropPhase.phase.eligibility }}</span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >Wallet Address:</span
              >
              <span>{{
                truncateAddress(airdropPhase.dropDetails.walletAddress)
              }}</span>
            </div>
            <div
              class="text-xs flex"
              v-if="airdropPhase.phase.id === PhaseIds.dha"
            >
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >BICO Tokens:</span
              >
              <span>{{ airdropPhase.dropDetails.bico }}</span>
            </div>
            <div
              class="text-xs flex"
              v-if="airdropPhase.phase.id === PhaseIds.dha"
            >
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >BICO NFTs:</span
              >
              <span>{{ airdropPhase.dropDetails.bicoNFT }}</span>
            </div>
            <div class="text-xs flex" v-else>
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >XP Gained:</span
              >
              <span>{{ airdropPhase.dropDetails.xp }}</span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >XAR Eligible Reward:</span
              >
              <span v-if="airdropPhase.dropDetails.xar"
                >{{ airdropPhase.dropDetails.xar }} XAR</span
              >
              <span v-else>-</span>
            </div>
            <div
              class="text-xs flex"
              v-if="airdropPhase.dropDetails.claimDates?.start"
            >
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >Claim Date:</span
              >
              <span>
                {{ airdropPhase.dropDetails.claimDates.start }}
                -
                {{ airdropPhase.dropDetails.claimDates.end }}
              </span>
            </div>
            <div class="text-xs flex">
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >Distribution Date:</span
              >
              <span v-if="airdropPhase.dropDetails.distributionDates.desc">{{
                airdropPhase.dropDetails.distributionDates.desc
              }}</span>
              <span v-else>
                {{ airdropPhase.dropDetails.distributionDates.start }}
                <span v-if="airdropPhase.dropDetails.distributionDates.end"
                  >-
                  {{ airdropPhase.dropDetails.distributionDates.end }}
                </span>
              </span>
            </div>
            <div
              class="text-xs flex"
              v-if="airdropPhase.dropDetails.claimStatus"
            >
              <span class="text-philippine-gray w-[16ch] shrink-0"
                >Status:</span
              >
              <span
                class="capitalize"
                :class="{
                  'text-[#05c168]':
                    airdropPhase.dropDetails.claimStatus ===
                      ClaimStatus.complete ||
                    airdropPhase.dropDetails.claimStatus ===
                      ClaimStatus.verified,
                  'text-[#eeb113]':
                    airdropPhase.dropDetails.claimStatus === ClaimStatus.init,
                  'text-[#ff4264]':
                    airdropPhase.dropDetails.claimStatus ===
                      ClaimStatus.failed &&
                    airdropPhase.phase.id !== PhaseIds.dha,
                }"
              >
                {{
                  airdropPhase.dropDetails.claimFailedReason ||
                  airdropPhase.dropDetails.claimStatus
                }}
              </span>
            </div>
          </div>
          <button
            v-if="
              !airdropPhase.dropDetails.isVerified &&
              airdropPhase.phase.id !== PhaseIds.dha &&
              airdropPhase.phase.status !== PhaseStatus.closed
            "
            class="btn-submit mt-auto rounded-t-none text-xs font-bold uppercase p-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            @click.stop="
              accountVerificationModal.verify = true;
              selectedAirdropPhase = airdropPhase;
            "
          >
            Verify to Claim
            <img
              src="@/assets/images/icons/arrow-right-black.svg"
              class="ml-2"
            />
          </button>
          <button
            v-else-if="
              (!airdropPhase.dropDetails.claimStatus ||
                airdropPhase.dropDetails.claimStatus === ClaimStatus.verified ||
                airdropPhase.phase.id === PhaseIds.dha) &&
              airdropPhase.phase.status !== PhaseStatus.closed
            "
            class="btn-submit mt-auto rounded-t-none text-xs font-bold uppercase p-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            @click.stop="handleClaim(airdropPhase.phase.id)"
            :disabled="
              airdropPhase.phase.status !== PhaseStatus.ongoing ||
              (airdropPhase.phase.id === PhaseIds.dha &&
                !airdropPhase.dropDetails.isEligible)
            "
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
        handleVerificationSuccess();
        accountVerificationModal.verify = false;
      "
      @failed="
        (code) => {
          accountVerificationModal.failed = true;
          accountVerificationModal.verify = false;
          generateFailMsg(code);
        }
      "
      @dismiss="accountVerificationModal.verify = false"
    />
    <AirdropSuccess
      v-if="accountVerificationModal.success"
      @dismiss="accountVerificationModal.success = false"
      @claim="handleClaim(selectedAirdropPhase.phase.id)"
    />
    <AirdropFailed
      v-if="accountVerificationModal.failed"
      :message="verificationFailMsg"
      @dismiss="
        accountVerificationModal.failed = false;
        handleVerificationFailed(verificationFailMsg);
        verificationFailMsg = '';
      "
    />
    <DiamondHandsAirdropFailed
      v-if="isDiamondHandAirdropFailed"
      :reason="diamondHandError"
      @dismiss="
        isDiamondHandAirdropFailed = false;
        diamondHandError = 0;
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
