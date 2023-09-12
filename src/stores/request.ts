import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";

const conn = useConnection(activePiniaInstance);

type RequestStoreKind = {
  userInput: {
    medium: "" | "twitter" | "mail";
    recipientId: string;
    chain: string | number;
    token: string;
    amount: number | null;
  };
};

const useRequestStore = defineStore("request", {
  state: () =>
    ({
      userInput: {
        medium: "mail",
        recipientId: "",
        chain: "",
        token: "",
        amount: null,
      },
    } as RequestStoreKind),
  actions: {
    resetUserInput() {
      this.userInput = {
        medium: "mail",
        recipientId: "",
        chain: "",
        token: "",
        amount: null,
      };
    },
  },
});

export default useRequestStore;
