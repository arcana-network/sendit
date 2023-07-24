import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import chainList from "@/constants/chainList.ts";

type SendStoreKind = {
  userInput: {
    medium: "" | "twitter" | "mail";
    recipientId: string;
    chain: string | number;
    token: string;
    amount: number | null;
  };
  supportedChains: {
    chain_id: number | string;
    name: string;
    blockchain: string;
  }[];
};

const useSendStore = defineStore("send", {
  state: () =>
    ({
      userInput: {
        medium: "mail",
        recipientId: "",
        chain: "",
        token: "",
        amount: null,
      },
      supportedChains: [],
    } as SendStoreKind),
  actions: {
    async fetchSupportedChains() {
      const socketConnection = useSocketConnection();
      const { chains } = (await socketConnection.sendMessage(
        SOCKET_IDS.GET_CHAINS
      )) as { chains: any[] };
      this.supportedChains = chains.map((chain) => {
        return {
          ...chain,
          blockchain: chainList[Number(chain.chain_id)].blockchain,
        };
      });
    },
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

export default useSendStore;
