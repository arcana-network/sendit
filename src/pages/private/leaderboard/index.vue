<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import StarIcon from "@/components/StarIcon.vue";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS, LEADERBOARD_TYPES } from "@/constants/socket-ids";
import { truncateAddress } from "@/utils/truncateAddress";
import dayjs from "dayjs";
import { ethers } from "ethers";

const route = useRoute();
const conn = useConnection();

const rankers = ref([] as any[]);
let currentPage = 1;

onBeforeMount(() => {
  if (route.query.duration === "weekly") fetchLeaderboard("weekly");
  else fetchLeaderboard();
});

onBeforeUnmount(() => {
  document.onscroll = null;
});

const headerHeight = computed(() => {
  return document.querySelector("#header")?.clientHeight as number;
});

async function fetchLeaderboard(duration: "global" | "weekly" = "global") {
  const message = {
    ltype:
      duration === "weekly"
        ? LEADERBOARD_TYPES.WEEKLY
        : LEADERBOARD_TYPES.GLOBAL,
    offset: (currentPage - 1) * 100,
    count: 100,
    limit: 100,
  };
  const leaderboard = (await conn.sendMessage(
    SOCKET_IDS.GET_LEADERBOARD,
    message
  )) as { rankings: any[] };
  const leaderboardRankings = leaderboard.rankings.map((ranking) => {
    return {
      rank: ranking.rank,
      walletAddress: ethers.hexlify(ranking.address),
      xp: ranking.points,
      transactions: ranking.no_of_transactions,
      joinDate: dayjs.unix(ranking.join_time).format("DD MMM YYYY"),
    };
  });
  if (currentPage === 1) {
    rankers.value = leaderboardRankings;
  } else {
    rankers.value = [...rankers.value, ...leaderboardRankings];
  }
}

watch(
  () => route.query.duration,
  async () => {
    currentPage = 1;
    if (route.query.duration === "weekly") fetchLeaderboard("weekly");
    else fetchLeaderboard();
  }
);

const top3Rankers = computed(() => rankers.value.slice(0, 3));
const restRankers = computed(() => rankers.value.slice(3));
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col p-8">
      <span class="text-3.5xl">Leaderboard</span>
      <span class="text-sm text-philippine-gray max-w-[720px]"
        >Using this app earns you points that you can redeem for rewards.
        Compete against other users to earn more rewards and improve your
        ranking. The top ranked users will earn additional points and be
        eligible for special rewards from Arcana.</span
      >
    </div>
    <div
      class="flex mx-8 my-0 bg-eerie-black max-w-max flex-wrap py-1 px-2 border border-jet rounded-[10px] text-philippine-gray text-sm sticky"
      :style="{ top: `${headerHeight + 16}px` }"
    >
      <router-link
        class="px-2 py-1 cursor-pointer rounded-[5px]"
        :class="{
          'bg-[#141414] text-white': route.query.duration !== 'weekly',
        }"
        :to="{ name: 'Leaderboard', query: {} }"
        >Overall</router-link
      >
      <router-link
        class="px-2 py-1 cursor-pointer rounded-[5px]"
        :class="{
          'bg-[#141414] text-white': route.query.duration === 'weekly',
        }"
        :to="{ name: 'Leaderboard', query: { duration: 'weekly' } }"
        >Weekly</router-link
      >
    </div>
    <div
      class="flex-col bg-eerie-black rounded-[10px] border border-jet mx-8 my-5"
    >
      <div
        class="hidden md:grid leaderboard-table-header text-xs text-philippine-gray py-4 px-6"
      >
        <div class="leaderboard-table-header-item">Rank</div>
        <div class="leaderboard-table-header-item">Wallet Address</div>
        <div class="leaderboard-table-header-item">Transactions</div>
        <div class="leaderboard-table-header-item">XP</div>
        <div class="leaderboard-table-header-item">Join Date</div>
      </div>
      <div class="grid md:hidden py-4 px-6 uppercase font-bold text-xs">
        Rankings
      </div>
      <hr class="border-jet border-0 border-b-1" />
      <div
        v-if="rankers.length"
        class="overflow-auto"
        :style="{ maxHeight: `calc(100vh - ${headerHeight + 200}px)` }"
      >
        <div class="hidden md:block px-2 py-4">
          <div
            class="top-3-rankers bg-black border-jet border-1 rounded-[10px] px-1 py-3"
          >
            <div
              class="grid leaderboard-table-row px-3 py-2 text-[15px] rounded-[5px] border-1 border-transparent hover:border-white hover:bg-[#464646]"
              v-for="ranker in top3Rankers"
              :key="ranker.rank"
              :class="{
                'text-[#b8a26a]': ranker.rank === 1,
                'text-[#7fc987]': ranker.rank === 2,
                'text-[#7896cc]': ranker.rank === 3,
              }"
            >
              <div class="leaderboard-table-row-item">{{ ranker.rank }}</div>
              <div
                class="leaderboard-table-row-item"
                :title="ranker.walletAddress"
              >
                {{ truncateAddress(ranker.walletAddress) }}
              </div>
              <div class="leaderboard-table-row-item">
                {{ ranker.transactions }}
              </div>
              <div
                class="leaderboard-table-row-item flex justify-between items-center w-[6rem]"
              >
                {{ ranker.xp }}
                <div
                  class="relative star-icon before:opacity-20"
                  :class="{
                    'before:bg-[#b8a26a]': ranker.rank === 1,
                    'before:bg-[#7fc987]': ranker.rank === 2,
                    'before:bg-[#7896cc]': ranker.rank === 3,
                  }"
                >
                  <StarIcon class="relative" />
                </div>
              </div>
              <div class="leaderboard-table-row-item">
                {{ ranker.joinDate }}
              </div>
            </div>
          </div>
          <div class="rest-rankers px-1 py-3">
            <div
              class="grid leaderboard-table-row px-3 py-2 text-sm rounded-[5px] border-1 border-transparent hover:border-white hover:bg-[#464646]"
              v-for="ranker in restRankers"
              :key="ranker.rank"
            >
              <div class="leaderboard-table-row-item">{{ ranker.rank }}</div>
              <div
                class="leaderboard-table-row-item"
                :title="ranker.walletAddress"
              >
                {{ truncateAddress(ranker.walletAddress) }}
              </div>
              <div class="leaderboard-table-row-item">
                {{ ranker.transactions }}
              </div>
              <div
                class="leaderboard-table-row-item flex justify-between w-[6rem]"
              >
                {{ ranker.xp }}
              </div>
              <div class="leaderboard-table-row-item">
                {{ ranker.joinDate }}
              </div>
            </div>
          </div>
        </div>
        <div class="block md:hidden">
          <div
            v-for="ranker in rankers"
            :key="ranker.rank"
            class="flex"
            :class="{ 'border-jet border-0 border-t-1': ranker.rank !== 1 }"
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
  </div>
</template>

<style scoped>
.leaderboard-table-header,
.leaderboard-table-row {
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  grid-gap: 1rem;
}

.star-icon::before {
  position: absolute;
  content: "";
  inset: -4px;
  border-radius: 50%;
}
</style>
