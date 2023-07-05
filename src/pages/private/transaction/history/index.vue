<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
// import { useRoute } from "vue-router";
// import StarIcon from "@/components/StarIcon.vue";
// import useSocketConnection from "@/use/socketConnection";
// import { SOCKET_IDS, LEADERBOARD_TYPES } from "@/constants/socket-ids";
import { truncateAddress } from "@/utils/truncateAddress";
// import dayjs from "dayjs";
// import { ethers } from "ethers";
import historyMock from "@/constants/tx-history.mock";
import { composeAndSendTweet } from "@/utils/tweet";
import TweetVerify from "@/components/TweetVerify.vue";

// const route = useRoute();
// const socket = useSocketConnection();

const history = ref([] as any[]);
const showTweetVerificationModal = ref(false);

onBeforeMount(() => {
  fetchTxHistory();
});

function getLink(record) {
  return `https://sendit.arcana.network/${record.socialId}`;
}

async function fetchTxHistory() {
  history.value = historyMock.map((record) => {
    return {
      ...record,
    };
  });
}

function shareTweet(record) {
  const tweet =
    record.txStatus === "sent"
      ? `Just did a crypto transfer on #SendIt! No wallet, no problem. Join the revolution at https://sendit.arcana.network! `
      : `Just received a crypto transfer on #SendIt! No wallet, no problem. Join the revolution at https://sendit.arcana.network! `;
  composeAndSendTweet(tweet);
  showTweetVerificationModal.value = true;
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-8">
      <span class="text-3.5xl">Transaction History</span>
      <span class="text-sm text-philippine-gray max-w-[720px]"
        >All your previously completed transactions are listed below. You can
        use this page to give us a shout-out and earn points for past
        transactions if you hadn’t done so already!</span
      >
    </div>
    <div
      class="flex-col bg-eerie-black rounded-[10px] border border-jet mx-8 my-5 overflow-hidden"
    >
      <div
        class="hidden md:grid leaderboard-table-header text-[12px] text-philippine-gray py-4 px-6"
      >
        <div class="leaderboard-table-header-item">Date</div>
        <div class="leaderboard-table-header-item">Amount</div>
        <div class="leaderboard-table-header-item">Social ID</div>
        <div class="leaderboard-table-header-item">Wallet Address</div>
        <div class="leaderboard-table-header-item">Sendit Link</div>
        <div class="leaderboard-table-header-item">Tx Status</div>
        <div class="leaderboard-table-header-item">Points</div>
        <div class="leaderboard-table-header-item">Share</div>
        <div class="leaderboard-table-header-item"></div>
      </div>
      <div class="grid md:hidden py-4 px-6 uppercase font-bold text-xs">
        Rankings
      </div>
      <hr class="border-jet border-0 border-b-1" />
      <div v-if="history.length">
        <div class="hidden md:block px-2 py-4">
          <div class="px-1 py-3">
            <div
              class="grid leaderboard-table-row px-3 py-2 text-sm rounded-[5px] hover:bg-[#464646]"
              v-for="record in history"
              :key="record.txHash"
            >
              <div class="leaderboard-table-row-item">{{ record.date }}</div>
              <div class="leaderboard-table-row-item">
                {{ record.amount.value }} {{ record.amount.currency }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis"
                :title="record.socialId"
              >
                {{ record.socialId }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis"
                :title="record.walletAddress"
              >
                {{ truncateAddress(record.walletAddress) }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis"
                :title="getLink(record)"
              >
                {{ getLink(record) }}
              </div>
              <div
                class="leaderboard-table-row-item flex justify-between w-[6rem] capitalize"
              >
                {{ record.txStatus }}
              </div>
              <div v-if="record.points" class="leaderboard-table-row-item">
                {{ record.points }}
              </div>
              <div v-else class="leaderboard-table-row-item">-</div>
              <div class="leaderboard-table-row-item">
                <button
                  class="underline"
                  v-if="!record.isSharedOnTwitter"
                  @click.stop="shareTweet(record)"
                >
                  Share on Twitter
                </button>
                <span v-else class="text-philippine-gray"
                  >Shared on Twitter</span
                >
              </div>
              <div
                v-if="!record.isSharedOnTwitter"
                class="leaderboard-table-row-item text-[#659CFF] text-[10px] bg-[#293C5F] px-1 rounded-[5px]"
              >
                Earn 40 XP
              </div>
              <div v-else></div>
            </div>
          </div>
        </div>
        <div class="block md:hidden">
          <div
            v-for="(record, index) in history"
            :key="record.txHash"
            class="flex"
            :class="{ 'border-jet border-0 border-t-1': index !== 0 }"
          >
            <div
              class="relative border-0 border-r-1 border-jet bg-[#151515] w-[60px] flex justify-center items-center"
            >
              <span
                class="text-[24px] font-bold"
                :class="{
                  'text-[#b8a26a]': ranker.rank === 1,
                  'text-[#7fc987]': ranker.rank === 2,
                  'text-[#7896cc]': ranker.rank === 3,
                }"
              >
                {{ ranker.rank }}
              </span>
              <div
                class="absolute star-icon top-3 -right-2"
                v-if="[1, 2, 3].includes(ranker.rank)"
                :class="{
                  'before:bg-[#3c331d] text-[#eeb113]': ranker.rank === 1,
                  'before:bg-[#1e3020] text-[#51c7f5]': ranker.rank === 2,
                  'before:bg-[#1d2734] text-[#568df0]': ranker.rank === 3,
                }"
              >
                <StarIcon class="relative h-4 w-4" />
              </div>
            </div>
            <div
              class="px-4 py-3 flex flex-col gap-2"
              :class="{
                'text-[#b8a26a]': ranker.rank === 1,
                'text-[#7fc987]': ranker.rank === 2,
                'text-[#7896cc]': ranker.rank === 3,
              }"
            >
              <div class="text-sm" :title="ranker.walletAddress">
                {{ truncateAddress(ranker.walletAddress) }}
              </div>
              <div class="text-xs">
                {{ ranker.xp }} XP & {{ ranker.transactions }} Txn
              </div>
              <div class="text-[10px] text-philippine-gray">
                {{ ranker.joinDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="leaderboard-table-body px-2 py-4 flex items-center justify-center text-sm"
      >
        No rankings yet.
      </div>
    </div>
    <TweetVerify
      v-if="showTweetVerificationModal"
      @close="showTweetVerificationModal = false"
      :xp="40"
    />
  </div>
</template>

<style scoped>
.leaderboard-table-header,
.leaderboard-table-row {
  grid-template-columns: 10% 8% 12% 13% 20% 7% 5% 10% 5%;
  grid-gap: 1rem;
}

.star-icon::before {
  position: absolute;
  content: "";
  inset: -4px;
  border-radius: 50%;
}
</style>
