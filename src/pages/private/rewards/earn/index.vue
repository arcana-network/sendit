<script setup lang="ts">
import { useRouter } from "vue-router";
import { composeAndSendTweet } from "@/utils/tweet";
import { EARN_XP } from "@/constants/rewards";
import AppInvite from "@/components/AppInvite.vue";
import TweetVerify from "@/components/TweetVerify.vue";
import { ref } from "vue";

const router = useRouter();
const showInvitePopup = ref(false);
const showTweetVerifyPopup = ref(false);
const tweetXp = ref(0);

function handleAction(reward) {
  if (reward.task === "Invite") {
    showInvitePopup.value = true;
  } else if (reward.task === "Tweet") {
    composeAndSendTweet(reward.tweet);
    tweetXp.value = reward.xp;
    showTweetVerifyPopup.value = true;
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
        v-for="reward in EARN_XP"
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
    <AppInvite v-if="showInvitePopup" @close="showInvitePopup = false" />
    <TweetVerify
      v-if="showTweetVerifyPopup"
      :xp="tweetXp"
      @close="showTweetVerifyPopup = false"
    />
  </div>
</template>