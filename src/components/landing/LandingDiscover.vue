<script setup lang="ts">

</script>

<template>
  <div id="how-does-it-work"
    class="landing-container flex max-md:flex-col-reverse md:flex-row mt-[4rem] md:mt-[7rem] md:items-center">
    <div class="flex flex-col gap-4 mt-[-5rem]">
      <h3 class="landing-section-title pb-5">Discover How</h3>
      <h3 class="getonweb3-section-title">SendIt
        <span>
          Works
          <img src="@/assets/images/landing/how-does-it-work-vector-underline.svg"
            class="md:w-[150px] max-md:w-[47px] absolute left-[400px]" />
        </span>
      </h3>
      <br />
      <p class="faq-section-description max-w-[500px] max-md:text-center">Discover the straightforward process of
        sending cryptocurrency via email with SendIt.</p>
      <br />
      <a class="text-[0.75rem] text-black leading-[1rem] uppercase font-500 rounded-[25px] md:w-[150px] md:rounded-[25px] px-2 py-1 md:px-4 md:py-3 cursor-pointer bg-white  transition-colors duration-200 ease-in-out disabled:cursor-not-allowed text-center"
        href="/app">
        <strong>Explore Now</strong>
      </a>
    </div>
    <div class="flex justify-center">
      <img src="@/assets/gifs/Discover.gif" style="width: 900px; height: 825px;" />
    </div>

  </div>
  <img class="absolute z-[-1] top-[165%] -left-[30px] h-[300px] max-md:hidden"
    src="@/assets/images/landing/cloud-how.png" loading="lazy" />
</template>
