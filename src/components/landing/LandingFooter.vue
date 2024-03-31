<template>
  <footer
    class="relative rounded-t-[16px] md:rounded-t-[30px] border border-solid border-[#1d1d1c] mt-[4rem] md:mt-[8rem] mr-2 ml-2"
    style="
      -webkit-backdrop-filter: blur(50px);
      backdrop-filter: blur(50px);
      border-top: 5px solid #181819;
      border-bottom: none;
    ">
    <div class="relative rounded-t-[16px] md:rounded-t-[30px] h-full w-full z-[1] py-[2rem] md:py-[4rem]" style="
        -webkit-backdrop-filter: blur(50px);
        backdrop-filter: blur(50px);
        background-color: #151415;
      ">
      <div
        class="landing-container flex max-md:flex-col max-md:gap-5 max-md:items-center md:justify-between max-md:text-center landing-section-description w-full">
        <div class="max-md:w-full flex flex-col max-md:items-center">
          <a href="/" class="flex">
            <img alt="SendIt" src="@/assets/images/landing/sendit-logomark-30w.png" srcset="
                @/assets/images/landing/sendit-logomark-30w.png 30w,
                @/assets/images/landing/sendit-logomark-49w.png 49w
              " sizes="(max-width: 767px) 30px, 49px" />
          </a>
          <a href="https://arcana.network" target="_blank" class="text-white text-[0.9rem]">Made with love by Arcana
            Network</a>
          <a href="#" target="_blank"
            class="text-[0.75rem] leading-[1rem] uppercase font-500 border-solid border md:border md:border-solid md:border-[#373736] rounded-[5px] text-center max-md:mt-3 md:mt-5 py-2.5">
            Product Hunt Actionable Badge
          </a>
        </div>
        <nav class="flex justify-evenly flex-grow max-md:w-full max-md:justify-around">
          <ul class="flex flex-col gap-1 text-white">
            <li><a href="#why-sendit">Why Sendit?</a></li>
            <li><a href="#how-does-it-work">How does it work?</a></li>
            <li class="max-md:hidden">
              <a href="#earn-xp">Earn XP for Using Sendit</a>
            </li>
            <li class="md:hidden"><a href="#earn-xp">Earn XP</a></li>
            <li class="max-md:hidden"><a href="#getonweb3">GetOnWeb3</a></li>
          </ul>
          <ul class="flex flex-col gap-1 md:gap-1 text-white">
            <li class="md:hidden"><a href="#getonweb3">GetOnWeb3</a></li>
            <li>
              <a href="https://github.com/arcana-network/license/blob/main/TERMS.md" target="_blank">Terms of Use</a>
            </li>
            <li>
              <a href="https://github.com/arcana-network/license/blob/main/PRIVACY.md" target="_blank">Privacy
                Policy</a>
            </li>
          </ul>
        </nav>
        <div class="flex flex-col gap-2 md:gap-4 max-md:w-full">
          <span class="uppercase font-bold text-white">Follow us on</span>
          <div class="flex gap-5 max-md:justify-center">
            <a href="https://discord.gg/6g7fQvEpdy" target="_blank"><img src="@/assets/images/landing/icons/discord.svg"
                alt="Join Arcana Network on Discord" loading="lazy" style="height: 20px;" /></a>
            <a href="https://t.me/ArcanaNetwork" target="_blank"><img src="@/assets/images/landing/icons/telegram.svg"
                alt="Join Arcana Network on Telegram" loading="lazy" style="height: 20px;" /></a>

            <a href="https://www.youtube.com/@ArcanaNetwork" target="_blank"><img
                src="@/assets/images/landing/icons/youtube.svg" alt="Subscribe to Arcana Network on YouTube"
                loading="lazy" style="height: 20px;" /></a>
            <a href="https://twitter.com/arcananetwork" target="_blank"><img
                src="@/assets/images/landing/icons/twitter.svg" alt="Follow Arcana Network on Twitter" loading="lazy"
                style="height: 20px;" /></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
