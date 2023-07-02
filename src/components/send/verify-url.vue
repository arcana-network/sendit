<script setup lang="ts">
import SuccessTick from "@/assets/images/icons/success-tick.svg";
</script>

<template>
  <div
    class="w-[450px] flex flex-col items-center border-1 border-jet p-4 rounded-md bg-eerie-black space-y-5"
  >
    <img :src="SuccessTick" alt="success" />
    <div class="space-y-2 flex flex-col items-center">
      <h1 class="uppercase">Shoutout</h1>
      <p class="text-philippine-gray text-[10px] w-3/4 text-center">
        Copy and paste the link to the Tweet that was just posted to receive the
        points for the shoutout below:
      </p>
    </div>
    <div class="flex flex-col w-full space-y-2">
      <label for="tweet-url" class="text-xs">Tweet URL</label>
      <input
        id="tweet-url"
        class="input bg-dark-charcoal p-2.5 text-sm"
        placeholder="Paste URL here"
      />
    </div>
    <div class="flex flex-col space-y-3 w-full">
      <button class="btn btn-submit-secondary w-full uppercase">
        Verify Now
      </button>
    </div>
  </div>
</template>
