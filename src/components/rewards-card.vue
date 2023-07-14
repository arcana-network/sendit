<script setup lang="ts">
import ArrowRightIcon from "@/assets/images/icons/arrow-right.svg";

defineProps({
  reward: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["invite"]);
</script>

<template>
  <div class="flex w-80 h-28 border-1 border-jet rounded-md">
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
</template>
