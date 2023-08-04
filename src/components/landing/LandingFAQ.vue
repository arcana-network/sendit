<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

const faqs = [
  {
    index: "question-1",
    question: "How can the receiver claim their crypto?",
    answer: `When you receive crypto via SendIt, you'll get an email with a claim link. Click it and prove your ownership of the email through "Google Sign-in" or passwordless authentication. Once verified, you can access the received crypto in your self-custodial SendIt wallet at the bottom-right of the interface. Transfer the crypto tokens to any other wallet you prefer.`,
  },
  {
    index: "question-2",
    question: "Who can I send crypto to using SendIt?",
    answer: `You can send crypto to anyone with an email address. If it's their first time receiving crypto on SendIt, we'll generate a self-custodial wallet for them. Only the email owner can access the wallet. We also support sending crypto to Twitter handles and plan to add more channels in the future.`,
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
  <div>
    <div class="landing-container">
      <h3 class="flex">
        <div class="relative">
          <span
            class="font-caveat absolute -top-[100%] left-1/2 transform transform -translate-x-1/2 text-[1.25rem] md:text-[2rem]"
            >Constantly</span
          >
          <img
            class="absolute top-[35%]"
            src="@/assets/images/landing/faq-vector-strikethrough.svg"
          />
          <span class="landing-section-title">Frequently</span>
        </div>
        <span class="landing-section-title">&nbsp;Asked Questions</span>
      </h3>
      <div class="flex flex-col">
        <Disclosure
          v-for="faq in faqs"
          :key="faq.index"
          class="border-b border-b-solid border-b-[#8d8d8d]"
          as="div"
        >
          <DisclosureButton
            class="landing-section-description py-[1.4rem] flex justify-between"
            style="color: white"
          >
            <span>{{ faq.question }}</span>
          </DisclosureButton>
          <DisclosurePanel class="landing-section-description pb-[1.4rem]">
            {{ faq.answer }}
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" class="flex justify-between">
          <DisclosureButton
            class="landing-section-description py-[1.4rem]"
            style="color: white"
          >
            <span>Need more support?</span>
          </DisclosureButton>
          <DisclosurePanel class="landing-section-description pb-[1.4rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua Mail and
            Telegram.
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  </div>
</template>
