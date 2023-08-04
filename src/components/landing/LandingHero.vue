<template>
  <div class="relative -mt-[63px] md:-mt-[82px]">
    <div
      class="landing-container absolute z-[10] h-full w-full flex flex-col justify-center items-center left-1/2 transform -translate-x-1/2"
    >
      <h3
        class="landing-section-title uppercase max-md:max-w-[200px] text-center"
      >
        Send crypto over email
      </h3>
      <p class="landing-section-description max-w-[560px] text-center">
        This is the simplest way to send crypto to anyone even if they don’t
        have a wallet. Don’t believe us? Try it for yourself for free!
      </p>
      <form>
        <input placeholder="someone@example.com" />
        <button>Sign Up!</button>
        <img src="@/assets/images/landing/try-it-out-vector-pointer.svg" />
        <span class="font-caveat text-[1.25rem] md:text-[2rem]"
          >Sign-up now, get 50XP!</span
        >
      </form>
    </div>
    <div class="relative z-[1]">
      <div
        class="h-[456px] absolute top-0 left-0 right-0 z-[3]"
        style="
          background: linear-gradient(
            180deg,
            #0d0d0d 0%,
            rgba(0, 0, 0, 0.37) 50.37%,
            rgba(0, 0, 0, 0) 98.58%
          );
        "
      />
      <img
        src="@/assets/images/landing/hero-image-375w.png"
        class="md:hidden relative top-0 left-0 right-0 h-[812px] md:h-[1059px] object-cover object-center w-full z-[2]"
      />
      <img
        src="@/assets/images/landing/hero-image-1440w.png"
        class="max-md:hidden relative top-0 left-0 right-0 max-h-screen h-[812px] md:h-[1059px] object-cover object-center w-full z-[2]"
      />
    </div>
  </div>
</template>
