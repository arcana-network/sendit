<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

const faqs = [
  {
    index: "question-1",
    question: "How can the receiver claim their crypto?",
    answer: `When you receive crypto via SendIt, you'll get an email with a claim link. Click it and prove your ownership of the email through "Google Sign-in" or passwordless authentication. Once verified, you can access the received crypto in your non-custodial SendIt wallet at the bottom-right of the interface. Transfer the crypto tokens to any other wallet you prefer.`,
  },
  {
    index: "question-2",
    question: "Who can I send crypto to using SendIt?",
    answer: `You can send crypto to anyone with an email address. If it's their first time receiving crypto on SendIt, we'll generate a non-custodial wallet for them. Only the email owner can access the wallet. We also support sending crypto to Twitter handles and plan to add more channels in the future.`,
  },
  {
    index: "question-3",
    question: "Are any fees applicable to sending crypto over SendIt?",
    answer: `When you send crypto using blockchain networks, gas fees apply for the transfer. SendIt doesn't charge extra fees on top of these gas fees.`,
  },
  {
    index: "question-4",
    question: "What happens if I send crypto to the wrong email address?",
    answer: `As with blockchain transfers, the same rules apply on SendIt. Sending crypto to an incorrect email address means the crypto is lost. Please be careful when entering email addresses in SendIt, as we can't undo or retrieve any transfers made.`,
  },
  {
    index: "question-5",
    question: "What are some other things that I can do with SendIt?",
    answer: `We believe in a decentralized internet. SendIt simplifies using technologies like blockchains and crypto wallets. Earn experience points (XP) by spreading the word about SendIt and helping us reach more users and bring them to Web3. XP can lead to weekly and monthly prizes and even future airdrops. So get involved, spread the word, and get rewarded!`,
  },
];
</script>

<template>
  <div class="mt-[6rem] md:mt-[12rem]">
    <div class="landing-container">
      <h3 class="flex">

        <div class="relative">
          <span class="faq-section-title relative"><span class="font-bold">Frequently&nbsp;</span></span>
          <img src="@/assets/images/landing/faq-underlined.svg" class="max-md:w-[96px]" />
        </div>
        <span class="faq-section-title">Asked Questions</span>
      </h3>
      <div class="flex flex-col">
        <Disclosure v-for="faq in faqs" :key="faq.index" class="border-b border-b-solid border-b-[#8d8d8d]" as="div"
          v-slot="{ open }">
          <DisclosureButton
            class="faq-section-description py-[1.4rem] flex justify-between items-center w-full gap-4"
            style="color: white">
            <span class="text-start">{{ faq.question }}</span>
            <img v-if="open" src="@/assets/images/landing/minus-icon.svg" class="max-md:w-4 max-md:h-4" />
            <img v-else src="@/assets/images/landing/plus-icon.svg" class="max-md:w-4 max-md:h-4" />
          </DisclosureButton>
          <DisclosurePanel class="faq-section-description pb-[1.4rem] pr-[1.4rem] max-w-[950px]">
            {{ faq.answer }}
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" v-slot="{ open }">
          <DisclosureButton
            class="faq-section-description py-[1.4rem] flex justify-between items-center w-full gap-4"
            style="color: white">
            <span class="text-start">Need more support?</span>
            <img v-if="open" src="@/assets/images/landing/minus-icon.svg" class="max-md:w-4 max-md:h-4" />
            <img v-else src="@/assets/images/landing/plus-icon.svg" class="max-md:w-4 max-md:h-4" />
          </DisclosureButton>
          <DisclosurePanel class="faq-section-description pb-[1.4rem] pr-[1.4rem] max-w-[950px]">
            Reach out to us via
            <a href="https://discord.gg/6g7fQvEpdy" target="_blank" class="font-bold text-white">Discord</a>,
            <a href="https://t.me/ArcanaNetwork" target="_blank" class="font-bold text-white">Telegram</a>, or
            <a href="mailto:support@arcana.network" target="_blank" class="font-bold text-white">Mail</a>.
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  </div>
</template>
