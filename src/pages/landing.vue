<script setup lang="ts">
import { defineAsyncComponent } from "vue";
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
</script>

<template>
  <div class="bg-[#0E0E0E]">
    <LandingHeader />
    <LandingHero />
    <LandingNumbers />
    <LandingWhySendit />
    <LandingSenditTagline />
    <LandingHowDoesItWork />
    <LandingEarnXP />
    <LandingGetOnWeb3 />
    <LandingFAQ />
    <LandingFooter />
  </div>
</template>
