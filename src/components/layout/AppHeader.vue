<script setup lang="ts">
import sendItLogo from "../../assets/images/send-it-logo.png";
import notificationIcon from "../../assets/images/icons/notification.svg";
import profileIcon from "../../assets/images/icons/profile.svg";
import useUserStore from "@/stores/user";
import useRewardsStore from "@/stores/rewards";
import { computed } from "vue";

const userStore = useUserStore();
const rewardsStore = useRewardsStore();

const navMenu = [
  {
    routeName: "Send",
    label: "Send",
  },
  {
    routeName: "History",
    label: "History",
  },
  {
    routeName: "Leaderboard",
    label: "Leaderboard",
  },
  {
    routeName: "Rewards",
    label: "Rewards",
  },
];

const stats = computed(() => {
  return [
    {
      label: "My Ranking",
      value: userStore.rank,
    },
    {
      label: "My XP",
      value: userStore.points,
    },
    {
      label: "My Rewards",
      value: rewardsStore.rewards.length,
    },
  ];
});
</script>

<template>
  <header class="flex justify-between border-b-1 border-jet px-7.5 py-4">
    <div class="flex space-x-5">
      <img :src="sendItLogo" alt="send it logo" class="w-12 h-12" />
      <nav class="flex space-x-5">
        <router-link
          v-for="menu in navMenu"
          :key="menu.label"
          :to="{ name: menu.routeName }"
        >
          {{ menu.label }}
        </router-link>
      </nav>
    </div>
    <div class="flex items-center space-x-5">
      <div class="flex space-x-3">
        <div
          class="flex items-center space-x-2 p-2.5 border-1 border-jet rounded-xl"
          v-for="stat in stats"
          :key="stat.label"
        >
          <span class="text-xs">{{ stat.label }}</span>
          <span class="text-xl">{{ stat.value }}</span>
        </div>
      </div>
      <div class="space-x-3 flex items-center">
        <button>Help</button>
        <button>
          <img :src="notificationIcon" alt="notification" class="min-w-fit" />
        </button>
        <button>
          <img :src="profileIcon" alt="profile" class="min-w-fit" />
        </button>
      </div>
    </div>
  </header>
</template>
