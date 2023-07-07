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
    supportedChains: [],
  }),
  actions: {
    setSupportedChains(chains) {
      this.supportedChains = chains;
    },
    resetUserInput() {
      this.userInput = {
        medium: "",
        recipientId: "",
        chain: "",
        token: "",
        amount: "",
      };
    },
  },
});

export default useSendStore;
