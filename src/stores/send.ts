import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import chainList from "@/constants/chainList.ts";

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
    blockchain: string;
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
    async fetchSupportedChains() {
      const socketConnection = useSocketConnection();
      const { chains } = (await socketConnection.sendMessage(
        SOCKET_IDS.GET_CHAINS
      )) as { chains: any[] };
      this.supportedChains = chains.map((chain) => {
        return {
          ...chain,
          blockchain: chainList[chain.chain_id].block_chain,
        };
      });
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
