<script setup lang="ts">
import MailIcon from "../../assets/images/icons/mail.svg";
import TwitterIcon from "../../assets/images/icons/twitter.svg";
import GithubIcon from "../../assets/images/icons/github.svg";

const sendMedium = [
  {
    icon: MailIcon,
    value: "mail",
  },
  {
    icon: TwitterIcon,
    value: "twitter",
  },
  {
    icon: GithubIcon,
    value: "github",
  },
];
</script>

<template>
  <div
    class="w-[450px] space-y-4 border-1 border-jet p-4 rounded-md bg-eerie-black"
  >
    <h1 class="uppercase">Transaction Details</h1>
    <div class="space-y-1">
      <h2 class="text-xs font-medium">Send Via</h2>
      <div class="flex items-center space-x-2">
        <div
          v-for="medium in sendMedium"
          :key="medium.value"
          class="border-1 border-jet p-1.5 rounded-full"
        >
          <img :src="medium.icon" :alt="medium.value" />
        </div>
      </div>
    </div>
    <form class="space-y-4">
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Recipient's ID</label>
        <input class="input" />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Chain</label>
        <input class="input" />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Token</label>
        <input class="input" />
      </div>
      <div class="flex flex-col space-y-1">
        <label class="text-xs">Amount</label>
        <input class="input" />
      </div>
      <button class="w-full btn btn-submit">Proceed</button>
    </form>
  </div>
</template>
