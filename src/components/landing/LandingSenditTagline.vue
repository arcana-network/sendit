<template>
  <div class="relative">
    <div class="landing-container md:px-4 mt-[4rem] md:mt-[8rem]">
      <div
        class="p-[1.25rem] md:p-[3.75rem] rounded-[0.625rem] md:rounded-[1.875rem] bg-[#0000001a] z-[1]"
        style="backdrop-filter: blur(50px); border: 1px solid #8d8d8d50"
      >
        <div class="flex max-md:flex-col max-md:items-center md:justify-center">
          <div class="flex items-center">
            <img
              src="@/assets/images/landing/apostrophe-open-outline.svg"
              class="h-2 md:h-4 -mt-2 md:-mt-4"
            />
            <img
              src="@/assets/images/landing/apostrophe-open-filled.svg"
              class="h-2 md:h-4 -mt-2 md:-mt-4 mr-1 md:mr-2"
            />
            <img
              src="@/assets/images/landing/SendIt-text.svg"
              class="h-3 md:h-8"
              alt="SendIt"
            />
            <span class="landing-section-title">&nbsp;is&nbsp;like&nbsp;</span>
            <img
              alt="PayPal"
              src="@/assets/images/landing/Paypal-logo.svg"
              class="w-[74px] md:w-[152px]"
            /><span class="landing-section-title">,&nbsp;</span>
          </div>
          <div class="flex items-center">
            <span class="landing-section-title">but for Web</span
            ><span class="landing-section-title -mt-2">3</span>
            <img
              src="@/assets/images/landing/apostrophe-close-filled.svg"
              class="h-2 md:h-4 -mt-2 md:-mt-4 ml-1 md:ml-2"
            />
            <img
              src="@/assets/images/landing/apostrophe-close-outline.svg"
              class="h-2 md:h-4 -mt-2 md:-mt-4"
            />
          </div>
        </div>
      </div>
    </div>
    <img
      class="absolute z-[-1] -top-[280%] right-0 md:hidden"
      src="@/assets/images/landing/tagline-bg-375w.png"
      loading="lazy"
    />
    <img
      class="absolute z-[-1] -top-[300%] right-0 max-md:hidden"
      src="@/assets/images/landing/tagline-bg-803w.png"
      loading="lazy"
    />
  </div>
</template>
