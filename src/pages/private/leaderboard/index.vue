<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import StarIcon from "../../../components/StarIcon.vue";
import { leaders, weeklyLeaders } from "@/constants/leaderboard.mock";

const route = useRoute();

const rankers = computed(() => {
  if (route.query.duration === "weekly") {
    return weeklyLeaders;
  }
  return leaders;
});

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
        eligible for special airdrops from Arcana.</span
      >
    </div>
    <div
      class="flex mx-8 my-0 bg-eerie-black max-w-max flex-wrap py-1 px-2 border border-jet rounded-[10px] text-philippine-gray text-sm"
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
      class="flex flex-col bg-eerie-black rounded-[10px] border border-jet mx-8 my-5"
    >
      <div
        class="leaderboard-table-header text-xs text-philippine-gray py-4 px-6"
      >
        <div class="leaderboard-table-header-item">Rank</div>
        <div class="leaderboard-table-header-item">Wallet Address</div>
        <div class="leaderboard-table-header-item">Transactions</div>
        <div class="leaderboard-table-header-item">XP</div>
        <div class="leaderboard-table-header-item">Join Date</div>
      </div>
      <hr class="border-jet border-0 border-b-1" />
      <div class="leaderboard-table-body px-2 py-4">
        <div
          class="top-3-rankers bg-black border-jet border-1 rounded-[10px] px-1 py-3"
        >
          <div
            class="leaderboard-table-row px-3 py-2 text-[15px] rounded-[5px] border-1 border-transparent hover:border-white hover:bg-[#464646]"
            v-for="ranker in top3Rankers"
            :key="ranker.rank"
            :class="{
              'text-[#b8a26a]': ranker.rank === 1,
              'text-[#7fc987]': ranker.rank === 2,
              'text-[#7896cc]': ranker.rank === 3,
            }"
          >
            <div class="leaderboard-table-row-item">{{ ranker.rank }}</div>
            <div class="leaderboard-table-row-item">
              {{ ranker.walletAddress }}
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
            <div class="leaderboard-table-row-item">{{ ranker.joinDate }}</div>
          </div>
        </div>
        <div class="rest-rankers px-1 py-3">
          <div
            class="leaderboard-table-row px-3 py-2 text-sm rounded-[5px] border-1 border-transparent hover:border-white hover:bg-[#464646]"
            v-for="ranker in restRankers"
            :key="ranker.rank"
          >
            <div class="leaderboard-table-row-item">{{ ranker.rank }}</div>
            <div class="leaderboard-table-row-item">
              {{ ranker.walletAddress }}
            </div>
            <div class="leaderboard-table-row-item">
              {{ ranker.transactions }}
            </div>
            <div
              class="leaderboard-table-row-item flex justify-between w-[6rem]"
            >
              {{ ranker.xp }}
            </div>
            <div class="leaderboard-table-row-item">{{ ranker.joinDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-table-header,
.leaderboard-table-row {
  display: grid;
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
