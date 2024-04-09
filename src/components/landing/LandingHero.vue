<script setup lang="ts">
import useArcanaAuth from "@/use/arcanaAuth";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import useLoaderStore from "@/stores/loader";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { normaliseEmail } from "@/utils/normalise";
import useAuthStore from "@/stores/auth";
import { isValidEmail } from "@/utils/validation";

const auth = useArcanaAuth();
const toast = useToast();
const email = ref("");
const loaderStore = useLoaderStore();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  await auth.init();
  authStore.setAuthInitialized(true);
});

async function handlePasswordlessLogin() {
  if (!isValidEmail(email.value)) {
    toast.error("Please enter a valid email address");
    return;
  }
  const normalisedEmail = normaliseEmail(email.value);
  if (await auth.isLoggedIn()) {
    toast.error(
      "You are already signed in through Arcana wallet, please launch the app."
    );
    return;
  }
  loaderStore.showLoader(
    `Please click on the verification link sent to ${email.value}`
  );
  await auth.getAuthInstance().loginWithLink(normalisedEmail);
  await router.push({ name: "App", query: { "try-it-out": "1" } });
  loaderStore.hideLoader();
}
</script>

<template>
  <div class="relative -mt-[100px] md:-mt-[100px]">
    <div
      class="landing-container absolute z-[10] md:-top-[120px] 2xl:-top-[160px] h-full max-h-screen w-full flex flex-col justify-center items-center left-1/2 transform -translate-x-1/2">

      <h1 class="syne landing-section-title md:mt-10 max-md:max-w-[200px] 2xl:text-[4.75rem] text-center">
        Send Crypto <span class="font-one font-bold-onest">Over Email</span>
      </h1>
      <p class="landing-section-subtitle max-w-[800px] text-center max-md:mt-5 md:mt-10 2xl:text-[1.5rem]">
        This is the simplest way to send crypto to anyone even if they don’t
        have a wallet. Don’t believe us? Try it for yourself for free!
      </p>
      <form
        class="relative flex gap-2 md:gap-4 md:border border border-solid border-[#8d8d8d] md:border-solid md:border-[#8d8d8d] md:bg-transparent rounded-[25px] md:p-1 md:rounded-[25px] max-md:mt-5 md:mt-10"
        @submit.prevent="handlePasswordlessLogin">
        <input placeholder="someone@example.com"
          class="bg-transparent md:bg-transparent max-md:rounded-[5px] h-[40px] px-3 w-[200px] md:w-[300px] text-[12px] md:text-[16px] text-white placeholder:text-[#8d8d8d] outline-none"
          v-model.trim="email" />
        <div class="relative flex items-center justify-center w-[80px] md:w-[120px] h-[40px]">
          <button
            class="font-[500] text-[12px] uppercase w-[80px] md:w-[120px] flex items-center justify-center h-[40px] bg-white rounded-[25px] md:rounded-[25px] text-[#3b3b3b]"
            :disabled="loaderStore.show">
            Sign Up!
          </button>
          <img class="absolute top-[125%] md:top-[130%] left-0 h-[50px] md:h-[50px]"
            src="@/assets/images/landing/try-it-out-vector-pointer.svg" />
          <span
            class="font-caveat text-[1.5rem] md:text-[2.25rem] absolute w-max top-[200%] md:top-[175%] -left-[250%] md:-left-[250%]">Sign-up
            now, get 50XP!</span>
        </div>
      </form>
    </div>
    <div class="relative -z-[1] ">
      <img src="@/assets/images/landing/hero-bg-top.webp" class="absolute top-0 right-0 z-[6] w-full" />
      <img src="@/assets/images/landing/planet1.webp"
        class="absolute z-[6] -left-20 md:-left-10 lg:-left-10 top-10 h-[200px] sm:h-[200px] md:h-[200px] lg:h-[270px] xl:h-[350px] bg-blend-darken go-to-linear-animation" />
      <img src="@/assets/images/landing/planet-cloud-right.webp"
        class="absolute z-[5] right-[430px] -top-10 md:-top-5 md:h-[10px] lg:h-[150px] xl:h-[200px] bg-blend-darken go-to-linear-animation2" />
      <img src="@/assets/images/landing/planet2.webp"
        class="absolute z-[3] right-0 bottom-[300px] md:bottom-[225px] h-[150px] md:h-[200px] lg:h-[225px] xl:h-[275px] opacity-70 bg-blend-darken go-to-linear-animation" />
      <div class="h-[456px] absolute top-0 left-0 right-0 z-[4] bg-gradient-to-b from-black via-black to-transparent">
      </div>
      <img src="@/assets/images/landing/here-sendit-375.webp"
        class="md:hidden relative top-0 left-0 right-0 h-[812px] md:h-[1059px] object-cover object-center w-full z-[2]" />
      <img src="@/assets/images/landing/hero-sendit-1440.webp"
        class="max-md:hidden relative top-0 left-0 right-0 h-[915px] md:h-[1025px] 2xl:h-[1200px] object-cover object-center w-full z-[2]" />
      <!-- <img src="@/assets/images/landing/bg-bottom.png" class="absolute -bottom-[10px] z-[5]" /> -->
    </div>
  </div>
</template>