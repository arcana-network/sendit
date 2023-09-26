<script setup lang="ts">
import { useRouter } from "vue-router";
import { composeAndSendTweet } from "@/utils/tweet";
import { EARN_XP } from "@/constants/rewards";
import AppInvite from "@/components/AppInvite.vue";
import useUserStore from "@/stores/user";
import { ref, onBeforeMount } from "vue";
import TwitterFollowVerify from "@/components/TwitterFollowVerify.vue";

const router = useRouter();
const showInvitePopup = ref(false);
const showTwitterFollowPopup = ref({
  show: false,
  type: "",
});
const showTweetVerifyPopup = ref(false);
const tweetXp = ref(0);
const userStore = useUserStore();
const rewardCards = ref([] as any[]);

onBeforeMount(async () => {
  await userStore.fetchUserPointsAndRank();
  rewardCards.value = EARN_XP.filter((item) =>
    userStore.followedOnTwitter ? item.medium !== "twitter" : true
  );
});

function handleAction(reward) {
  if (reward.task === "Invite") {
    showInvitePopup.value = true;
  } else if (reward.task === "Tweet") {
    composeAndSendTweet(reward.tweet);
    tweetXp.value = reward.xp;
    showTweetVerifyPopup.value = true;
  } else if (reward.task === "Transact") {
    router.push({ name: "Send" });
  } else if (reward.task === "Follow") {
    window.open(reward.url, "_blank");
    showTwitterFollowPopup.value.show = true;
    showTwitterFollowPopup.value.type = reward.medium;
  } else if (reward.task === "Shoutout") {
    router.push({ name: "History" });
  } else if (reward.task === "Request") {
    router.push({ name: "Request" });
  }
}
</script>

<template>
  <div class="flex flex-col bg-eerie-black rounded-[10px] border border-jet">
    <span class="p-4 text-sm font-bold uppercase">Earn XP</span>
    <hr class="border-0 border-b border-b-jet" />
    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <div
        class="flex rounded-[10px] overflow-hidden border border-jet pr-5 bg-[#0e0e0e] cursor-pointer"
        v-for="reward in rewardCards"
        :key="JSON.stringify(reward)"
        @click.stop="handleAction(reward)"
      >
        <div
          class="flex items-center justify-center p-6 bg-[#151515] border-r-jet border-r"
        >
          <img :src="reward.image" :alt="reward.name" class="h-8 w-8" />
        </div>
        <div class="flex justify-between gap-2 flex-grow w-full items-center">
          <div class="flex flex-col px-4 py-5">
            <span class="text-base font-bold text-[#d8d8d8]">{{
              reward.name
            }}</span>
            <span class="text-sm text-philippine-gray">{{
              reward.description
            }}</span>
            <!-- <span v-if="reward.dailyLimit" class="text-sm text-philippine-gray"
              ><strong>Daily Limit:</strong> {{ reward.dailyLimit }}XP</span
            > -->
            <span v-if="reward.bonus" class="text-sm text-philippine-gray mt-4"
              ><strong>Bonus:</strong> {{ reward.bonus }}</span
            >
            <div v-if="reward.tags?.length" class="mt-4 flex gap-2">
              <span
                v-for="tag in reward.tags"
                class="text-[12px] rounded-[5px] px-2 py-[1px]"
                :style="{
                  background: tag.color.bg,
                  color: tag.color.text,
                }"
                >{{ tag.name }}</span
              >
            </div>
          </div>
          <div class="flex items-center justify-center">
            <button
              class="flex gap-1 items-center justify-center text-xs"
              @click.stop="handleAction(reward)"
            >
              <!-- {{ reward.task }} -->
              <img src="@/assets/images/icons/arrow-right.svg" alt="arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <AppInvite v-if="showInvitePopup" @close="showInvitePopup = false" />
    <TwitterFollowVerify
      v-if="showTwitterFollowPopup.show"
      :medium="showTwitterFollowPopup.type"
      @close="showTwitterFollowPopup.show = false"
    />
  </div>
</template>
