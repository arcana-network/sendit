<template>
  <div class="landing-container md:px-4">
    <div
      class="p-[1.25rem] md:p-[3.75rem] rounded-[0.625rem] md:rounded-[1.875rem]"
      style="
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(50px);
        border: 1px solid #8d8d8d;
      "
    >
      <div class="flex max-md:flex-col max-md:items-center md:justify-center">
        <div class="flex items-center">
          <img
            src="@/assets/images/landing/apostrophe-open-outline.svg"
            class="h-2 md:h-4 -mt-4"
          />
          <img
            src="@/assets/images/landing/apostrophe-open-filled.svg"
            class="h-2 md:h-4 -mt-4 mr-1 md:mr-2"
          />
          <img
            src="@/assets/images/landing/SendIt-text.svg"
            class="h-4 md:h-8"
            alt="SendIt"
          />
          <span class="landing-section-title">&nbsp;is&nbsp;like&nbsp;</span>
          <img
            alt="PayPal"
            src="@/assets/images/landing/Paypal-logo-74w.png"
            srcset="
              @/assets/images/landing/Paypal-logo-74w.png   74w,
              @/assets/images/landing/Paypal-logo-152w.png 152w
            "
            sizes="(max-width: 767px) 74px, 152px"
          /><span class="landing-section-title">,&nbsp;</span>
        </div>
        <div class="flex items-center">
          <span class="landing-section-title">but for Web</span
          ><span class="landing-section-title -mt-2">3</span>
          <img
            src="@/assets/images/landing/apostrophe-close-filled.svg"
            class="h-2 md:h-4 -mt-4 ml-1 md:ml-2"
          />
          <img
            src="@/assets/images/landing/apostrophe-close-outline.svg"
            class="h-2 md:h-4 -mt-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>
