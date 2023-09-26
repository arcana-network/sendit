<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import { onBeforeMount, reactive } from "vue";
import { ethers, hexlify } from "ethers";
import { requestableTokens } from "@/constants/requestableTokens";
import Decimal from "decimal.js";

const props = defineProps<{
  data: any;
}>();

const reactiveData = reactive({
  symbol: "",
  decimals: "",
  amount: "",
});

onBeforeMount(() => {
  const tokenAddr = hexlify(props.data.data.token_address);
  const r = requestableTokens[props.data.chain_id].find((token) =>
    tokenAddr === ethers.ZeroAddress
      ? token.address === "NATIVE"
      : token.address === tokenAddr
  );
  reactiveData.symbol = r.symbol;
  reactiveData.decimals = r.decimals;
  reactiveData.amount = new Decimal(hexlify(props.data.data.value))
    .div(Decimal.pow(10, r.decimals))
    .toString();
});

const emits = defineEmits(["dismiss", "reject", "accept", "do-later"]);
</script>

<template>
  <Overlay>
    <div
      class="max-w-[500px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5 relative">
        <button class="absolute right-0" @click="emits('dismiss')">
          <img src="@/assets/images/icons/close.svg" alt="close" />
        </button>
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-xl uppercase text-center"
            >TOKENS REQUESTED</span
          >
          <span class="text-xs text-philippine-gray text-center max-w-[320px]">
            You have a request to send {{ reactiveData.amount }}
            {{ reactiveData.symbol }} to
            {{ props.data.requester_meta.verifier_human }}. Would you like to do
            so now?
          </span>
        </div>
        <div class="flex flex-col gap-3">
          <button
            class="flex justify-center items-center btn btn-submit"
            @click="emits('accept')"
          >
            SEND TOKENS
          </button>
          <button
            class="flex justify-center items-center btn btn-submit-secondary"
            @click="emits('reject')"
          >
            REJECT REQUEST
          </button>
          <button
            class="flex justify-center items-center btn btn-submit-secondary"
            @click="emits('do-later')"
          >
            DO THIS LATER
          </button>
        </div>
      </div>
    </div>
  </Overlay>
</template>
