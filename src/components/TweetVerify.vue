<script lang="ts" setup>
import Overlay from "@/components/overlay.vue";
import { SOCKET_IDS } from "@/constants/socket-ids";
import useLoaderStore from "@/stores/loader";
import useUserStore from "@/stores/user";
import useSocketConnection from "@/use/socketConnection";
import { getBytes } from "ethers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

type TweetVerifyProps = {
  xp: number;
  hash: string;
};

const props = defineProps<TweetVerifyProps>();
const emit = defineEmits(["close"]);
const isTweetVerified = ref(false);
const router = useRouter();
const tweetUrl = ref("");
const loaderStore = useLoaderStore();
const socketConnection = useSocketConnection();
const toast = useToast();
const userStore = useUserStore();

async function handleTweetVerify() {
  if (tweetUrl.value) {
    loaderStore.showLoader("Verifying tweet...");
    try {
      const message = {
        tx_hash: Buffer.from(getBytes(props.hash)),
        url: tweetUrl.value,
      };
      await socketConnection.sendMessage(SOCKET_IDS.VERIFY_TWEET, message);
      isTweetVerified.value = true;
      userStore.fetchUserPointsAndRank();
    } catch (e) {
      console.error(e);
      toast.error("Error verifying tweet. Please try again.");
    }
    loaderStore.hideLoader();
  }
}

function handleViewRewards() {
  router.push({ name: "Rewards" });
  emit("close");
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[540px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('close')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <div v-if="isTweetVerified" class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-[20px] uppercase font-bold"
            >{{ props.xp }} XP Earned</span
          >
          <span class="text-xs text-philippine-gray max-w-[320px] text-center">
            Copy the link to send it to your recipient or click the button below
            to share it using the sharing methods supported by your OS.
          </span>
        </div>
        <div class="flex justify-end">
          <button
            class="uppercase w-full border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
            @click.stop="handleViewRewards"
          >
            View Rewards
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-[20px] uppercase font-bold"
            >Shoutout</span
          >
          <span class="text-xs text-philippine-gray max-w-[320px] text-center">
            Copy and paste the link to the Tweet that was just posted to receive
            the points for the shoutout below:
          </span>
        </div>
        <form class="flex flex-col gap-5" @submit.prevent="handleTweetVerify">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-[500]" for="email-invite"
              >Tweet URL</label
            >
            <input
              type="text"
              id="email-invite"
              v-model.trim="tweetUrl"
              placeholder="Paste URL here..."
              class="text-sm placeholder:text-philippine-gray bg-[#313131] rounded-[5px] p-2"
            />
          </div>
          <div class="flex justify-end">
            <button
              :disabled="!tweetUrl"
              class="uppercase w-full border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
            >
              Verify Now
            </button>
          </div>
        </form>
      </div>
    </div>
  </Overlay>
</template>
