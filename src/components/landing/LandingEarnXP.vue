<template>
  <div class="landing-container mt-[4rem] md:mt-[12rem]" id="earn-xp">
    <div class="flex justify-center">
      <h3 class="max-md:hidden flex">
        <div class="relative">
          <img
            src="@/assets/images/landing/earn-xp-vector-pointer.svg"
            class="absolute bottom-full"
          />
          <span class="landing-section-title uppercase">Earn XP&nbsp;</span>
        </div>
        <span class="landing-section-title uppercase">for Using SendIt</span>
      </h3>
      <h3 class="landing-section-title uppercase md:hidden">
        Earn XP <span style="color: #fd7132">!</span>
      </h3>
    </div>
    <div class="flex max-md:flex-col-reverse md:items-center">
      <div class="flex flex-col gap-4">
        <h4 class="text-[1rem] md:text-[2rem] max-md:text-center">
          Convenience, and Rewards!
        </h4>
        <p class="landing-section-description max-w-[500px] max-md:text-center">
          Your ultimate solution for hassle-free crypto transfers. Earn points
          with every transaction while contributing to crypto's mainstream
          adoption. Share SendIt with friends on socials for even more points.
          Win fortnightly leaderboard challenges for a big airdrops! Also, tune
          into our socials for updates on rewards that will melt faces! 🤑🤑🤑
        </p>
        <div class="flex gap-4 max-md:justify-center">
          <a href="https://twitter.com/arcananetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/twitter.svg"
              alt="Follow Arcana Network on Twitter"
              loading="lazy"
          /></a>
          <a href="https://t.me/ArcanaNetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/telegram.svg"
              alt="Join Arcana Network on Telegram"
              loading="lazy"
          /></a>
          <a href="https://discord.gg/6g7fQvEpdy" target="_blank"
            ><img
              src="@/assets/images/landing/icons/discord.svg"
              alt="Join Arcana Network on Discord"
              loading="lazy"
          /></a>
          <a href="https://www.youtube.com/@ArcanaNetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/youtube.svg"
              alt="Subscribe to Arcana Network on YouTube"
              loading="lazy"
          /></a>
        </div>
      </div>
      <img
        src="@/assets/images/landing/earn-xp-horse-300w.png"
        srcset="
          @/assets/images/landing/earn-xp-horse-300w.png 300w,
          @/assets/images/landing/earn-xp-horse-836w.png 836w
        "
        sizes="(max-width: 767px) 300px, 836px"
        loading="lazy"
        alt="Earn XP for using SendIt"
        class="md:-mr-[180px]"
      />
    </div>
  </div>
</template>
