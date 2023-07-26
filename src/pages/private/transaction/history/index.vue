<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
// import dayjs from "dayjs";
// import { ethers } from "ethers";
import { composeAndSendTweet } from "@/utils/tweet";
import TweetVerify from "@/components/TweetVerify.vue";
import { hexlify, formatUnits } from "ethers";
import { nativeUnitMapping } from "@/constants/unitMapping.ts";
import dayjs from "dayjs";
import useUserStore from "@/stores/user";
import { normaliseTwitterHandle } from "@/utils/normalise";
import useLoaderStore from "@/stores/loader";
import copyToClipboard from "@/utils/copyToClipboard";
import { useToast } from "vue-toastification";
import chainList from "@/constants/chainList";
import generateSenditUrl from "@/utils/generateSenditUrl";
import { beautifyAmount } from "@/utils/beautifyAmount";

const socket = useSocketConnection();

const history = ref([] as any[]);
const showTweetVerificationModal = ref(false);
const userStore = useUserStore();
const tweetVerificationHash = ref("");
const loaderStore = useLoaderStore();
const toast = useToast();
let currentPage = 1;
let endOFHistory = false;

onBeforeMount(async () => {
  fetchTxHistory();
  userStore.fetchUserPointsAndRank();
  document.onscroll = function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - window.outerHeight * 0.4
    ) {
      if (!endOFHistory) {
        currentPage++;
        fetchTxHistory();
      }
    }
  };
});

function getDecimals(info: any) {
  if ("decimals" in info) {
    return (info.decimals as number) || 0;
  }
  return 18;
}

function getCurrency(chainId: string | number, info: any) {
  if ("symbol" in info) {
    return info.symbol || "units";
  }
  return nativeUnitMapping[Number(chainId)];
}

onBeforeUnmount(() => {
  document.onscroll = null;
  currentPage = 1;
});

async function fetchTxHistory() {
  if (currentPage === 1) {
    loaderStore.showLoader("Loading transaction history...");
  } else {
    loaderStore.showLoader("Loading more transactions...");
  }
  const message = {
    offset: (currentPage - 1) * 20,
    count: 20,
  };
  const txHistory = (await socket.sendMessage(
    SOCKET_IDS.GET_TX_HISTORY,
    message
  )) as { txns: any[] };
  const txns = txHistory.txns.map((record) => {
    let points;
    if (!record.sent) {
      if (record.shared) {
        points = "5";
      } else {
        points = "";
      }
    } else {
      if (record.shared) {
        points = record.points + 5;
      } else {
        points = record.points;
      }
    }
    return {
      amount: {
        value: formatUnits(hexlify(record.amount), getDecimals(record.info)),
        currency: getCurrency(record.chainId, record.info),
      },
      chain: chainList[Number(record.chainId)]?.name || "N/A",
      txHash: hexlify(record.hash),
      txStatus: record.sent ? "sent" : "received",
      socialId: record.user.verifier_human || hexlify(record.user_address),
      verifier: record.user?.verifier,
      walletAddress: hexlify(record.user_address),
      link: record.share_url,
      points,
      isSharedOnTwitter: record.shared || false,
      date: dayjs.unix(record.tx_date).format("DD MMM YYYY"),
    };
  });
  if (txns.length < 20) endOFHistory = true;
  if (currentPage === 1) history.value = txns;
  else history.value = [...history.value, ...txns];
  loaderStore.hideLoader();
}

async function copy(data: string, message: string) {
  if (data) {
    await copyToClipboard(data);
    toast.success(message);
  }
}

function getSocialId(socialId: string, verifier: number) {
  if (verifier === 1) {
    return normaliseTwitterHandle(socialId);
  }
  return socialId;
}

function shareTweet(record) {
  const tweet =
    record.txStatus === "sent"
      ? `Whoosh! I just sent crypto to ${getToValue(
          record.verifier,
          record.socialId
        )} using #SendIt! Join the #GetOnWeb3 revolution at ${generateSenditUrl()}! `
      : `Cha-ching! 💸 Just received crypto on #SendIt. Join the #GetOnWeb3 revolution at ${generateSenditUrl()}! `;
  composeAndSendTweet(tweet);
  tweetVerificationHash.value = record.txHash;
  showTweetVerificationModal.value = true;
}

function getToValue(verifier, verifier_human) {
  if (verifier === 1) {
    return `${normaliseTwitterHandle(verifier_human)}`;
  } else return `an email address`;
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-8 max-lg:px-4">
      <span class="text-3.5xl">Transaction History</span>
      <span class="text-sm text-philippine-gray max-w-[720px]"
        >All your previously completed transactions are listed below. You can
        use this page to give us a shout-out and earn points for past
        transactions if you hadn’t done so already!</span
      >
    </div>
    <div
      class="flex-col bg-eerie-black rounded-[10px] border border-jet mx-8 max-lg:mx-4 my-5 overflow-hidden"
    >
      <div
        class="hidden md:grid leaderboard-table-header text-[12px] text-philippine-gray py-4 px-6"
      >
        <div class="leaderboard-table-header-item">Date</div>
        <div class="leaderboard-table-header-item">Amount</div>
        <div class="leaderboard-table-header-item">Chain</div>
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
              <div
                class="leaderboard-table-row-item"
                :title="`${record.amount.value} ${record.amount.currency}`"
              >
                {{ beautifyAmount(record.amount.value) }}
                {{ record.amount.currency }}
              </div>
              <div class="leaderboard-table-row-item">{{ record.chain }}</div>
              <div
                class="leaderboard-table-row-item ellipsis cursor-pointer"
                :title="record.socialId"
                @click.stop="copy(record.socialId, 'Social ID copied')"
              >
                {{ getSocialId(record.socialId, record.verifier) }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis cursor-pointer"
                :title="record.walletAddress"
                @click.stop="
                  copy(record.walletAddress, 'Wallet address copied')
                "
              >
                {{ record.walletAddress }}
              </div>
              <div
                class="leaderboard-table-row-item ellipsis cursor-pointer"
                :title="record.link"
                @click.stop="copy(record.link, 'SendIt link copied')"
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
                  class="underline cursor-pointer"
                  v-if="!record.isSharedOnTwitter"
                  @click.stop="shareTweet(record)"
                >
                  Share on Twitter
                </button>
                <div v-else class="text-philippine-gray lg-max:text-center">
                  Shared on Twitter
                </div>
              </div>
              <div
                v-if="!record.isSharedOnTwitter"
                class="leaderboard-table-row-item text-center text-[#659CFF] text-[10px] bg-[#293C5F] px-1 rounded-[5px] grid content-center"
              >
                Earn 5 XP
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
              <div class="text-sm font-bold text-[14px]">
                <span class="capitalize">{{ record.txStatus }}</span
                >&nbsp;
                <span
                  >{{ record.amount.value }} {{ record.amount.currency }}</span
                >
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray">Chain:</span>&nbsp;
                <span>{{ record.chain }}</span>
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray"
                  >{{ record.txStatus === "sent" ? "To" : "From" }}:</span
                >&nbsp;
                <span
                  @click.stop="copy(record.socialId, 'Social ID copied')"
                  class="cursor-pointer"
                  >{{ record.socialId }}</span
                >
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray">Wallet Address:</span>&nbsp;
                <span
                  :title="record.walletAddress"
                  @click.stop="
                    copy(record.walletAddress, 'Wallet address copied')
                  "
                  class="cursor-pointer"
                  >{{ record.walletAddress }}</span
                >
              </div>
              <div class="text-xs ellipsis" v-if="record.link">
                <span class="text-philippine-gray">SendIt Link:</span>&nbsp;
                <span
                  @click.stop="copy(record.link, 'SendIt link copied')"
                  class="cursor-pointer"
                  >{{ record.link }}</span
                >
              </div>
              <div v-if="record.points" class="text-xs ellipsis">
                <span class="text-philippine-gray">Points Earned:</span>&nbsp;
                <span class="font-bold">{{ record.points }}</span>
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
              class="flex flex-col p-3 rounded-[5px] bg-[#1a1a1a] justify-center items-center ml-auto cursor-pointer"
              @click.stop="shareTweet(record)"
            >
              <img src="@/assets/images/icons/twitter-blue.svg" class="my-3" />
              <div
                class="leaderboard-table-row-item text-[#659CFF] text-[10px] bg-[#293C5F] px-1 py-1 rounded-[5px] text-center"
              >
                Earn 5 XP
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
      :xp="5"
      :hash="tweetVerificationHash"
    />
  </div>
</template>

<style scoped>
.leaderboard-table-header,
.leaderboard-table-row {
  grid-template-columns:
    calc(10% - 0.5rem) 8% 10% calc(12% - 0.5rem) calc(13% - 0.5rem)
    calc(18% - 0.5rem) 6% 4% 10% 5%;
  grid-gap: 0.5rem;
}

.star-icon::before {
  position: absolute;
  content: "";
  inset: -4px;
  border-radius: 50%;
}
</style>
