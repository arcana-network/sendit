<script lang="ts" setup>
import Overlay from "@/components/overlay.vue";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";
import useUserStore from "@/stores/user";

type ClaimNFTProps = {
  details: any;
};

const props = defineProps<ClaimNFTProps>();

const emit = defineEmits(["close"]);
const socket = useSocketConnection();
const loader = useLoaderStore();
const toast = useToast();
const user = useUserStore();

async function redeemXP() {
  loader.showLoader("Redeeming NFT...");
  const message = {
    nft_points: props.details.xar,
  };
  await socket.sendMessage(SOCKET_IDS.REDEEM_REWARDS, message);
  emit("close");
  user.fetchUserPointsAndRank();
  toast.success("NFT redeemed successfully");
  loader.hideLoader();
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[720px] w-full bg-eerie-black rounded-[10px] border-1 border-jet flex relative p-4 gap-5"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('close')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <div class="flex gap-5 w-full">
        <img
          :src="props.details.image"
          alt="nft"
          class="aspect-square object-cover object-center"
          style="width: calc(50% - 10px)"
        />
        <div class="flex flex-col" style="width: calc(50% - 10px)">
          <span class="text-[2rem] font-bold">{{ props.details.name }}</span>
          <span class="font-[500] mt-5"
            >Redeem this NFT using {{ props.details.xp }} XP
          </span>
          <ol
            type="1"
            class="text-sm text-philippine-gray list-decimal ml-4 mt-3"
          >
            <li>
              This NFT will be exchangeable for 25 XAR tokens post token launch
            </li>
            <li>
              The XP used for redeeming this NFT will be deducted from your
              total balance
            </li>
            <li>
              Redeeming this NFT will count towards your position on the
              leaderboard by 2 ranks
            </li>
            <li>
              Want to know what else you can do with this NFT?
              <a href="#" class="text-white font-bold">Learn More</a>
            </li>
          </ol>
          <div class="flex flex-col mt-8 gap-4">
            <button
              class="uppercase bg-white text-black rounded-[5px] text-xs font-bold px-8 py-3"
              @click.stop="redeemXP"
            >
              Redeem Now
            </button>
            <button
              class="uppercase border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
              @click.stop="emit('close')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Overlay>
</template>
