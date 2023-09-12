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
    async sendRequest({ amount }) {
      const web3Provider = new ethers.BrowserProvider(authStore.provider);
      const wallet = await web3Provider.getSigner();
      const senditContract = new ethers.Contract(
        "0x56ce7Fd7e2ee6d117623Ea1e53f94c14067067B0",
        SenditRequestABI,
        wallet
      );
      const requestNonce = ethers.randomBytes(32);
      const request = {
        nonce: BigInt(ethers.hexlify(requestNonce)),
        recipient: userStore.address,
        value: amount,
        token_address:
          this.userInput.token === "NATIVE"
            ? ethers.ZeroAddress
            : this.userInput.token,
        expiry: Date.now() + 1000 * 60 * 60 * 24 * 30,
      };
      const dataToSign = await buildTypedData(
        Number(this.userInput.chain),
        senditContract,
        request
      );
      const signature = await signTypedData(authStore.provider, dataToSign);
      console.log(signature);
      console.log({
        target: this.userInput.address
          ? Buffer.from(ethers.getBytes(this.userInput.address))
          : undefined,
        target_verifier:
          this.userInput.medium === "mail"
            ? "passwordless"
            : this.userInput.medium === "twitter"
            ? "twitter"
            : undefined,
        target_verifier_id:
          this.userInput.medium === "wallet"
            ? undefined
            : this.userInput.medium === "mail"
            ? normaliseEmail(this.userInput.recipientId)
            : this.userInput.recipientId,
        chain_id: this.userInput.chain,
        data: {
          nonce: requestNonce,
          value: Buffer.from(ethers.getBytes(amount)),
          token_address:
            this.userInput.token === "NATIVE"
              ? Buffer.from(ethers.getBytes(ethers.ZeroAddress))
              : Buffer.from(ethers.getBytes(this.userInput.token)),
        },
        signature: Buffer.from(ethers.getBytes(signature)),
      });
      await conn.sendMessage(SOCKET_IDS.CREATE_REQUEST, {
        target: this.userInput.address
          ? Buffer.from(ethers.getBytes(this.userInput.address))
          : undefined,
        target_verifier:
          this.userInput.medium === "mail"
            ? "passwordless"
            : this.userInput.medium === "twitter"
            ? "twitter"
            : undefined,
        target_verifier_id:
          this.userInput.medium === "wallet"
            ? undefined
            : this.userInput.recipientId,
        chain_id: this.userInput.chain,
        data: {
          nonce: requestNonce,
          value: Buffer.from(ethers.getBytes(amount)),
          token_address:
            this.userInput.token === "NATIVE"
              ? Buffer.from(ethers.getBytes(ethers.ZeroAddress))
              : Buffer.from(ethers.getBytes(this.userInput.token)),
        },
        signature: Buffer.from(ethers.getBytes(signature)),
      });
    },
  },
});

export default useRequestStore;
