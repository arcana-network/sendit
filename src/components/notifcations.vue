<script setup lang="ts">
import useNotificationStore from "@/stores/notification";
import { toRefs } from "vue";

const notificationStore = useNotificationStore();
const { notificationList } = toRefs(notificationStore);

function markAllAsRead() {
  notificationStore.markAllAsRead();
}

function onClickNotification(notification) {
  notificationStore.markAsRead(notification.id);
}
</script>

<template>
  <div
    class="form-card p-0 space-y-[1px] w-96 max-h-96 flex divide-y-[1px] divide-philippine-gray"
  >
    <div class="w-full p-4 flex justify-between">
      <span class="text-base uppercase font-bold">Notifications</span>
      <button class="text-xs" @click.prevent="markAllAsRead">
        Mark all as read
      </button>
    </div>
    <div
      class="w-full flex-1 divide-y-[1px] overflow-auto divide-philippine-gray"
    >
      <div
        class="p-4 flex"
        v-for="notification in notificationList"
        @click="onClickNotification(notification)"
      >
        <div class="flex flex-col text-left space-y-1 flex-1">
          <span class="text-sm">{{ notification.content.title }}</span>
          <span class="text-xs">
            {{ notification.content.body }}
          </span>
        </div>
        <div
          v-if="notification.shoutout"
          class="h-20 border-1 border-philippine-gray rounded-md flex flex-col items-center"
        >
          <img
            src="@/assets/images/icons/twitter.svg"
            alt="twitter"
            class="w-8 flex-1"
          />
          <span
            class="text-cornflower-blue text-xs font-light bg-feep-koamaru p-1 rounded-md"
            >Earn 40 XP</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
