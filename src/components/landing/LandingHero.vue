<template>
  <div>
    <div class="landing-container">
      <h3 class="landing-section-title">Send crypto over email</h3>
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
    <div>
      <img
        src="@/assets/images/landing/hero-image-375w.png"
        srcset="
          @/assets/images/landing/hero-image-375w.png   375w,
          @/assets/images/landing/hero-image-1440w.png 1440w
        "
        sizes="(max-width: 767px) 375px, 1440px"
      />
    </div>
  </div>
</template>
