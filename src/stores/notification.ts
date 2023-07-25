import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import notificationsContent from "@/constants/notificationsContent";

const socket = useSocketConnection();
const COUNT = 10;
const Notification_Type_Received_Crypto = 256;

const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as any[],
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
    notificationCount(state) {
      return state.notifications.filter((n) => !n.read).length;
    },
    notificationReceivedToken(state) {
      return state.notifications.filter(
        (n) =>
          n.notification_type === Notification_Type_Received_Crypto && !n.read
      );
    },
  },
  actions: {
    async getNotifications() {
      const { notifications } = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION,
        this.getNotificationpayload
      )) as any;
      console.log(notifications);
      this.notifications = notifications.map((n) => ({
        ...n,
        content: notificationsContent[n.notification_type](n.info),
      }));
    },
    async markAllAsRead() {
      const payload = {
        ids: [0],
      };
      const response = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION_MARK_AS_READ,
        payload
      )) as any;
      if (response.ok) {
        this.notifications = this.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      }
    },
    async markAsRead(notificationId: string) {
      const payload = {
        ids: [notificationId],
      };
      const response = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION_MARK_AS_READ,
        payload
      )) as any;
      if (response.ok) {
        const index = this.notifications.findIndex(
          (n) => n.id === notificationId
        );
        this.notifications[index].read = true;
      }
    },
    async markMultipleAsRead(notificationIDs: Array<string>) {
      const payload = {
        ids: notificationIDs,
      };
      const response = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION_MARK_AS_READ,
        payload
      )) as any;
      if (response.ok) {
        this.notifications = this.notifications
          .filter((n) => notificationIDs.indexOf(n.id))
          .map((n) => ({ ...n, read: true }));
      }
    },
  },
});

export default useNotificationStore;
