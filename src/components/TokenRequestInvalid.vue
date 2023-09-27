<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import { computed } from "vue";

const props = defineProps<{
  type: string;
}>();

const emit = defineEmits(["dismiss"]);

const popupTitle = computed(() => {
  if (props.type === "expired") {
    return "Token Request Expired";
  } else if (props.type === "fulfilled") {
    return "Tokens Already Sent";
  } else if (props.type === "cancelled") {
    return "Token Request Cancelled";
  } else if (props.type === "rejected") {
    return "Token Request Rejected";
  }
  return "";
});

const popupDescription = computed(() => {
  if (props.type === "expired") {
    return "The request for the tokens has expired as it has been over a week since the request was created.";
  } else if (props.type === "fulfilled") {
    return "The requested tokens have already been sent to the recipient.";
  } else if (props.type === "cancelled") {
    return "The request for the tokens was cancelled by the requester.";
  } else if (props.type === "rejected") {
    return "The request for the tokens is already been rejected by someone.";
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
