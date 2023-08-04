<template>
  <div class="relative -mt-[63px] md:-mt-[82px]">
    <div
      class="landing-container absolute z-[10] h-full w-full flex flex-col justify-center items-center"
    >
      <h3 class="landing-section-title uppercase">Send crypto over email</h3>
      <p>
        It’s the simplest way to transfer crypto to anyone, even those without a
        wallet. Don’t believe us? Enter your email address below and we’ll send
        you tokens!
      </p>
      <form>
        <input placeholder="someone@example.com" />
        <img src="@/assets/images/landing/try-it-out-vector-pointer.svg" />
        <span class="font-caveat">Try it out!</span>
        <button>SENDIT!</button>
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
        class="max-md:hidden relative top-0 left-0 right-0 h-[812px] md:h-[1059px] object-cover object-center w-full z-[2]"
      />
    </div>
  </div>
</template>
