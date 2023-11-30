<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingNumbers from "@/components/landing/LandingNumbers.vue";

const LandingWhySendit = defineAsyncComponent(
  () => import("@/components/landing/LandingWhySendit.vue")
);
const LandingSenditTagline = defineAsyncComponent(
  () => import("@/components/landing/LandingSenditTagline.vue")
);
const LandingHowDoesItWork = defineAsyncComponent(
  () => import("@/components/landing/LandingHowDoesItWork.vue")
);
const LandingEarnXP = defineAsyncComponent(
  () => import("@/components/landing/LandingEarnXP.vue")
);
const LandingGetOnWeb3 = defineAsyncComponent(
  () => import("@/components/landing/LandingGetOnWeb3.vue")
);
const LandingFAQ = defineAsyncComponent(
  () => import("@/components/landing/LandingFAQ.vue")
);
const LandingFooter = defineAsyncComponent(
  () => import("@/components/landing/LandingFooter.vue")
);

const isBannerClosed = ref(false);
</script>

<template>
  <div
    class="bg-[#0E0E0E] h-screen"
    id="landing-page"
    style="overflow-x: hidden"
  >
    <div
      class="relative flex justify-center items-center p-2 bg-[#16AD65] text-[14px] font-[500] px-4 text-center"
      v-if="!isBannerClosed"
    >
      <div class="items-baseline flex-wrap justify-center mr-3">
        $XAR Public Sale is Live on Republic
        <a
          href="https://republic.com/arcana/"
          target="_blank"
          rel="noopener"
          class="btn-submit py-1 px-2 rounded-md font-bold border-none"
          >Visit&nbsp;Republic</a
        >
        &nbsp;&nbsp;<a
          class="underline cursor-pointer underline-offset-[4px] font-[500]"
          href="https://t.me/ArcanaNetwork"
          target="blank"
          rel="noopener"
          >Need help?</a
        >
      </div>
      <button class="absolute right-4" @click.stop="isBannerClosed = true">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
    </div>
    <LandingHeader />
    <LandingHero />
    <LandingNumbers />
    <LandingHowDoesItWork />
    <LandingSenditTagline />
    <LandingWhySendit />
    <LandingEarnXP />
    <LandingGetOnWeb3 />
    <LandingFAQ />
    <LandingFooter />
  </div>
</template>
