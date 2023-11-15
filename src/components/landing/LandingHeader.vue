<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const hasScrolledHeaderHeight = ref(false);
const router = useRouter();
const domReady = ref(false);

onMounted(() => {
  document
    .querySelector("#landing-page")
    ?.addEventListener("scroll", (ev: any) => {
      hasScrolledHeaderHeight.value = ev.target?.scrollTop > 63;
    });
  domReady.value = document.readyState === "complete";
  const domReadyInterval = setInterval(() => {
    domReady.value = document.readyState === "complete";
    if (domReady.value) {
      clearInterval(domReadyInterval);
    }
  }, 100);
});

onBeforeUnmount(() => {
  document
    .querySelector("#landing-page")
    ?.removeEventListener("scroll", (ev: any) => {
      hasScrolledHeaderHeight.value = ev.target?.scrollTop > 63;
    });
});
</script>

<template>
  <header
    class="sticky top-0 py-4 z-[1000] transition-all duration-[500ms] ease-in-out"
    :class="{
      'bg-[#0E0E0E]': hasScrolledHeaderHeight,
      'bg-transparent': !hasScrolledHeaderHeight,
    }"
  >
    <div class="landing-container relative">
      <div class="flex">
        <a href="/" class="flex">
          <img
            alt="SendIt"
            src="@/assets/images/landing/sendit-logomark-30w.png"
            srcset="
              @/assets/images/landing/sendit-logomark-30w.png 30w,
              @/assets/images/landing/sendit-logomark-49w.png 49w
            "
            sizes="(max-width: 767px) 30px, 49px"
          />
          <img src="@/assets/images/landing/SendIt-text.svg" alt="SendIt" />
        </a>
      </div>
      <div
        class="absolute z-[10] right-[1.25rem] top-0 bottom-0 flex items-center gap-4"
      >
        <button
          class="text-[0.75rem] leading-[1.125rem] uppercase font-500 border-[#363636] border border-solid rounded-[5px] md:rounded-[10px] px-4 py-2 md:px-6 md:py-3 cursor-pointer hover:bg-[#363636] hover:text-white transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="router.push({ name: 'App' })"
          :disabled="!domReady"
        >
          Launch App
        </button>
        <a
          class="max-md:hidden"
          href="https://www.producthunt.com/posts/sendit-3?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sendit&#0045;3"
          target="_blank"
          ><img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=411941&theme=dark"
            alt="SendIT - Send&#0032;crypto&#0032;using&#0032;email&#0032;or&#0032;social&#0032;handles | Product Hunt"
            style="width: 200px; height: 54px"
            width="200"
            height="54"
        /></a>
      </div>
    </div>
  </header>
</template>
