<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from "vue";

import navMenu from "@/constants/navMenu.ts";
import { useClickOutside } from "@/use/clickOutside";
import useUserStore from "@/stores/user";
// import useRewardsStore from "@/stores/rewards";
import useNotificationStore from "@/stores/notification";
import AppInvite from "@/components/AppInvite.vue";

const MobileMenu = defineAsyncComponent(
  () => import("@/components/mobileMenu.vue")
);
const Notifications = defineAsyncComponent(
  () => import("@/components/notifications.vue")
);
const Profile = defineAsyncComponent(() => import("@/components/profile.vue"));

type HeaderProps = {
  hideNav?: boolean;
  hideUserData?: boolean;
};

const props = defineProps<HeaderProps>();

const userStore = useUserStore();
// const rewardsStore = useRewardsStore();
const notificationStore = useNotificationStore();

const showMobileMenu = ref(false);
const showNotifications = ref(false);
const showProfile = ref(false);
const showInvitePopup = ref(false);

const notificationMenu = ref(null);
const profileMenu = ref(null);
const mobileMenu = ref(null);

if (!props.hideNav) {
  useClickOutside(profileMenu, () => {
    showProfile.value = false;
  });

  useClickOutside(mobileMenu, () => {
    showMobileMenu.value = false;
  });

  useClickOutside(notificationMenu, () => {
    showNotifications.value = false;
  });
}

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

function handleInvite() {
  showInvitePopup.value = true;
  showProfile.value = false;
}

const stats = computed(() => {
  return [
    {
      label: "Weekly Rank",
      value: userStore.rank,
    },
    {
      label: "Total XP",
      value: userStore.points,
    },
    {
      label: "Referral XP",
      value: userStore.xpBreakdown?.referreePoints || 0,
    },
    // {
    //   label: "My Rewards",
    //   value: rewardsStore.rewards.length,
    // },
  ];
});
</script>

<template>
  <div class="flex flex-col bg-[#0e0e0e]">
    <header class="border-b-1 border-jet px-7.5 py-4">
      <div class="container flex justify-between">
        <div class="flex space-x-5 items-center">
          <img src="@/assets/images/sendit-title.png" class="h-10" />
          <nav
            v-if="!props.hideNav"
            class="flex space-x-5 max-lg:hidden items-center"
          >
            <router-link
              v-for="menu in navMenu"
              :key="menu.label"
              :to="{ name: menu.routeName }"
            >
              {{ menu.label }}
            </router-link>
          </nav>
        </div>
        <div v-if="!props.hideNav" class="flex items-center space-x-5">
          <div class="flex space-x-3 max-md:hidden">
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
            <a href="mailto:support@arcana.network">Help</a>
            <button class="relative" @click.stop="toggleNotifications">
              <span
                v-if="notificationStore.areUnreadNotifications"
                class="h-2.5 w-2.5 rounded-full bg-vivid-vermilion absolute animate-bounce"
              >
              </span>
              <img
                src="@/assets/images/icons/notification.svg"
                alt="notification"
                class="min-w-fit"
              />
              <div
                class="max-lg:fixed absolute top-10 max-lg:top-16 max-lg:right-2 max-lg:left-2 -right-10 z-[999]"
                v-if="showNotifications"
                ref="notificationMenu"
              >
                <Notifications />
              </div>
            </button>
            <button class="relative" @click.stop="toggleProfileMenu">
              <img
                src="@/assets/images/icons/profile.svg"
                alt="profile"
                class="min-w-fit"
              />
              <div
                class="max-lg:fixed absolute top-10 right-0 max-lg:top-16 max-lg:right-2 max-lg:left-2"
                v-if="showProfile"
                ref="profileMenu"
              >
                <Profile @invite="handleInvite" />
              </div>
            </button>
          </div>
          <nav
            v-if="!props.hideNav"
            class="flex justify-center relative lg:hidden"
          >
            <button @click.stop="toggleMobileMenu">
              <img
                src="@/assets/images/icons/menu.svg"
                alt="menu"
                class="w-7 h-7"
              />
            </button>
            <div
              class="absolute top-10 right-0"
              v-if="showMobileMenu"
              ref="mobileMenu"
            >
              <MobileMenu @navigated="showMobileMenu = false" />
            </div>
          </nav>
        </div>
      </div>
    </header>
    <div
      v-if="!props.hideUserData"
      class="border-b-1 border-jet md:hidden py-2 flex justify-center"
    >
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
    </div>
    <AppInvite v-if="showInvitePopup" @close="showInvitePopup = false" />
  </div>
</template>
