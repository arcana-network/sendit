<script setup lang="ts">
import { computed, ref } from "vue";

import sendItLogo from "@/assets/images/send-it-logo.png";
import notificationIcon from "@/assets/images/icons/notification.svg";
import profileIcon from "@/assets/images/icons/profile.svg";
import MenuIcon from "@/assets/images/icons/menu.svg";
import navMenu from "@/constants/navMenu.ts";
import MobileMenu from "@/components/mobileMenu.vue";
import Notifications from "@/components/notifcations.vue";
import Profile from "@/components/profile.vue";
import { useClickOutside } from "@/use/clickOutside";
import useUserStore from "@/stores/user";
import useRewardsStore from "@/stores/rewards";

const userStore = useUserStore();
const rewardsStore = useRewardsStore();

const showMobileMenu = ref(false);
const showNotifications = ref(false);
const showProfile = ref(false);

const notificationMenu = ref(null);
const profileMenu = ref(null);
const mobileMenu = ref(null);

useClickOutside(profileMenu, () => {
  showProfile.value = false;
});

useClickOutside(mobileMenu, () => {
  showMobileMenu.value = false;
});

useClickOutside(notificationMenu, () => {
  showNotifications.value = false;
});

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
  showProfile.value = false;
  showNotifications.value = false;
}

function toggleProfileMenu() {
  showProfile.value = !showProfile.value;
  showMobileMenu.value = false;
  showNotifications.value = false;
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  showMobileMenu.value = false;
  showProfile.value = false;
}

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
    <div class="flex space-x-5 items-center">
      <img :src="sendItLogo" alt="send it logo" class="w-12 h-12" />
      <nav class="flex space-x-5 max-lg:hidden items-center">
        <router-link
          v-for="menu in navMenu"
          :key="menu.label"
          :to="{ name: menu.routeName }"
        >
          {{ menu.label }}
        </router-link>
      </nav>
      <nav class="flex justify-center relative lg:hidden">
        <button @click.stop="toggleMobileMenu">
          <img :src="MenuIcon" alt="menu" class="w-7 h-7" />
        </button>
        <div
          class="absolute top-10 left-0"
          v-if="showMobileMenu"
          ref="mobileMenu"
        >
          <MobileMenu />
        </div>
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
        <button class="relative" @click.stop="toggleNotifications">
          <span class="h-2.5 w-2.5 rounded-full bg-vivid-vermilion absolute">
          </span>
          <img :src="notificationIcon" alt="notification" class="min-w-fit" />
          <div
            class="absolute top-10 -right-10"
            v-if="showNotifications"
            ref="notificationMenu"
          >
            <Notifications />
          </div>
        </button>
        <button class="relative" @click.stop="toggleProfileMenu">
          <img :src="profileIcon" alt="profile" class="min-w-fit" />
          <div
            class="absolute top-10 right-0"
            v-if="showProfile"
            ref="profileMenu"
          >
            <Profile />
          </div>
        </button>
      </div>
    </div>
  </header>
</template>