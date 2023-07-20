<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import { computed, ref } from "vue";
import { isValidEmail } from "@/utils/validation";
import { composeAndSendTweet } from "@/utils/tweet";
import { addUserToWaitlist } from "@/services/waitlist.service";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";
import LandingDescription from "@/components/LandingDescription.vue";
import { useRoute } from "vue-router";
import { normaliseEmail } from "@/utils/normalise";
import generateSenditUrl from "@/utils/generateSenditUrl";

const hasStartedTyping = ref(false);
const email = ref("");
const address = ref("");
const submissionSuccess = ref(false);
const serverError = ref(false);
const loaderStore = useLoaderStore();
const toast = useToast();
const route = useRoute();
const community = route.query.community as string | undefined;

const error = computed(() => {
  if (hasStartedTyping.value) {
    if (!email.value.trim()) {
      return {
        value: true,
        field: "email",
        message: "Email address is required",
      };
    } else if (!isValidEmail(email.value)) {
      return {
        value: true,
        field: "email",
        message: "Enter valid email address",
      };
    }
    if (community !== undefined) {
      if (!address.value.trim()) {
        return {
          value: true,
          field: "address",
          message: "Wallet Address is required",
        };
      } else if (
        !address.value.startsWith("0x") ||
        address.value.length !== 42 ||
        !address.value.substring(2).match(/^[0-9a-fA-F]+$/)
      ) {
        return {
          value: true,
          field: "address",
          message: "Enter valid wallet address",
        };
      }
    }
  }
  if (serverError.value) {
    return {
      value: true,
      field: "server",
      message:
        community === undefined
          ? "Email already added in waitlist"
          : "Email or address already added in waitlist",
    };
  }
  return {
    value: false,
  };
});

async function handleUserSubmission() {
  try {
    loaderStore.showLoader("Adding to waitlist...");
    const isSubmitted = await addUserToWaitlist(
      normaliseEmail(email.value),
      address.value,
      community
    );
    if (!isSubmitted)
      throw new Error("Cannot add to waitlist. Please try again.");
    submissionSuccess.value = true;
  } catch (e) {
    serverError.value = true;
    if (community !== undefined) {
      toast.error("Email or address already added in waitlist");
    } else {
      toast.error("Email already added in waitlist");
    }
  } finally {
    loaderStore.hideLoader();
  }
}

function handleInput() {
  if (!hasStartedTyping.value) {
    hasStartedTyping.value = true;
  }
  if (serverError.value) {
    serverError.value = false;
  }
}

const tweetMessage = `Just secured my spot on the #SendIt waitlist! Excited to discover what this product has to offer. Make sure to claim yours too at ${generateSenditUrl()}!`;
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader hide-nav hide-user-data />
    <div
      class="flex h-full justify-center items-center container flex-grow max-lg:flex-col max-lg:gap-12 p-4 max-lg:py-12"
    >
      <div class="flex-grow flex flex-col w-full lg:w-1/2">
        <main class="flex-grow flex justify-center items-center p-4">
          <div
            v-if="!submissionSuccess"
            class="max-w-[400px] flex flex-col py-8 px-4 items-center"
          >
            <div class="flex flex-col gap-1 items-center">
              <span class="text-[1.5rem] lg:text-[2rem] text-white font-bold"
                >Get Ready to SendIt!</span
              >
              <span>Join the Waitlist</span>
            </div>
            <span
              class="text-philippine-gray text-sm mb-6 mt-3 md:text-center md:mx-auto"
              >Experience SendIt, the revolutionary app that simplifies crypto
              transactions using email and twitter. Sign up now to be among the
              first to use it!</span
            >
            <form
              class="w-full flex flex-col pb-8"
              @submit.prevent="handleUserSubmission"
            >
              <div class="flex flex-col items-center gap-4 flex-grow p-[1px]">
                <div class="flex flex-col gap-1 w-full">
                  <label for="email" class="text-xs font-medium">Email</label>
                  <input
                    id="email"
                    v-model.trim="email"
                    class="bg-dark-charcoal w-full rounded-[5px] text-[12px] placeholder:text-[#787878] flex-grow px-3 py-2 border-1 outline-none"
                    placeholder="Enter email address"
                    :class="{
                      'border-dark-charcoal': !error.value,
                      'border-[#ff4264]':
                        error.value && error.field === 'email',
                    }"
                    @input="handleInput"
                  />
                  <div
                    class="px-3"
                    v-if="error.value && error.field === 'email'"
                  >
                    <span class="text-[10px] text-[#ff4264]">{{
                      error.message
                    }}</span>
                  </div>
                </div>
                <div
                  v-if="community !== undefined"
                  class="flex flex-col gap-1 w-full"
                >
                  <label for="address" class="text-xs font-medium"
                    >Wallet Address</label
                  >
                  <input
                    id="address"
                    v-model.trim="address"
                    class="bg-dark-charcoal w-full rounded-[5px] text-[12px] placeholder:text-[#787878] flex-grow px-3 py-2 border-1 outline-none"
                    placeholder="Enter wallet address"
                    :class="{
                      'border-dark-charcoal': !error.value,
                      'border-[#ff4264]':
                        error.value && error.field === 'address',
                    }"
                    @input="handleInput"
                  />
                  <div
                    class="px-3"
                    v-if="error.value && error.field === 'address'"
                  >
                    <span class="text-[10px] text-[#ff4264]">{{
                      error.message
                    }}</span>
                  </div>
                </div>
                <button
                  class="bg-[#f7f7f7] w-full text-[#101010] uppercase font-bold text-[0.75rem] px-5 py-2 rounded-[5px] disabled:opacity-60"
                  :disabled="error.value || !hasStartedTyping"
                >
                  Sign me up!
                </button>
              </div>
              <div class="px-3">
                <span
                  v-if="error.value && error.field === 'server'"
                  class="text-[10px] text-[#ff4264]"
                  >{{ error.message }}</span
                >
              </div>
            </form>
            <div v-if="false" class="mt-5 text-sm">
              <RouterLink :to="{ name: 'Login' }"
                >Have access? Sign In</RouterLink
              >
            </div>
          </div>
          <div
            v-else
            class="max-w-[400px] flex flex-col items-center py-8 px-4"
          >
            <img
              src="@/assets/images/icons/waitlist-check.svg"
              class="h-12 w-12"
            />
            <span class="font-bold text-[1.5rem]">Added to waitlist!</span>
            <span
              class="text-philippine-gray text-[0.875rem] text-center mt-4 mb-8"
              >You will be informed over email once you are whitelisted for
              access!</span
            >
            <button
              class="uppercase font-bold text-[12px] p-3 border-1 border-white rounded-[5px] w-full"
              @click.stop="composeAndSendTweet(tweetMessage)"
            >
              Shoutout on twitter
            </button>
          </div>
        </main>
        <footer class="flex gap-8 py-6 px-4 justify-center">
          <a href="https://twitter.com/arcananetwork" target="_blank">
            <img
              src="@/assets/images/footer-icons/twitter.svg"
              alt="Twitter"
              title="Follow Arcana on Twitter"
            />
          </a>
          <a href="https://t.me/ArcanaNetwork" target="_blank">
            <img
              src="@/assets/images/footer-icons/telegram.svg"
              alt="Twitter"
              title="Join Arcana on Telegram"
            />
          </a>
          <a href="https://discord.gg/6g7fQvEpdy" target="_blank">
            <img
              src="@/assets/images/footer-icons/discord.svg"
              alt="Twitter"
              title="Join Arcana on Discord"
            />
          </a>
          <a href="https://www.youtube.com/@ArcanaNetwork" target="_blank">
            <img
              src="@/assets/images/footer-icons/youtube.svg"
              alt="Youtube"
              title="Subscribe to Arcana Network on Youtube"
            />
          </a>
        </footer>
      </div>
      <LandingDescription class="flex-grow" />
    </div>
  </div>
</template>

<style scoped>
.waitlist-page {
  background: radial-gradient(
    50% 50% at 50% 50%,
    #262626 0%,
    rgba(14, 14, 14, 0) 100%
  );
}
</style>
