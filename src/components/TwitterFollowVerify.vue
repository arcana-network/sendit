<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Overlay from "@/components/overlay.vue";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";

const props = defineProps({
  medium: String,
});
const emit = defineEmits(["close"]);
const showVerifySuccess = ref(false);
const router = useRouter();
const conn = useConnection();
const handle = ref("");

function viewRewards() {
  router.push({ name: "Rewards" });
  emit("close");
}

async function onVerify() {
  if (handle.value) {
    const message = {
      username: handle.value,
    };
    await conn.sendMessage(SOCKET_IDS.VERIFY_TWITTER_FOLLOW, message);
    showVerifySuccess.value = true;
  }
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[540px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet relative p-4"
    >
      <div class="flex flex-col" v-if="!showVerifySuccess">
        <button class="absolute right-4 top-4" @click.stop="emit('close')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col justify-center items-center space-y-3">
            <img src="@/assets/images/arcana-orange.svg" alt="close" />
            <span class="font-[500] text-[20px] uppercase">Verify Follow</span>
            <span class="text-xs text-philippine-gray text-center">
              Enter your handle which follows the Arcana
              {{ props.medium === "twitter" ? "Twitter" : "Telegram" }} page to
              verify and earn XP.
            </span>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-2">
              <label for="handle" class="text-xs"
                >{{
                  props.medium === "twitter" ? "Twitter" : "Telegram"
                }}
                handle</label
              >
              <input
                type="text"
                class="input"
                name="handle"
                placeholder="Enter your handle"
                v-model.trim="handle"
              />
            </div>
            <button
              class="uppercase w-full border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
              @click.stop="onVerify"
            >
              Verify Now
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-4" v-else>
        <div class="flex flex-col justify-center items-center space-y-3">
          <img src="@/assets/images/blue-down-arrow.svg" alt="close" />
          <span class="font-[500] text-[20px] uppercase">20 XP Earned</span>
          <span class="text-xs text-philippine-gray text-center">
            Check out the Rewards section to see if you qualify for any of the
            awesome rewards available.
          </span>
        </div>
        <button
          class="uppercase w-full border-white border-1 rounded-[5px] text-xs font-bold px-8 py-3"
          @click.stop="viewRewards"
        >
          View Rewards
        </button>
      </div>
    </div>
  </Overlay>
</template>
