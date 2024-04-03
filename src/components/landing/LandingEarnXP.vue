<template>
  <div class="landing-container mt-[4rem] md:mt-[12rem]" id="earn-xp">
    <div class="flex justify-center">
      <h3 class="max-md:hidden flex">
        <div class="relative">
          <span class="earn-section-title"><span class="font-bold">Earn XP&nbsp;</span></span>
          <img src="@/assets/images/landing/faq-underlined.svg" class="absolute top-full pt-3" />
        </div>
        <span class="earn-section-title">for Using SendIt</span>
      </h3>
      <h3 class="earn-section-title md:hidden">
        Earn XP <span style="color: #fd7132">!</span>
      </h3>
    </div>
    <div class="flex max-md:flex-col-reverse items-center">
      <div class="flex flex-col gap-4 mt-5 md:mt-[-5rem] ">
        <h4 class="text-[1rem] md:text-[2rem] max-md:text-center">
          Convenience, and Rewards!
        </h4>
        <p class="faq-section-description max-w-[500px] max-md:text-center">
          Your ultimate solution for hassle-free crypto transfers. Earn points
          with every transaction while contributing to crypto's mainstream
          adoption. Share SendIt with friends on socials for even more points.
          Win weekly leaderboard challenges for a big airdrops! Also, tune into
          our socials for updates on rewards that will melt faces! 🤑🤑🤑
        </p>
      </div>
      <img src="@/assets/images/landing/earn-xp-horse-300w.png" srcset="
          @/assets/images/landing/earn-xp-horse-300w.png 300w,
          @/assets/images/landing/earn-xp-horse-836w.png 836w
        " sizes="(max-width: 767px) 300px, 836px" loading="lazy" alt="Earn XP for using SendIt"
        class="md:-mr-[180px]" />
    </div>
  </div>
</template>
