<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import { computed, ref } from "vue";
import { isValidEmail } from "@/utils/validation";
import { composeAndSendTweet } from "@/utils/tweet";
import { addUserToLaunchList } from "@/services/launchlist.service";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";

const hasStartedTyping = ref(false);
const email = ref("");
const submissionSuccess = ref(false);
const serverError = ref(false);
const loaderStore = useLoaderStore();
const toast = useToast();

const error = computed(() => {
  if (hasStartedTyping.value) {
    if (!email.value.trim()) {
      return {
        value: true,
        message: "Email address is required",
      };
    } else if (!isValidEmail(email.value)) {
      return {
        value: true,
        message: "Enter valid email address",
      };
    }
  }
  if (serverError.value) {
    return {
      value: true,
      message: "Something went wrong. Please try again",
    };
  }
  return {
    value: false,
    message: "",
  };
});

async function handleUserSubmission() {
  try {
    loaderStore.showLoader("Adding to waitlist...");
    await addUserToLaunchList({ email: email.value });
    submissionSuccess.value = true;
  } catch (e) {
    serverError.value = true;
    toast.error("Cannot add to waitlist. Please try again.");
    console.log(error.value);
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

const tweetMessage = `Just secured my spot on the #SendIt waitlist! Excited to discover what this product has to offer. Make sure to claim yours too at https://sendit.arcana.network!`;
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader hide-nav />
    <div class="waitlist-page flex-grow flex flex-col">
      <main class="flex-grow flex justify-center items-center p-4">
        <div
          v-if="!submissionSuccess"
          class="card bg-eerie-black border-1 border-jet rounded-[10px] max-w-[400px] flex flex-col py-8 px-4 items-center"
        >
          <div class="flex flex-col gap-1 items-center">
            <span class="font-bold text-[1.5rem]">Get Ready to SendIt!</span>
            <span>Join the Waitlist</span>
          </div>
          <span
            class="text-philippine-gray text-[0.875rem] text-center mt-10 mb-6"
            >Experience SendIt, the revolutionary app that simplifies crypto
            transactions using email, Twitter, and Github. Sign up now to be
            among the first to use it!</span
          >
          <form
            class="w-full flex flex-col pb-8"
            @submit.prevent="handleUserSubmission"
          >
            <div
              class="flex items-center flex-grow p-[1px] border-1 rounded-[5px]"
              :class="{
                'border-white': !error.value,
                'border-[#ff4264]': error.value,
              }"
            >
              <input
                v-model.trim="email"
                class="bg-transparent text-[12px] placeholder:text-[#787878] flex-grow px-3 py-2 outline-none"
                placeholder="Email address"
                @input="handleInput"
              />
              <button
                class="bg-[#f7f7f7] text-[#101010] uppercase font-bold text-[0.75rem] px-5 py-2 rounded-[5px] disabled:opacity-60"
                :disabled="error.value || !hasStartedTyping"
              >
                Sign me up!
              </button>
            </div>
            <div class="px-3">
              <span v-if="error.value" class="text-[10px] text-[#ff4264]">{{
                error.message
              }}</span>
              <span v-else class="text-[10px]">No spam. We promise</span>
            </div>
          </form>
        </div>
        <div
          v-else
          class="bg-eerie-black border-1 border-jet rounded-[10px] max-w-[400px] flex flex-col items-center py-8 px-4"
        >
          <img
            src="@/assets/images/icons/waitlist-check.svg"
            class="h-12 w-12"
          />
          <span class="font-bold text-[1.5rem]">You're On!</span>
          <span
            class="text-philippine-gray text-[0.875rem] text-center mt-4 mb-8"
            >Give us a shoutout on Twitter and help spread the love!</span
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
        <a href="https://twitter.com/arcana_network" target="_blank">
          <img
            src="@/assets/images/footer-icons/twitter.svg"
            alt="Twitter"
            title="Follow Arcana on Twitter"
          />
        </a>
        <a href="https://twitter.com/arcana_network" target="_blank">
          <img
            src="@/assets/images/footer-icons/telegram.svg"
            alt="Twitter"
            title="Join Arcana on Telegram"
          />
        </a>
        <a href="https://twitter.com/arcana_network" target="_blank">
          <img
            src="@/assets/images/footer-icons/discord.svg"
            alt="Twitter"
            title="Join Arcana on Discord"
          />
        </a>
        <a href="https://twitter.com/arcana_network" target="_blank">
          <img
            src="@/assets/images/footer-icons/youtube.svg"
            alt="Youtube"
            title="Subscribe to Arcana Network on Youtube"
          />
        </a>
      </footer>
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
