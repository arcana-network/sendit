import { defineStore } from "pinia";

type SendStoreKind = {
  userInput: {
    medium: "" | "twitter" | "mail";
    recipientId: string;
    chain: string;
    token: string;
    amount: string;
  };
  supportedChains: {
    chain_id: number | string;
    name: string;
  }[];
};

const useSendStore = defineStore("send", {
  state: () =>
    ({
      userInput: {
        medium: "",
        recipientId: "",
        chain: "",
        token: "",
        amount: "",
      },
      supportedChains: [],
    } as SendStoreKind),
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
