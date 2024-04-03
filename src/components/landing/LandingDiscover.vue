<template>
  <div id="how-does-it-work">
    <div class="flex flex-col md:flex-row md:flex-nowrap md:justify-center md:items-center mt-[10%]">
      <div class="w-full md:w-1/2 flex flex-col gap-1 md:gap-4 md:pl-[250px] md:mt-[-5rem] items-center md:items-start">
        <h3 class="landing-section-title md:pb-5">Discover How</h3>
        <h3 class="getonweb3-section-title">SendIt
          <span>
            Works
            <img src="@/assets/images/landing/how-does-it-work-vector-underline.svg"
              class="md:w-[150px] max-md:w-[47px] absolute left-[500px] hide-below-768" />
          </span>
        </h3>
        <br />
        <p class="faq-section-description max-w-[500px] px-2 md:px-0 max-md:text-center">Discover the straightforward process of
          sending cryptocurrency via email with SendIt.</p>
        <br />
        <a class="text-[0.75rem] text-black leading-[1rem] uppercase font-500 rounded-[25px] w-[150px] md:w-[150px] md:rounded-[25px] px-2 py-1 md:px-4 md:py-3 cursor-pointer bg-white  transition-colors duration-200 ease-in-out disabled:cursor-not-allowed text-center hide-below-768"
          href="/app">
          <strong>Explore Now</strong>
        </a>
      </div>
      <div class="mt-8 md:mt-0">
        <img src="@/assets/gifs/Discover.gif" style="width: 100%; height: auto;" />
      </div>
    </div>
  </div>
  <img class="absolute z-[-1] top-[165%] -left-[30px] h-[300px] max-md:hidden go-to-linear-animation"
    src="@/assets/images/landing/cloud-how.png" loading="lazy" />
  <div class="flex justify-center">
    <a class="text-[0.75rem] text-black leading-[1rem] uppercase font-500 rounded-[25px] w-[150px] px-5 py-5 cursor-pointer bg-white  transition-colors duration-200 ease-in-out disabled:cursor-not-allowed text-center hide-above-768"
      href="/app">
      <strong>Explore Now</strong>
    </a>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .hide-below-768 {
    display: none;
  }
}
@media (min-width: 767px) {
  .hide-above-768 {
    display: none;
  }
}
</style>