import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";

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
    payload(state) {
      return {
        offset: state.offset,
        count: COUNT,
      };
    },
  },
  actions: {
    async getNotifications() {
      const { notifications } = (await socket.sendMessage(
        SOCKET_IDS.NOTIFICATION,
        this.payload
      )) as any;
      this.notifications = notifications;
    },
  },
});

export default useNotificationStore;
