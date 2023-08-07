<template>
  <footer
    class="rounded-t-[16px] md:rounded-t-[30px] border border-solid border-[#8d8d8d50] mt-[4rem] md:mt-[8rem]"
    style="border-bottom: none; backdrop-filter: blur(50px)"
  >
    <div
      class="landing-container flex max-md:flex-col max-md:gap-2 max-md:items-center md:justify-between max-md:text-center landing-section-description w-full"
    >
      <div class="max-md:w-full flex flex-col max-md:items-center gap-2">
        <img
          alt="SendIt"
          src="@/assets/images/landing/sendit-logomark-30w.png"
          srcset="
            @/assets/images/landing/sendit-logomark-30w.png 30w,
            @/assets/images/landing/sendit-logomark-49w.png 49w
          "
          sizes="(max-width: 767px) 30px, 49px"
          class="w-max"
        />
        <span>Made with love by Arcana Network</span>
      </div>
      <nav
        class="flex justify-evenly flex-grow max-md:w-full max-md:justify-around"
      >
        <ul class="flex flex-col gap-2 text-white">
          <li><a href="#why-sendit">Why Sendit?</a></li>
          <li><a href="#how-does-it-work">How does it work?</a></li>
          <li class="max-md:hidden">
            <a href="#earn-xp">Earn XP for using Sendit</a>
          </li>
          <li class="md:hidden"><a href="#earn-xp">Earn XP</a></li>
          <li class="max-md:hidden"><a href="#getonweb3">GetOnWeb3</a></li>
        </ul>
        <ul class="flex flex-col gap-2 text-white">
          <li class="md:hidden"><a href="#getonweb3">GetOnWeb3</a></li>
          <li><a href="#terms">Terms of Use</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
        </ul>
      </nav>
      <div class="flex flex-col gap-2 max-md:w-full">
        <span class="uppercase font-bold text-white">Follow us on</span>
        <div class="flex gap-3 max-md:justify-center">
          <a href="https://discord.gg/6g7fQvEpdy" target="_blank"
            ><img
              src="@/assets/images/landing/icons/discord.svg"
              alt="Join Arcana Network on Discord"
              loading="lazy"
          /></a>
          <a href="https://t.me/ArcanaNetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/telegram.svg"
              alt="Join Arcana Network on Telegram"
              loading="lazy"
          /></a>
          <a href="https://www.youtube.com/@ArcanaNetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/youtube.svg"
              alt="Subscribe to Arcana Network on YouTube"
              loading="lazy"
          /></a>
          <a href="https://twitter.com/arcananetwork" target="_blank"
            ><img
              src="@/assets/images/landing/icons/twitter.svg"
              alt="Follow Arcana Network on Twitter"
              loading="lazy"
          /></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
