<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import { computed } from "vue";
import { errors } from "@/constants/content";

const props = defineProps<{
  type: string;
}>();

const emit = defineEmits(["dismiss"]);

const popupTitle = computed(() => {
  if (props.type === "expired") {
    return errors.TOKEN_REQUEST.EXPIRED.TITLE;
  } else if (props.type === "fulfilled") {
    return errors.TOKEN_REQUEST.ALREADY_SENT.TITLE;
  } else if (props.type === "cancelled") {
    return errors.TOKEN_REQUEST.CANCELLED.TITLE;
  } else if (props.type === "rejected") {
    return errors.TOKEN_REQUEST.REJECTED.TITLE;
  }
  return "";
});

const popupDescription = computed(() => {
  if (props.type === "expired") {
    return errors.TOKEN_REQUEST.EXPIRED.MESSAGE;
  } else if (props.type === "fulfilled") {
    return errors.TOKEN_REQUEST.ALREADY_SENT.MESSAGE;
  } else if (props.type === "cancelled") {
    return errors.TOKEN_REQUEST.CANCELLED.MESSAGE;
  } else if (props.type === "rejected") {
    return errors.TOKEN_REQUEST.REJECTED.MESSAGE;
  }
  return "";
});
</script>

<template>
  <Overlay>
    <div
      class="max-w-[480px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/exclamation.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-[20px] uppercase">{{ popupTitle }}</span>
          <span class="text-xs text-philippine-gray max-w-[320px] text-center">
            {{ popupDescription }}
          </span>
        </div>
        <div class="flex justify-center">
          <button
            class="btn btn-submit-secondary w-full"
            @click.stop="emit('dismiss')"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
