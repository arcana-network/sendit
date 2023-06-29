import { defineStore } from "pinia";

const useSendStore = defineStore("send", {
  state: () => ({
    userInput: {
      medium: "",
      recipientId: "",
      chain: "",
      token: "",
      amount: "",
    },
  }),
});

export default useSendStore;
