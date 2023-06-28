<script setup lang="ts">
import NavigationIcon from "@/assets/images/icons/navigation.svg";
import PiggyBankIcon from "@/assets/images/icons/piggy-bank.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";
import WalletIcon from "@/assets/images/icons/wallet.svg";
import { useRouter } from "vue-router";

const router = useRouter();

const rewards = [
  {
    image: UserAddIcon,
    name: "Earn 40 XP",
    description:
      "Invite a friend and earn XP as soon as they log in to their wallet.",
    task: "Invite",
  },
  {
    image: UserVoiceIcon,
    name: "Earn 50 XP",
    description:
      "Give a shoutout to sender when you receive assets to earn XP.",
    task: "Tweet",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send crypto & earn by making a new transaction.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful transactions (per user).",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 10 XP",
    description: "Earn with every 5 transactions.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "Send to 5 people to earn points.",
    task: "Transact",
  },
  {
    image: UserAddIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful invites.",
    task: "Invite",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send 100$ totally (per user).",
    task: "Transact",
  },
  {
    image: PiggyBankIcon,
    name: "Earn 50 XP",
    description: "1,000,000 USD crossed in volume.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "10,000th txn (overall).",
    task: "Transact",
  },
  {
    image: WalletIcon,
    name: "Earn 50 XP",
    description: "100,000th wallet (overall).",
    task: "Transact",
  },
];

function handleAction(reward) {
  if (reward.task === "Invite") {
    alert("Invite");
  } else if (reward.task === "Tweet") {
    window.open(
      "https://twitter.com/intent/tweet?text=Hello%10world",
      "_blank"
    );
  } else if (reward.task === "Transact") {
    router.push({ name: "Send" });
  }
}
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Earn XP</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        class="flex rounded-[10px] overflow-hidden border border-jet pr-5 bg-[#0e0e0e]"
        v-for="reward in rewards"
        :key="JSON.stringify(reward)"
      >
        <div
          class="flex items-center justify-center p-6 bg-[#151515] border-r-jet border-r"
        >
          <img :src="reward.image" :alt="reward.name" class="h-8 w-8" />
        </div>
        <div class="flex justify-between gap-5 flex-grow w-full">
          <div class="flex flex-col px-4 py-5">
            <span class="text-base font-bold text-[#d8d8d8]">{{
              reward.name
            }}</span>
            <span class="text-sm text-philippine-gray">{{
              reward.description
            }}</span>
          </div>
          <div class="flex items-center justify-center">
            <button
              class="flex gap-1 items-center justify-center text-xs"
              @click.stop="handleAction(reward)"
            >
              {{ reward.task }}
              <img src="@/assets/images/icons/arrow-right.svg" alt="arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
