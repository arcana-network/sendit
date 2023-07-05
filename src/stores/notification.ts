import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import notificationsContent from "@/constants/notificationsContent";

const socket = useSocketConnection();
const COUNT = 10;

const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    offset: 0,
  }),
  getters: {
    areUnreadNotifications(state) {
      return state.notifications.some((n) => !n.read);
    },
    getNotificationpayload(state) {
      return {
        offset: state.offset,
        count: COUNT,
      };
    },
    notificationList(state) {
      return state.notifications.filter((n) => !n.read);
    },
  },
  actions: {
    async getNotifications() {
      const { notifications } = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION,
        this.getNotificationpayload
      )) as any;
      this.notifications = notifications.map((n) => ({
        ...n,
        content: notificationsContent[n.notification_type](n.info),
      }));
    },
    async markAllAsRead() {
      console.log("markAllAsRead");
    },
    async markAsRead(notificationId: string) {
      const payload = {
        ids: [notificationId],
      };
      const response = await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION_MARK_AS_READ,
        payload
      );
      if (response.ok) {
        const index = this.notifications.findIndex(
          (n) => n.id === notificationId
        );
        this.notifications[index].read = true;
      }
    },
  },
});

export default useNotificationStore;
