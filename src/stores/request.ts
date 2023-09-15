import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";
import { ethers } from "ethers";
import SenditRequestABI from "@/abis/sendit-request.abi.json";
import useAuthStore from "@/stores/auth";
import { buildTypedData, signTypedData } from "@/constants/signTypedData";
import useUserStore from "@/stores/user";
import { normaliseEmail } from "@/utils/normalise";

const conn = useConnection(activePiniaInstance);
const authStore = useAuthStore(activePiniaInstance);
const userStore = useUserStore(activePiniaInstance);

type RequestStoreKind = {
  userInput: {
    medium: "" | "twitter" | "mail" | "wallet";
    recipientId: string;
    chain: string | number;
    token: string;
    amount: number | null;
    address: string;
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
        address: "",
        chain: "",
        token: "",
        amount: null,
      };
    },
    async sendRequest({ amount, senditContractAddress }) {
      const web3Provider = new ethers.BrowserProvider(authStore.provider);
      const wallet = await web3Provider.getSigner();
      const senditContract = new ethers.Contract(
        senditContractAddress,
        SenditRequestABI,
        wallet
      );
      const requestNonce = ethers.randomBytes(32);
      const expiry = Date.now() + 1000 * 60 * 60 * 24 * 30;
      const request = {
        nonce: BigInt(ethers.hexlify(requestNonce)),
        recipient: userStore.address,
        value: amount,
        token_address:
          this.userInput.token === "NATIVE"
            ? ethers.ZeroAddress
            : this.userInput.token,
        expiry,
      };
      const dataToSign = await buildTypedData(
        Number(this.userInput.chain),
        senditContract,
        request
      );
      console.log({ dataToSign });
      const signature = await signTypedData(authStore.provider, dataToSign);
      console.log({ signature });
      const data = {
        target: this.userInput.address
          ? ethers.getBytes(this.userInput.address)
          : "null",
        target_verifier:
          this.userInput.medium === "mail"
            ? "passwordless"
            : this.userInput.medium === "twitter"
            ? "twitter"
            : "null",
        target_verifier_id:
          this.userInput.medium === "wallet"
            ? undefined
            : this.userInput.medium === "mail"
            ? normaliseEmail(this.userInput.recipientId)
            : this.userInput.recipientId,
        chain_id: this.userInput.chain,
        data: {
          nonce: requestNonce,
          value: Buffer.from(amount.slice(2), "hex"),
          token_address:
            this.userInput.token === "NATIVE"
              ? ethers.getBytes(ethers.ZeroAddress)
              : ethers.getBytes(this.userInput.token),
          expiry: BigInt(expiry),
        },
        signature: ethers.getBytes(signature),
      };
      return await conn.sendMessage(SOCKET_IDS.CREATE_REQUEST, data);
    },
  },
});

export default useRequestStore;
