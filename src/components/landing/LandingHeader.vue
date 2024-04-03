<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const hasScrolledHeaderHeight = ref(false);

onMounted(() => {
  document
    .querySelector("#landing-page")
    ?.addEventListener("scroll", (ev: any) => {
      hasScrolledHeaderHeight.value = ev.target?.scrollTop > 63;
    });
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
  <header class="mt-8 z-[1000] transition-all duration-[500ms] ease-in-out bg-transparent">
    <div class="landing-container relative">
      <div class="flex">
        <a href="/" class="flex gap-2 z-1000">
          <img alt="SendIt" src="@/assets/images/landing/sendit-logomark-30w.png" srcset="
              @/assets/images/landing/sendit-logomark-30w.png 30w,
              @/assets/images/landing/sendit-logomark-49w.png 49w
            " sizes="(max-width: 767px) 30px, 49px" />
          <img src="@/assets/images/landing/SendIt-text.svg" alt="SendIt" />
        </a>
      </div>
      <div class="absolute z-[1000] right-[1.25rem] top-0 bottom-0 flex items-center gap-4">
        <a class="text-[1.5rem] md:text-[0.75rem] leading-[1rem] uppercase font-500 rounded-[25px] md:rounded-[25px] px-5 py-5 md:px-4 md:py-3 cursor-pointer bg-[rgb(54,54,54)]/70 hover:scale-105 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          href="/app">
          Launch App
        </a>
        <a class="max-md:hidden rounded-3xl"
          href="https://www.producthunt.com/posts/sendit-3?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sendit&#0045;3"
          target="_blank" style="width: 200px; height: 50px; padding: 5px;" width="200" height="40" padding="5"><img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=411941&theme=dark"
            alt="SendIT - Send&#0032;crypto&#0032;using&#0032;email&#0032;or&#0032;social&#0032;handles | Product Hunt"
            class="rounded-3xl" /></a>
        <!-- <a class="max-md:hidden rounded-3xl bg-white"
          href="https://www.producthunt.com/posts/sendit-3?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sendit&#0045;3"
          target="_blank" style="width: 200px; height: 40px; padding: 10px;" width="200" height="40" padding="30"
          border-radius="30px"></a> -->
      </div>
    </div>
  </header>
</template>
