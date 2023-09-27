<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { composeAndSendTweet } from "@/utils/tweet";
import TweetVerify from "@/components/TweetVerify.vue";
import { hexlify, formatUnits } from "ethers";
import { nativeUnitMapping } from "@/constants/unitMapping.ts";
import useUserStore from "@/stores/user";
import { normaliseTwitterHandle } from "@/utils/normalise";
import useLoaderStore from "@/stores/loader";
import copyToClipboard from "@/utils/copyToClipboard";
import { useToast } from "vue-toastification";
import chainList from "@/constants/chainList";
import generateSenditUrl from "@/utils/generateSenditUrl";
import { beautifyAmount } from "@/utils/beautifyAmount";
import { requestableTokens } from "@/constants/requestableTokens";
import Decimal from "decimal.js";
import { router } from "@/router";
import useSendStore from "@/stores/send";
import { truncateAddress } from "@/utils/truncateAddress";

const conn = useConnection();
const sendStore = useSendStore();

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
  await userStore.fetchUserPointsAndRank();
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
  if (info && "decimals" in info) {
    return (info.decimals as number) || 0;
  }
  return 18;
}

function getCurrency(chainId: string | number, info: any) {
  if (info && "symbol" in info) {
    return info.symbol || "units";
  }
  return nativeUnitMapping[Number(chainId)];
}

function sanitizePaymentRequestRecord(record) {
  const tokenAddress = hexlify(record.data.token_address);
  const token = requestableTokens[record.chain_id].find(
    (token) =>
      (tokenAddress === ethers.ZeroAddress && token.address === "NATIVE") ||
      token.address === tokenAddress
  );
  const txState = record.state;
  const isRequester =
    userStore.address.toLowerCase() === hexlify(record.data.requester);
  return {
    requestId: hexlify(record.request_id),
    amount: {
      value: new Decimal(hexlify(record.data.value))
        .div(Decimal.pow(10, token.decimals || 18))
        .toString(),
      currency: token.symbol,
    },
    chain: chainList[Number(record.chain_id)]?.name || "N/A",
    txStatus:
      txState === 0x0 && Number(record.data.expiry) < Date.now()
        ? "expired"
        : txState === 0x0
        ? "pending"
        : txState === 0x10
        ? "cancelled"
        : txState === 0x20
        ? "rejected"
        : isRequester
        ? "received"
        : "sent",
    socialId: isRequester
      ? record.target_meta.verifier_human
      : record.requester_meta.verifier_human,
    verifier: record.target_verifier,
    walletAddress: hexlify(record.target),
    link: record.share_url,
    points: "",
    isRequester,
    isPendingRequest: true,
    data: {
      rawAmount: new Decimal(hexlify(record.data.value)).toString(),
      requester: hexlify(record.data.requester),
      chainId: record.chain_id,
      token: tokenAddress,
      signature: hexlify(record.signature),
      nonce: hexlify(record.data.nonce),
      expiry: record.data.expiry,
      requesterVerifier: record.requester_meta.verifier,
      requesterVerifierHuman: record.requester_meta.verifier_human,
    },
    state: txState,
    rawData: record,
    date: dayjs(record.updated_at).format("DD MMM YYYY"),
    actualDate: record.updated_at,
    fulfilledBy:
      txState === 0xf0
        ? record.final_fulfiller_meta.verifier_human ||
          hexlify(record.final_fulfiller)
        : "",
  };
}

function sanitizeTokenTransferRecord(record) {
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
    date: dayjs(record.tx_date).format("DD MMM YYYY"),
    actualDate: record.tx_date,
    fulfilledBy: "",
  };
}

onBeforeUnmount(() => {
  document.onscroll = null;
  currentPage = 1;
});

function isBNBChain(chainId) {
  return chainId == 56 || chainId == 97;
}

function calculateRewards(requests) {
  const dailyFulfilledRequests = requests
    .filter(
      (req) =>
        req.state === 0xf0 &&
        req.data.requester === userStore.address.toLowerCase() &&
        isBNBChain(req.data?.chainId)
    )
    .reduce((acc, request) => {
      if (!acc[request.data.chainId]) {
        acc[request.data.chainId] = {};
      }
      if (!acc[request.data.chainId][request.date]) {
        acc[request.data.chainId][request.date] = 0;
      }
      return acc;
    }, {});
  let isFirstFulfilledRequest = false;
  requests.forEach((req) => {
    if (
      req.state === 0xf0 &&
      req.data.requester === userStore.address.toLowerCase() &&
      dailyFulfilledRequests[req.data.chainId][req.date] < 50
    ) {
      dailyFulfilledRequests[req.data.chainId][req.date] += 1;
      if (!isFirstFulfilledRequest) {
        isFirstFulfilledRequest = true;
        req.points = 500;
      } else {
        req.points = req.data.chainId === 56 ? 50 : 10;
      }
    }
  });
  return requests;
}

async function fetchTxHistory() {
  if (currentPage === 1) {
    loaderStore.showLoader("Loading transaction history...");
  } else {
    loaderStore.showLoader("Loading more transactions...");
  }
  const message = {
    offset: (currentPage - 1) * 30,
    count: 30,
  };
  const txHistory = (await conn.sendMessage(
    SOCKET_IDS.GET_TX_HISTORY,
    message
  )) as { txns: any[] };
  const paymentRequestTxns = (await conn.sendMessage(
    SOCKET_IDS.LIST_REQUESTS,
    message
  )) as any;
  const paymentRequests = paymentRequestTxns.data?.length
    ? paymentRequestTxns.data
    : [];
  const sanitizePaymentRequestTxns = paymentRequests.map((record) => {
    return sanitizePaymentRequestRecord(record);
  });
  const paymentRequestTxnsData = calculateRewards(sanitizePaymentRequestTxns);
  const txns = txHistory.txns.map((record) => {
    return sanitizeTokenTransferRecord(record);
  });
  if (txns.length < 20) endOFHistory = true;
  if (currentPage === 1) {
    const pendingTx = (await conn.sendMessage(
      SOCKET_IDS.LIST_PENDING_TXS
    )) as any;
    const pendingTxns = pendingTx?.length ? pendingTx : [];
    const pendingTxnsData = pendingTxns.map((record) => {
      let sanitizedRecord: any;
      if (record.data.type === "request") {
        sanitizedRecord = sanitizePaymentRequestRecord(record.data) as any;
      } else {
        sanitizedRecord = sanitizeTokenTransferRecord(record.data) as any;
      }
      sanitizedRecord.pendingTxId = record.id;
      return sanitizedRecord;
    });
    history.value = [...pendingTxnsData, ...paymentRequestTxnsData, ...txns];
  } else history.value = [...paymentRequestTxnsData, ...txns, ...history.value];
  history.value.sort((a, b) => b.actualDate - a.actualDate);
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

function sendTokens(record) {
  sendStore.requestInput.amount = record.data.rawAmount;
  sendStore.requestInput.recipientAddress = record.data.requester;
  sendStore.requestInput.requestId = record.requestId;
  sendStore.requestInput.chain = record.data.chainId;
  sendStore.requestInput.token = record.data.token;
  sendStore.requestInput.nonce = record.data.nonce;
  sendStore.requestInput.signature = record.data.signature;
  sendStore.requestInput.expiry = Number(record.data.expiry);
  sendStore.requestInput.recipientVerifier = record.data.requesterVerifier;
  sendStore.requestInput.recipientVerifierHuman =
    record.data.requesterVerifierHuman;
  router.push({
    name: "Send",
    query: {
      requestId: record.requestId,
      verifier: record.verifier,
      verifierId: record.socialId,
    },
  });
}

async function rejectRequest(record, index) {
  await conn.sendMessage(SOCKET_IDS.REJECT_REQUEST, {
    request_id: ethers.getBytes(record.requestId),
  });
  if (record.isRequester) {
    history.value[index].txStatus = "cancelled";
  } else {
    history.value[index].txStatus = "rejected";
  }
  await sendStore.removePendingTxForPaymentRequest(record.requestId);
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
      class="flex-col bg-eerie-black rounded-[10px] border border-jet mx-8 max-lg:mx-4 my-5 overflow-auto relative"
    >
      <div
        class="hidden md:grid leaderboard-table-header text-[12px] text-philippine-gray py-4 px-6"
      >
        <div class="leaderboard-table-header-item">Date</div>
        <div class="leaderboard-table-header-item">Amount</div>
        <div class="leaderboard-table-header-item">Chain</div>
        <div class="leaderboard-table-header-item">Social ID</div>
        <div class="leaderboard-table-header-item">Wallet Address</div>
        <div class="leaderboard-table-header-item">Fulfilled By</div>
        <div class="leaderboard-table-header-item">Sendit Link</div>
        <div class="leaderboard-table-header-item">Tx Status</div>
        <div class="leaderboard-table-header-item">Points</div>
        <div class="leaderboard-table-header-item">Action</div>
      </div>
      <div class="grid md:hidden py-4 px-6 uppercase font-bold text-xs">
        Transactions
      </div>
      <hr class="border-jet border-0 border-b-1" />
      <div v-if="history.length">
        <div class="hidden md:block px-2 py-4">
          <div class="px-1 py-3">
            <div
              class="grid leaderboard-table-row px-3 py-2 text-sm rounded-[5px] hover:bg-[#464646] group"
              v-for="(record, index) in history"
              :key="record.txHash"
            >
              <div class="leaderboard-table-row-item">
                <span v-if="record.date">{{ record.date }}</span>
              </div>
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
                class="leaderboard-table-row-item flex items-start gap-1 cursor-pointer"
                :title="record.walletAddress"
                @click.stop="
                  copy(record.walletAddress, 'Wallet address copied')
                "
              >
                <span>{{ truncateAddress(record.walletAddress, 4) }}</span>
                <button
                  title="Click to copy"
                  @click.stop="
                    copy(record.walletAddress, 'Wallet address copied')
                  "
                  class="cursor-pointer opacity-0 transition-all duration-[150ms] group-hover:opacity-100"
                >
                  <img src="@/assets/images/icons/copy.svg" />
                </button>
              </div>
              <div
                v-if="record.fulfilledBy && record.state === 0xf0"
                class="leaderboard-table-row-item ellipsis cursor-pointer"
                :title="record.fulfilledBy"
                @click.stop="copy(record.fulfilledBy, 'Social ID copied')"
              >
                {{ record.fulfilledBy }}
              </div>
              <div
                v-else
                class="leaderboard-table-row-item cursor-pointer"
              ></div>
              <div
                class="leaderboard-table-row-item flex items-start gap-1 cursor-pointer"
                :title="record.link"
                @click.stop="copy(record.link, 'SendIt link copied')"
              >
                <span class="ellipsis inline-flex w-[150px]"
                  ><span class="ellipsis">{{ record.link }}</span></span
                >
                <button
                  title="Click to copy"
                  @click.stop="copy(record.link, 'SendIt link copied')"
                  class="cursor-pointer opacity-0 transition-all duration-[150ms] group-hover:opacity-100"
                >
                  <img src="@/assets/images/icons/copy.svg" />
                </button>
              </div>
              <div
                class="leaderboard-table-row-item flex justify-between w-[6rem] capitalize"
                :class="record.txStatus"
              >
                {{ record.txStatus }}
              </div>
              <div v-if="record.points" class="leaderboard-table-row-item">
                {{ record.points }}
              </div>
              <div v-else class="leaderboard-table-row-item">-</div>
              <div
                v-if="record.isPendingRequest"
                class="leaderboard-table-row-item flex items-start gap-2"
              >
                <button
                  class="underline cursor-pointer"
                  v-if="!record.isRequester && record.txStatus === 'pending'"
                  @click.stop="sendTokens(record)"
                >
                  Send Tokens
                </button>
                <button
                  v-if="record.txStatus === 'pending'"
                  class="underline cursor-pointer"
                  @click.stop="rejectRequest(record, index)"
                >
                  <span v-if="record.isRequester">Cancel Request</span>
                  <span v-else>Reject Request</span>
                </button>
              </div>
              <div
                v-else
                class="leaderboard-table-row-item flex items-start gap-4"
              >
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
                <div
                  v-if="!record.isSharedOnTwitter"
                  class="leaderboard-table-row-item text-center text-[#659CFF] text-[10px] bg-[#293C5F] px-1 rounded-[5px] grid self-start content-center"
                >
                  Earn 5 XP
                </div>
                <div v-else></div>
              </div>
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
                <span class="capitalize" :class="record.txStatus">{{
                  record.txStatus
                }}</span
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
              <div class="text-xs">
                <span class="text-philippine-gray">Wallet Address:</span>&nbsp;
                <span
                  :title="record.walletAddress"
                  @click.stop="
                    copy(record.walletAddress, 'Wallet address copied')
                  "
                  class="inline-flex cursor-pointer w-[240px]"
                >
                  <span class="ellipsis">
                    {{ record.walletAddress }}</span
                  ></span
                >
                <button
                  @click.stop="
                    copy(record.walletAddress, 'Wallet address copied')
                  "
                  class="cursor-pointer ml-4"
                >
                  <img src="@/assets/images/icons/copy.svg" />
                </button>
              </div>
              <div
                class="text-xs ellipsis"
                v-if="record.fulfilledBy && record.state === 0xf0"
              >
                <span class="text-philippine-gray">Fulfilled By:</span>&nbsp;
                <span
                  :title="record.fulfilledBy"
                  @click.stop="copy(record.fulfilledBy, 'Social ID copied')"
                  class="cursor-pointer"
                  >{{ record.fulfilledBy }}</span
                >
              </div>
              <div class="text-xs" v-if="record.link">
                <span class="text-philippine-gray">SendIt Link:</span>&nbsp;
                <span
                  @click.stop="copy(record.link, 'SendIt link copied')"
                  class="inline-flex cursor-pointer ellipsis w-[280px]"
                  ><span class="ellipsis">{{ record.link }}</span></span
                >
                <button
                  @click.stop="copy(record.link, 'SendIt link copied')"
                  class="cursor-pointer ml-4"
                >
                  <img src="@/assets/images/icons/copy.svg" />
                </button>
              </div>
              <div v-if="record.points" class="text-xs ellipsis">
                <span class="text-philippine-gray">Points Earned:</span>&nbsp;
                <span class="font-bold">{{ record.points }}</span>
              </div>
              <div class="text-xs ellipsis">
                <span class="text-philippine-gray"
                  ><span v-if="record.date">{{ record.date }}</span></span
                >
              </div>
              <div class="text-[10px] text-philippine-gray">
                {{ record.joinDate }}
              </div>
            </div>
            <button
              v-if="!record.isPendingRequest && !record.isSharedOnTwitter"
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
            <div
              v-if="record.isPendingRequest"
              class="flex flex-col gap-4 ml-auto text-[12px]"
            >
              <button
                class="underline cursor-pointer p-2"
                v-if="!record.isRequester && record.txStatus === 'pending'"
                @click.stop="sendTokens(record)"
              >
                Send Tokens
              </button>
              <button
                v-if="record.txStatus === 'pending'"
                class="underline cursor-pointer p-2"
                @click.stop="rejectRequest(record, index)"
              >
                <span v-if="record.isRequester">Cancel Request</span>
                <span v-else>Reject Request</span>
              </button>
            </div>
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
    minmax(80px, calc(8% - 1rem)) minmax(80px, 8%) minmax(96px, 8%) minmax(
      160px,
      10%
    )
    minmax(120px, calc(10% - 1rem))
    minmax(120px, calc(10% - 1rem))
    minmax(160px, calc(15% - 1rem))
    minmax(80px, 6%) minmax(40px, 4%) minmax(200px, calc(18% - 1rem));
  grid-gap: 1rem;
}

.star-icon::before {
  position: absolute;
  content: "";
  inset: -4px;
  border-radius: 50%;
}

.pending {
  color: #eeb113;
}

.rejected,
.cancelled,
.expired {
  color: #ff4264;
}
</style>
