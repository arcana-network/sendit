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
  requestInput: {
    requestId: string;
    recipientAddress: string;
    recipientVerifier: string;
    recipientVerifierHuman: string;
    chain: string | number;
    token: string;
    amount: number | null;
    nonce: string;
    signature: string;
    expiry: number;
  };
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
      requestInput: {
        requestId: "",
        recipientAddress: "",
        chain: "",
        token: "",
        amount: null,
        nonce: "",
        signature: "",
        expiry: 0,
        recipientVerifier: "",
        recipientVerifierHuman: "",
      },
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
    resetRequestInput() {
      this.requestInput = {
        requestId: "",
        recipientAddress: "",
        chain: "",
        token: "",
        amount: null,
        nonce: "",
        signature: "",
        expiry: 0,
        recipientVerifier: "",
        recipientVerifierHuman: "",
      };
    },
  },
});

export default useSendStore;
