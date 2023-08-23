<script setup lang="ts">
import ArrowRightIcon from "@/assets/images/icons/arrow-right.svg";
import { useRouter } from "vue-router";

defineProps({
  reward: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const emits = defineEmits(["invite", "verify-follow"]);

function onClick(reward) {
  if (reward.task === "invite") {
    emits("invite");
  } else if (reward.task === "Follow") {
    window.open(reward.url, "_blank");
    emits("verify-follow");
  } else if (reward.task === "Shoutout") {
    router.push({ name: "History" });
  }
}
</script>

<template>
  <button
    class="flex min-w-[360px] max-w-[360px] w-[360px] rounded-[10px] overflow-hidden border border-jet pr-5 bg-[#0e0e0e]"
    :class="{ 'cursor-pointer': reward.task }"
    @click.stop="onClick(reward)"
  >
    <div
      class="flex h-full items-center justify-center p-6 bg-[#151515] border-r-jet border-r"
    >
      <img :src="reward.image" :alt="reward.name" class="w-8 h-8" />
    </div>
    <div class="flex justify-between gap-5 flex-grow w-full items-center">
      <div class="flex flex-col text-start px-4 py-5">
        <span class="text-base font-bold text-[#d8d8d8]">{{
          reward.name
        }}</span>
        <span class="text-sm text-philippine-gray">{{
          reward.description
        }}</span>
        <span v-if="reward.dailyLimit" class="text-sm text-philippine-gray"
          ><strong>Daily Limit:</strong> {{ reward.dailyLimit }}XP</span
        >
        <span v-if="reward.bonus" class="text-sm text-philippine-gray mt-4"
          ><strong>Bonus:</strong> {{ reward.bonus }}</span
        >
      </div>
    </div>
    <div
      class="flex items-center h-full ml-2"
      v-if="reward.task"
      @click="emits(reward.task)"
    >
      <img
        :src="ArrowRightIcon"
        class="w-5 h-5"
        :class="{
          'opacity-0': reward.task === 'Transact',
        }"
        alt=""
      />
    </div>
  </button>
</template>
