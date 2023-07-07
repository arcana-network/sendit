<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
// import dayjs from "dayjs";
// import { ethers } from "ethers";
import { composeAndSendTweet } from "@/utils/tweet";
import TweetVerify from "@/components/TweetVerify.vue";
import { hexlify, formatEther } from "ethers";
import { nativeUnitMapping } from "@/constants/unitMapping.ts";
import dayjs from "dayjs";

const socket = useSocketConnection();

const history = ref([] as any[]);
const showTweetVerificationModal = ref(false);

onBeforeMount(() => {
  fetchTxHistory();
});

async function fetchTxHistory() {
  const message = {
    offset: 0,
    count: 500,
  };
  const txHistory = (await socket.sendMessage(
    SOCKET_IDS.GET_TX_HISTORY,
    message
  )) as { txns: any[] };
  history.value = txHistory.txns.map((record) => {
    return {
      amount: {
        value: formatEther(hexlify(record.amount)),
        currency: nativeUnitMapping[Number(record.chainId)],
      },
      txHash: hexlify(record.hash),
      txStatus: record.sent ? "sent" : "received",
      socialId: record.user.verifier_human || hexlify(record.user_address),
      walletAddress: hexlify(record.user_address),
      link: record.link,
      points: record.points || "",
      isSharedOnTwitter: record.shared || false,
      date: dayjs.unix(record.tx_date).format("DD MMM YYYY"),
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
        Transactions
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
                {{ record.walletAddress }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis"
                :title="record.link"
              >
                {{ record.link }}
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
                <span v-else class="text-philippine-gray text-center"
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
            class="flex p-4 w-full"
            :class="{ 'border-jet border-0 border-t-1': index !== 0 }"
          >
            <div class="px-2 flex flex-col gap-1 w-[60%]">
              <div
                class="text-sm font-bold text-[14px]"
                :title="record.walletAddress"
              >
                <span class="capitalize">{{ record.txStatus }}</span
                >&nbsp;
                <span
                  >{{ record.amount.value }} {{ record.amount.currency }}</span
                >
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray"
                  >{{ record.txStatus === "sent" ? "To" : "From" }}:</span
                >&nbsp;
                <span>{{ record.socialId }}</span>
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray">Wallet Address:</span>&nbsp;
                <span>{{ record.walletAddress }}</span>
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray">SendIt Link:</span>&nbsp;
                <span>{{ record.link }}</span>
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray">{{ record.date }}</span>
              </div>
              <div class="text-[10px] text-philippine-gray">
                {{ record.joinDate }}
              </div>
            </div>
            <button
              v-if="!record.isSharedOnTwitter"
              class="flex flex-col p-3 rounded-[5px] bg-[#1a1a1a] justify-center items-center ml-auto"
              @click.stop="shareTweet(record)"
            >
              <img src="@/assets/images/icons/twitter-blue.svg" class="my-3" />
              <div
                class="leaderboard-table-row-item text-[#659CFF] text-[10px] bg-[#293C5F] px-2 py-1 rounded-[5px]"
              >
                Earn 40 XP
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        class="leaderboard-table-body px-2 py-4 flex items-center justify-center text-sm"
      >
        No transactions found.
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
