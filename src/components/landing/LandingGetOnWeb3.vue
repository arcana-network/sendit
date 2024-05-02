<template>
  <div
    id="getonweb3"
    class="h-[234px] md:h-[571px] relative flex items-center mt-[4rem] md:mt-[8rem]"
  >
    <div class="landing-container flex flex-col items-center gap-4">
      <h3 class="getonweb3-section-title md:mb-10">#GetOnWeb3</h3>
      <p class="getonweb3-section-description max-w-[688px] text-center">
        There's no better way to inspire others to embrace crypto than by
        getting them to experience it firsthand. Take charge, empower others,
        and be at the forefront of the crypto revolution. Together, we'll change
        the world for the better.
      </p>
    </div>
    <img
      src="@/assets/images/landing/get-on-web3-1440w.webp"
      srcset="
        @/assets/images/landing/get-on-web3-375w.webp   575w,
        @/assets/images/landing/get-on-web3-1440w.webp 1440w
      "
      sizes="(max-width: 767px) 575px, 1440px"
      loading="lazy"
      class="object-cover object-center absolute inset-0 z-[-1] w-full h-full filter brightness-75"
    />
  </div>
</template>
