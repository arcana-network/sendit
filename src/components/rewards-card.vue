<script setup lang="ts">
import ArrowRightIcon from "@/assets/images/icons/arrow-right.svg";
import ArrowStayUpdated from "@/assets/images/arrow-stay-updated.svg";
import TextStayUpdated from "@/assets/images/text-stay-updated.svg";

defineProps({
  reward: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["invite", "verify-follow"]);

function onClick(reward) {
  if (reward.task === "invite") {
    emits("invite");
  } else if (reward.task === "Follow") {
    window.open(reward.url, "_blank");
    emits("verify-follow");
  }
}
</script>

<template>
  <div>
    <div v-if="reward.task === 'Follow'" class="relative | flex">
      <img
        :src="ArrowStayUpdated"
        alt="stay updated"
        class="absolute -top-16 right-24"
      />
      <img
        :src="TextStayUpdated"
        alt="stay updated"
        class="absolute -top-16 -right-6"
      />
    </div>
    <div
      class="flex w-80 h-28 border-1 border-jet bg-[#0e0e0e] rounded-md overflow-hidden"
      :class="{ 'cursor-pointer': reward.task }"
      @click.stop="onClick(reward)"
    >
      <div class="bg-eerie-black p-4 flex items-center">
        <img :src="reward.image" :alt="reward.name" class="w-8 h-8" />
      </div>
      <div class="space-y-1 flex-1 p-4">
        <p>{{ reward.name }}</p>
        <p class="text-xs text-philippine-gray">{{ reward.description }}</p>
      </div>
      <button class="p-4" v-if="reward.task" @click="emits(reward.task)">
        <img :src="ArrowRightIcon" alt="" />
      </button>
    </div>
  </div>
</template>
