<template>
  <div class="landing-container">
    <div
      class="flex gap-[1.5rem] md:gap-[4rem] px-[2.5rem] py-[1.25rem] md:px-[5rem] md:py-[2.5rem] max-w-[700px] mx-auto justify-center w-max rounded-[12px] md:rounded-[30px] -mt-[40px] md:-mt-[80px]"
      style="
        backdrop-filter: blur(50px);
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1)
          ),
          linear-gradient(to bottom, #8d8d8d -140%, rgba(141, 141, 141, 0));
        border: 1px solid #8d8d8d50;
      "
    >
      <div class="flex flex-col items-center">
        <span class="font-syne text-[20px] md:text-[48px] leading-[1.5]"
          >100,000+</span
        >
        <span class="text-[#c4c4c4] uppercase text-[8px] md:text-[14px]"
          >Users signed up</span
        >
      </div>
      <div class="flex flex-col items-center">
        <span class="font-syne text-[20px] md:text-[48px] leading-[1.5]"
          >200,000+</span
        >
        <span class="text-[#c4c4c4] uppercase text-[8px] md:text-[14px]"
          >Transactions Sent</span
        >
      </div>
    </div>
  </div>
</template>
