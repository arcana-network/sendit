import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";
import chainList from "@/constants/chainList.ts";
import { hexlify } from "ethers";

const conn = useConnection(activePiniaInstance);

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
    sendit_contract: string;
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
      const { chains } = (await conn.sendMessage(SOCKET_IDS.GET_CHAINS)) as {
        chains: any[];
      };
      this.supportedChains = chains.map((chain) => {
        return {
          ...chain,
          sendit_contract: hexlify(chain.sendit_contract),
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
