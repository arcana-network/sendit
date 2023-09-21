<script setup lang="ts">
import { toRefs, ref, onMounted } from "vue";
import useSendStore from "@/stores/send";
import useAuthStore from "@/stores/auth";
import useLoaderStore from "@/stores/loader";
import { useConnection } from "@/stores/connection";
import { useToast } from "vue-toastification";
import { SOCKET_IDS } from "@/constants/socket-ids";
import chains from "@/constants/chainList";
import { ethers, hexlify } from "ethers";
import { GAS_SUPPORTED_CHAINS } from "@/constants/socket-ids";
import { Decimal } from "decimal.js";
import erc20ABI from "@/abis/erc20.abi.json";
import useUserStore from "@/stores/user";
import axios from "axios";
import {
  type FeeData,
  requestedTokenTransfer,
  getERC20Approval,
} from "@/services/send.service";
import requestVia from "@/constants/requestVia";

const emits = defineEmits(["transaction-successful"]);
const ACTION_REJECTED = "ACTION_REJECTED";
const INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
const SELF_TX_ERROR = "self-transactions are not permitted";

const sendStore = useSendStore();
const authStore = useAuthStore();
const loadStore = useLoaderStore();
const userStore = useUserStore();
const tokenBalance = ref("0");
const conn = useConnection();
const toast = useToast();
const tokenSymbol = ref("");
const tokenDecimals = ref(0);
const tokenBalanceInUnits = ref(0);
const displayAmount = ref("0");

const { requestInput, supportedChains } = toRefs(sendStore);

onMounted(async () => {
  const chainId = await authStore.provider.request({
    method: "eth_chainId",
  });
  if (Number(chainId) !== Number(requestInput.value.chain)) {
    loadStore.showLoader(
      "Switching chain...",
      `Switch to ${
        chains[Number(requestInput.value.chain)].name
      } chain before sending tokens`
    );
    try {
      await switchChain(requestInput.value.chain as string);
    } catch (e) {
      toast.error(
        "Switching chain rejected by user. Cannot proceed with this transaction."
      );
    } finally {
      loadStore.hideLoader();
    }
  }
  loadStore.showLoader("Fetching account balance...");
  if (requestInput.value.token === ethers.ZeroAddress) {
    const currentChain = chains[Number(requestInput.value.chain)];
    tokenSymbol.value = currentChain.currency;
    tokenDecimals.value = 18;
    const payload = {
      method: "eth_getBalance",
      params: [userStore.address, "latest"],
      id: 1,
      jsonrpc: "2.0",
    };
    const res = await axios.post(currentChain.rpc_url, payload);
    tokenBalance.value = new Decimal(res.data.result)
      .div(Decimal.pow(10, 18))
      .toString();
    tokenBalanceInUnits.value = new Decimal(res.data.result).toNumber();
  } else {
    const ethersContract = new ethers.Contract(
      requestInput.value.token,
      erc20ABI,
      authStore.provider
    );
    const [symbol, decimals, balance] = await Promise.all([
      ethersContract.symbol(),
      ethersContract.decimals(),
      ethersContract.balanceOf(userStore.address),
    ]);
    tokenSymbol.value = symbol;
    tokenDecimals.value = decimals;
    tokenBalance.value = new Decimal(balance)
      .div(Decimal.pow(10, decimals))
      .toString();
    tokenBalanceInUnits.value = new Decimal(balance).toNumber();
  }
  displayAmount.value = new Decimal(requestInput.value.amount as number)
    .div(Decimal.pow(10, tokenDecimals.value))
    .toString();
  loadStore.hideLoader();
});

function getSelectedChainInfo(chainId) {
  //@ts-ignore
  return supportedChains.value.find(
    (chain) => Number(chain.chain_id) === Number(chainId)
  );
}

async function proceed() {
  loadStore.showLoader("Sending tokens...");
  let hasUserRejectedChainSwitching = false;
  const chainId = await authStore.provider.request({
    method: "eth_chainId",
  });
  if (Number(chainId) !== Number(requestInput.value.chain)) {
    loadStore.showLoader(
      "Switching chain...",
      `Switch to ${
        chains[Number(requestInput.value.chain)].name
      } chain before sending tokens`
    );
    try {
      await switchChain(requestInput.value.chain as string);
    } catch (e) {
      hasUserRejectedChainSwitching = true;
    }
  }
  if (!hasUserRejectedChainSwitching) {
    loadStore.showLoader(
      "Sending tokens...",
      `Sending ${displayAmount.value} ${tokenSymbol.value} to ${
        requestInput.value.recipientVerifierHuman
      } on ${
        chains[Number(requestInput.value.chain)].name
      } chain. Please approve the transaction on your wallet and wait until it is completed.`
    );
    try {
      const chainId = requestInput.value.chain;
      let feeData: FeeData | null = null;
      if (GAS_SUPPORTED_CHAINS.includes(Number(chainId))) {
        const gasStation: any = await conn.sendMessage(
          SOCKET_IDS.GET_GAS_STATION,
          {
            chain_id: chainId,
          }
        );
        feeData = {
          maxFeePerGas: hexlify(gasStation.max_fee),
          maxPriorityFeePerGas: hexlify(gasStation.max_priority_fee),
        };
      }
      const isNative = requestInput.value.token === ethers.ZeroAddress;
      if (!isNative) {
        await getERC20Approval(
          requestInput.value.token,
          supportedChains.value.find(
            (chain) => Number(chain.chain_id) === Number(chainId)
          )?.sendit_contract as string,
          new Decimal(requestInput.value.amount as number).toHexadecimal(),
          authStore.provider
        );
      }
      const data = {
        recipientAddress: requestInput.value.recipientAddress,
        value: new Decimal(requestInput.value.amount as number).toHexadecimal(),
        tokenAddress: requestInput.value.token,
        signature: requestInput.value.signature,
        nonce: requestInput.value.nonce,
        // Convert expiry to Number from BigInt
        expiry: Number(requestInput.value.expiry),
        isNative,
        provider: authStore.provider,
        senditContract: supportedChains.value.find(
          (chain) => Number(chain.chain_id) === Number(chainId)
        )?.sendit_contract as string,
      };
      const { hash } = await requestedTokenTransfer(data, feeData);
      await conn.sendMessage(SOCKET_IDS.FULFILL_REQUEST, {
        tx_hash: ethers.getBytes(hash),
        request_id: ethers.getBytes(requestInput.value.requestId),
      });
      emits("transaction-successful", {});
    } catch (error: any) {
      console.log(error);
      if (error === SELF_TX_ERROR || error.message === SELF_TX_ERROR) {
        toast.error("You cannot send tokens to yourself");
      } else if (error.code === ACTION_REJECTED) {
        toast.error(
          "Signature request rejected. Please retry sending, approve the transaction on your wallet and wait until it is completed."
        );
      } else if (error.code === INSUFFICIENT_FUNDS) {
        toast.error("Insufficient Gas to make this transaction.");
      } else {
        if (error.error?.data?.originalError?.body) {
          const body = error.error?.data?.originalError?.body;
          const errorBody =
            typeof body === "string"
              ? JSON.parse(error.error?.data?.originalError?.body)
              : body;
          if (errorBody?.error?.message) {
            toast.error(errorBody?.error?.message);
          } else {
            toast.error(errorBody?.error || errorBody);
          }
        } else {
          const displayError = (error.error?.data?.originalError?.error
            ?.message ||
            error.error?.data?.originalError?.reason ||
            error.error?.data?.originalError?.code ||
            error.message ||
            error) as string;
          toast.error(displayError);
        }
      }
    } finally {
      loadStore.hideLoader();
    }
  } else {
    loadStore.hideLoader();
    toast.error(
      "Switching chain rejected by user. Cannot proceed with this transaction."
    );
  }
}

async function switchChain(chainId: string) {
  await authStore.provider.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: new Decimal(chainId).toHexadecimal(),
      },
    ],
  });
}

function isSelectedVerifier(verifier, v) {
  if (verifier === "null" && v === "wallet") {
    return true;
  } else if (verifier === "passwordless" && v === "mail") {
    return true;
  } else if (verifier === "twitter" && v === "twitter") {
    return true;
  }
  return false;
}
</script>

<template>
  <div
    class="w-full max-w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase font-bold">Send Tokens</h1>
    <hr class="border-0 border-b border-solid border-[#363636] -mx-4" />
    <form class="space-y-3">
      <div class="space-y-1">
        <h2 class="text-xs">Send Via</h2>
        <div class="flex items-center space-x-2">
          <div
            v-for="medium in requestVia"
            :key="medium.value"
            class="border-1 p-1.5 rounded-full transition-all hover:bg-[#313131] cursor-pointer h-[44px] w-[44px] flex items-center justify-center"
            :class="{
              'border-[#4D4D4D]': !isSelectedVerifier(
                requestInput.recipientVerifier,
                medium.value
              ),
              'border-white bg-[#313131]': isSelectedVerifier(
                requestInput.recipientVerifier,
                medium.value
              ),
            }"
          >
            <img :src="medium.icon" :alt="medium.value" />
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Recipient ID</label>
        <input
          class="input"
          :value="requestInput.recipientVerifierHuman"
          disabled
        />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Chain</label>
        <input
          class="input"
          :value="getSelectedChainInfo(requestInput.chain)?.name"
          disabled
        />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Token</label>
        <input class="input" :value="tokenSymbol" disabled />
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between">
          <label class="text-xs">Amount</label>
          <span v-if="requestInput.token" class="text-xs"
            >Balance: {{ tokenBalance }}</span
          >
        </div>
        <input class="input" type="number" :value="displayAmount" disabled />
        <div
          class="text-[#ff4264] text-[10px]"
          v-if="Number(tokenBalanceInUnits) < Number(requestInput.amount)"
        >
          Entered amount is greater than your wallet balance.
        </div>
      </div>
      <div class="flex justify-center pt-4">
        <button
          @click.prevent="proceed"
          type="submit"
          class="w-full text-sm btn btn-submit disabled:opacity-50"
          :disabled="Number(tokenBalanceInUnits) < Number(requestInput.amount)"
        >
          Send It
        </button>
      </div>
    </form>
  </div>
</template>
