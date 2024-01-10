<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { useConnection } from "@/stores/connection";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const conn = useConnection();
const isBannerClosed = ref(false);
</script>

<template>
  <div class="h-full flex flex-col min-h-screen">
    <div
      class="relative flex justify-center items-center p-2 bg-[#16AD65] text-[14px] font-[500] px-4 text-center"
      v-if="!isBannerClosed"
    >
      <div class="items-baseline flex-wrap justify-center mr-3">
        Send $MATIC without paying gas fees.
        <RouterLink
          :to="{
            name: 'Send',
            query: {
              sourceOfFunds: 'scw',
              token: 'NATIVE',
              blockchain: 'polygon',
            },
          }"
          class="font-bold uppercase"
          >Learn&nbsp;more</RouterLink
        >
      </div>
      <button class="absolute right-4" @click.stop="isBannerClosed = true">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
    </div>
    <AppHeader class="sticky top-0 z-[999]" id="header" />
    <div class="flex flex-col flex-1 h-full private-page">
      <div class="flex flex-col flex-1 container">
        <RouterView v-if="conn.connected"></RouterView>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
