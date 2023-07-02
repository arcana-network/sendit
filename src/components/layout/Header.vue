<script setup lang="ts">
import sendItLogo from "@/assets/images/send-it-logo.png";
import notificationIcon from "@/assets/images/icons/notification.svg";
import profileIcon from "@/assets/images/icons/profile.svg";
import MenuIcon from "@/assets/images/icons/menu.svg";
import navMenu from "@/constants/navMenu.ts";
import MobileMenu from "@/components/mobileMenu.vue";
import { ref } from "vue";

const showMobileMenu = ref(false);

const stats = [
  {
    label: "My Ranking",
    value: "52nd",
  },
  {
    label: "My XP",
    value: "158,221",
  },
  {
    label: "My Rewards",
    value: "10",
  },
];
</script>

<template>
  <header class="flex justify-between border-b-1 border-jet px-7.5 py-4">
    <div class="flex space-x-5">
      <img :src="sendItLogo" alt="send it logo" class="w-12 h-12" />
      <nav class="flex space-x-5 max-lg:hidden">
        <button v-for="menu in navMenu" :key="menu.label">
          {{ menu.label }}
        </button>
      </nav>
      <nav class="flex justify-center relative lg:hidden">
        <button @click="showMobileMenu = !showMobileMenu">
          <img :src="MenuIcon" alt="menu" class="w-7 h-7" />
        </button>
        <div class="absolute top-10 left-0" v-if="showMobileMenu">
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
        <button class="relative">
          <span class="h-2.5 w-2.5 rounded-full bg-vivid-vermilion absolute">
          </span>
          <img :src="notificationIcon" alt="notification" class="min-w-fit" />
        </button>
        <button>
          <img :src="profileIcon" alt="profile" class="min-w-fit" />
        </button>
      </div>
    </div>
  </header>
</template>
