<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import RequestForm from "@/components/request/requestForm.vue";
import useRequestStore from "@/stores/request";
import RequestSuccess from "@/components/request/success.vue";
// import { EARN_XP, MONDAY_REWARDS, TUESDAY_REWARDS } from "@/constants/rewards";
// import RewardsCard from "@/components/rewards-card.vue";
import AppInvite from "@/components/AppInvite.vue";
import useUserStore from "@/stores/user";
import TwitterFollowVerify from "@/components/TwitterFollowVerify.vue";
// import { Carousel, Slide, Navigation } from "vue3-carousel";
import { hexlify } from "ethers";
// import dayjs from "dayjs";

const requestStore = useRequestStore();
const showSuccessMessage = ref(false);
const shareDetails = ref({
  shareLink: "",
  requestId: "",
});
const recipientId = ref("");
const showInvitePopup = ref(false);
const showFollowVerify = ref({
  show: false,
  type: "",
});
const userStore = useUserStore();
// const rewardCards = ref([] as typeof EARN_XP);
const requestSymbol = ref("");
const requestAmount = ref("");
const rewardsInterval = ref(null as any);
// const currentDayOfWeek = ref(dayjs().day());

// const displayableRewards = computed(() => {
//   if ([1, 3].includes(currentDayOfWeek.value)) {
//     return [...MONDAY_REWARDS, ...rewardCards.value];
//   } else if ([2, 4].includes(currentDayOfWeek.value)) {
//     return [...TUESDAY_REWARDS, ...rewardCards.value];
//   } else {
//     return [...rewardCards.value];
//   }
// });

function handleTxSuccess(data) {
  showSuccessMessage.value = true;
  shareDetails.value = {
    shareLink: data.share_url,
    requestId: hexlify(data.request_id),
  };
  recipientId.value = data.recipientId;
  requestSymbol.value = data.symbol;
  requestAmount.value = data.amount;
}

function resetUserInput() {
  requestStore.resetUserInput();
}

async function handleSuccessModalClose() {
  showSuccessMessage.value = false;
  await userStore.fetchUserPointsAndRank();
  resetUserInput();
}

// function OpenVerifyFollow() {
//   showFollowVerify.value.show = true;
//   showFollowVerify.value.type = "twitter";
// }

onBeforeMount(async () => {
  await userStore.fetchUserPointsAndRank();
  // rewardCards.value = EARN_XP.filter((item) =>
  //   userStore.followedOnTwitter ? item.medium !== "twitter" : true
  // );
  // rewardsInterval.value = setInterval(() => {
  //   currentDayOfWeek.value = dayjs().day();
  // }, 1000 * 60);
});

onBeforeUnmount(() => {
  clearInterval(rewardsInterval.value);
});
</script>

<template>
  <RequestSuccess
    v-if="showSuccessMessage"
    :share-details="shareDetails"
    :recipient-id="recipientId"
    :symbol="requestSymbol"
    :amount="requestAmount"
    @close="handleSuccessModalClose"
  />
  <AppInvite v-if="showInvitePopup" @close="showInvitePopup = false" />
  <TwitterFollowVerify
    v-if="showFollowVerify.show"
    @close="showFollowVerify.show = false"
    :medium="showFollowVerify.type"
  />
  <div
    class="flex flex-col justify-center items-center p-10 max-lg:px-4 space-y-10"
  >
    <RequestForm @transaction-successful="handleTxSuccess" />
  </div>
  <!-- <Carousel
    wrap-around
    pause-autoplay-on-hover
    :autoplay="3000"
    :transition="500"
    class="w-full max-w-[600px] m-auto mb-3"
  >
    <Slide v-for="item in displayableRewards" :key="JSON.stringify(item)">
      <RewardsCard
        class="carousel__item"
        :reward="item"
        @invite="showInvitePopup = true"
        @verify-follow="OpenVerifyFollow"
      />
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel> -->
  <!-- <span class="text-xs text-philippine-gray max-w-[720px] mb-5 px-4 mx-auto"
    >* Note: Earn Send XP for up to 50 transactions daily; no limits on 10%
    bonus XP.</span
  > -->
</template>
