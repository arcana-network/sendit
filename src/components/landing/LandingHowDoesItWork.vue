<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const currentSlide = ref(1);
const totalSlides = 4;
let carouselTimer: NodeJS.Timer;
const carouselInterval = 3000;

function nextSlide() {
  if (currentSlide.value < totalSlides) {
    currentSlide.value += 1;
  } else {
    currentSlide.value = 1;
  }
}

function startAutoCarousel() {
  carouselTimer = setInterval(() => {
    nextSlide();
  }, carouselInterval);
}

function stopAutoCarousel() {
  clearInterval(carouselTimer);
}

onMounted(() => {
  window.matchMedia("(max-width: 767px)").addEventListener("change", (e) => {
    if (e.matches) {
      currentSlide.value = 1;
      startAutoCarousel();
    } else {
      stopAutoCarousel();
    }
  });
});

onBeforeUnmount(() => {
  stopAutoCarousel();
  window
    .matchMedia("(max-width: 767px)")
    .removeEventListener("change", () => {});
});
</script>

<template>
  <div id="how-does-it-work">
    <div class="landing-container flex flex-col gap-4 md:gap-6">
      <div class="flex justify-center">
        <h3 class="flex">
          <span class="landing-section-title uppercase">How does it&nbsp;</span>
          <div class="flex flex-col">
            <span class="landing-section-title uppercase">work?</span>
            <img
              src="@/assets/images/landing/how-does-it-work-vector-underline.svg"
              class="max-md:w-[87px]"
            />
          </div>
        </h3>
      </div>
      <div class="flex gap-[2.88rem] max-md:justify-center">
        <img
          src="@/assets/images/landing/how-does-it-work-1.svg"
          loading="lazy"
          class="max-md:transition-all max-md:duration-500 max-md:ease-in-out"
          :class="{
            'max-md:hidden max-md:opacity-0': currentSlide !== 1,
            'max-md:opacity-100': currentSlide === 1,
          }"
          width="250"
          height="326"
          alt="Step 1 - Login with email or connect your wallet."
        />
        <img
          src="@/assets/images/landing/how-does-it-work-2.svg"
          loading="lazy"
          class="max-md:transition-all max-md:duration-500 max-md:ease-in-out"
          :class="{
            'max-md:hidden max-md:opacity-0': currentSlide !== 2,
            'max-md:opacity-100': currentSlide === 2,
          }"
          width="250"
          height="326"
          alt="Step 2 - Enter an amount and add the receiver’s email or Twitter handle to generate a link."
        />
        <img
          src="@/assets/images/landing/how-does-it-work-3.svg"
          loading="lazy"
          :class="{
            'max-md:hidden max-md:opacity-0': currentSlide !== 3,
            'max-md:opacity-100': currentSlide === 3,
          }"
          width="250"
          height="326"
          alt="Step 3 - Share the SendIt link on the recipient’s email ID."
        />
        <img
          src="@/assets/images/landing/how-does-it-work-4.svg"
          loading="lazy"
          :class="{
            'max-md:hidden max-md:opacity-0': currentSlide !== 4,
            'max-md:opacity-100': currentSlide === 4,
          }"
          width="250"
          height="326"
          alt="Step 4 - The receiver gets the assets in a readymade wallet linked to their Email or Twitter ID."
        />
      </div>
      <div class="md:hidden flex gap-4 justify-center">
        <button
          v-for="i in 4"
          :key="`slide-${i}`"
          class="rounded-full"
          :class="{
            'bg-[#8d8d8d] w-[8px] h-[8px]': currentSlide !== i,
            'bg-[#f7f7f7] w-[10px] h-[10px]': currentSlide === i,
          }"
          @click.stop="currentSlide = i"
        ></button>
      </div>
    </div>
  </div>
</template>
