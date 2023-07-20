<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import useNotificationStore from "@/stores/notification";
import generateSenditUrl from "@/utils/generateSenditUrl";
import { composeAndSendTweet } from "@/utils/tweet";
import { useRouter } from "vue-router";

const emits = defineEmits(["dismiss", "tweet-shoutout"]);
const notificationStore = useNotificationStore();
const router = useRouter();

const transactionCount = notificationStore.notificationReceivedToken.length;
const isMultipleTransactions = transactionCount > 1;

const transactionDetails =
  transactionCount === 1 ? notificationStore.notificationReceivedToken[0] : "";

const tweetMessage = () =>
  `Cha-ching! 💸 Just received crypto on #SendIt. Join the #GetOnWeb3 revolution at ${generateSenditUrl()}!`;

async function handleShoutout(transactionDetails: any) {
  emits("dismiss");
  emits("tweet-shoutout", transactionDetails);
  const id = transactionDetails.id;
  await notificationStore.markAsRead(id);
  composeAndSendTweet(tweetMessage());
}

async function viewTransactions() {
  emits("dismiss");
  const notificationIDs = notificationStore.notificationReceivedToken.map(
    (item: any) => item.id
  );
  await notificationStore.markMultipleAsRead(notificationIDs);
  router.push({ name: "History" });
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[500px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5 relative">
        <button class="absolute right-0" @click="emits('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-xl uppercase">{{
            isMultipleTransactions
              ? "Received Multiple Transactions"
              : "Received Crypto"
          }}</span>
          <span
            v-if="isMultipleTransactions"
            class="text-xs text-philippine-gray text-center"
          >
            You have received crypto from multiple sources. View the
            transactions page for more details and for XP earning opportunities.
          </span>
          <span class="text-xs text-philippine-gray text-center" v-else>
            {{ transactionDetails?.content?.body }}. View the transactions page
            for more details or click the button below to earn XP!
          </span>
        </div>
        <button
          v-if="isMultipleTransactions"
          class="flex justify-center items-center p-2 space-x-2 border-2 rounded-md"
          @click="viewTransactions"
        >
          View Transactions
        </button>
        <button
          v-else
          class="flex justify-center items-center p-2 space-x-2 border-2 rounded-md"
          @click="handleShoutout(transactionDetails)"
        >
          <span class="uppercase text-sm">Shoutout on Twitter</span>
          <span
            class="text-cornflower-blue text-xs font-light bg-feep-koamaru p-1 rounded-md"
            >Earn 25 XP</span
          >
        </button>
      </div>
    </div>
  </Overlay>
</template>
