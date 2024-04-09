<template>
  <div class="landing-container mt-[4rem] md:mt-[12rem]" id="earn-xp">
    <div class="flex justify-center">
      <h3 class="max-md:hidden flex">
        <div class="relative">
          <span class="earn-section-title"><span class="font-bold-onest">Earn XP&nbsp;</span></span>
          <img src="@/assets/images/landing/faq-underlined.webp" class="absolute top-full pt-3" />
        </div>
        <span class="earn-section-title">for Using SendIt</span>
      </h3>
      <h3 class="earn-section-title md:hidden">
        <span class="text-[#fd7132]">Earn XP</span>
      </h3>
    </div>
    <div class="flex max-md:flex-col-reverse items-center">
      <div class="flex flex-col gap-4 mt-5 md:mt-[-5rem] ">
        <h4 class="text-[1rem] md:text-[1.5rem] md:ml-5 lg:text-[2rem] max-md:text-center">
          Convenience, and Rewards!
        </h4>
        <p class="faq-section-description md:ml-5 max-w-[500px] md:text-[1rem] lg:text-[1.5rem] max-md:text-center">
          Your ultimate solution for hassle-free crypto transfers. Earn points
          with every transaction while contributing to crypto's mainstream
          adoption. Share SendIt with friends on socials for even more points.
          Win weekly leaderboard challenges for a big airdrops! Also, tune into
          our socials for updates on rewards that will melt faces! 🤑🤑🤑
        </p>
      </div>
      <img src="@/assets/images/landing/earn-xp-horse-300w.webp" srcset="
          @/assets/images/landing/earn-xp-horse-300w.webp 300w,
          @/assets/images/landing/earn-xp-horse-836w.webp 836w
        " sizes="(max-width: 767px) 300px, 836px" loading="lazy" alt="Earn XP for using SendIt"
        class="md:-mr-[20px]" />
    </div>
  </div>
</template>
