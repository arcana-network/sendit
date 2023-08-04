<template>
  <header class="sticky top-0 py-4 z-[1000]">
    <div class="landing-container relative">
      <div class="flex md:justify-center">
        <a href="/" class="flex">
          <img
            alt="SendIt"
            src="@/assets/images/landing/sendit-logomark-30w.png"
            srcset="
              @/assets/images/landing/sendit-logomark-30w.png 30w,
              @/assets/images/landing/sendit-logomark-49w.png 49w
            "
            sizes="(max-width: 767px) 30px, 49px"
          />
          <img src="@/assets/images/landing/SendIt-text.svg" alt="SendIt" />
        </a>
      </div>
      <div
        class="absolute z-[10] right-[1.25rem] top-0 bottom-0 flex items-center"
      >
        <button
          class="text-[0.75rem] leading-[1.125rem] uppercase font-500 border-[#363636] border border-solid rounded-[5px] md:rounded-[10px] px-4 py-2 md:px-6 md:py-3 cursor-pointer hover:bg-[#363636] hover:text-white transition-colors duration-200 ease-in-out"
        >
          Launch App
        </button>
      </div>
    </div>
  </header>
</template>
