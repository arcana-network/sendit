<script setup lang="ts">
import Overlay from "@/components/overlay.vue";
import useArcanaAuth from "@/use/arcanaAuth";
import { addUserToWaitlist } from "@/services/waitlist.service";
import { computed, onMounted, ref } from "vue";
import useLoaderStore from "@/stores/loader";
import { normaliseEmail } from "@/utils/normalise";
import { useToast } from "vue-toastification";

const loaderStore = useLoaderStore();
const email = ref("");
const toast = useToast();

function showWallet() {
  const arcanaAuth = useArcanaAuth();
  arcanaAuth.getAuthInstance().showWallet();
}

onMounted(() => {
  setTimeout(showWallet, 1000);
});

const disableSubmit = computed(() => {
  return !email.value.trim();
});

async function handleUserSubmission() {
  try {
    loaderStore.showLoader("Adding to waitlist...");
    const isSubmitted = await addUserToWaitlist(
      normaliseEmail(email.value),
      ""
    );
    if (!isSubmitted) toast.error("Cannot add to waitlist. Please try again.");
  } catch (e) {
    toast.error("Email already added in waitlist");
  } finally {
    loaderStore.hideLoader();
  }
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[500px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col justify-center items-center gap-4">
          <img
            src="@/assets/images/icons/check-mark-success.svg"
            alt="success"
            class="w-[50px] aspect-square"
          />
          <span class="font-[500] text-4xl">Cha-ching!</span>
          <span class="text-2xl">You’ve got crypto!</span>
          <span class="text-xl text-philippine-gray text-center">
            The balance in your wallet has been updated. Loved how simple it was
            to receive crypto? Join the waitlist to access SendIt below.
          </span>
        </div>
        <form class="flex flex-col space-y-1.5 w-full rounded-md">
          <label for="email-waitlist" class="text-xs"
            >Email ID for Waitlist</label
          >
          <div class="w-full rounded-md flex bg-dark-charcoal px-2">
            <input
              type="email"
              class="flex-1 bg-transparent input text-lg text-white"
              placeholder="you@gmail.com"
              v-model.trim="email"
            />
            <button
              class="flex items-center justify-center"
              :disabled="disableSubmit"
              :class="{
                'cursor-not-allowed': disableSubmit,
                'cursor-pointer': !disableSubmit,
                'opacity-50': disableSubmit,
              }"
              @click.prevent="handleUserSubmission"
            >
              <img
                src="@/assets/images/icons/arrow-right.svg"
                alt="email login"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  </Overlay>
</template>
