<template>
  <div class="relative">
    <div class="landing-container mt-[4rem] md:mt-[8rem]" id="why-sendit">
      <h3 class="flex flex-row justify-center earn-section-title text-center mb-[2rem] md:mb-[3rem] gap-3 pb-10">
        Why Use
        <span class="flex flex-row font-bold gap-5">
          SendIt
          <img src="@/assets/images/landing/question-mark.png"></span>
      </h3>
      <div class="grid gap-3 md:gap-6" style="
          grid-template-areas:
            'why-sendit-2 why-sendit-2'
            'why-sendit-3 why-sendit-4';
        ">
        <div
          class="border border-solid border-[#363636] bg-[#141414]/60 rounded-[25px] md:rounded-[30px] flex flex-col md:flex-row justify-between overflow-hidden"
          style="grid-area: why-sendit-2">
          <div class="relative isolate flex justify-center items-center md:w-[1300px]">
            <img src="@/assets/gifs/sendit-email.gif" loading="lazy" class="hidden md:block" />
          </div>
          <div class="flex flex-col gap-[0.3rem] md:gap-[1rem] p-[0.75rem] md:p-[2rem]">
            <h4 class="font-[500] text-[36px] md:text-[24px] md:pt-10 text-center md:text-left">
              Nothing cryptic, just email</h4>
            <p class="text-[#c4c4c4] text-[20px] md:text-[20px] text-center md:text-left">
              With SendIt, there is no need for long, scary wallet addresses, just use emails to send crypto and be sure
              it reached the right person!
            </p>
          </div>
        </div>
        <div
          class="border border-solid border-[#363636] bg-[#141414]/60 rounded-[25px] md:rounded-[30px] flex flex-col justify-evenly"
          style="grid-area: why-sendit-3; padding-bottom: 0">
          <img src="@/assets/gifs/social-logins.gif" loading="lazy" style="height: 230px;" class="hidden md:block" />
          <div class="flex flex-col gap-[0.3rem] md:gap-[1rem] py-10 px-7">
            <h4 class="font-[500] text-[20px] md:text-[24px]">
              Zero learning curves </h4>
            <p class="text-[#c4c4c4] text-[12px] md:text-[20px]">
              With SendIt, a self-custodial wallet is created which can be accessed with Web2 authentication. Users can
              learn crypto-specific ideas at their own pace.
            </p>
          </div>
        </div>
        <div
          class="border border-solid border-[#363636] bg-[#141414]/60 rounded-[25px] md:rounded-[30px] flex flex-col justify-evenly"
          style="grid-area: why-sendit-4;">
          <img src="@/assets/gifs/success.gif" loading="lazy" style="height: 230px;" class="hidden md:block" />
          <div class="flex flex-col gap-[0.3rem] md:gap-[1rem] py-5 px-7">
            <h4 class="font-[500] text-[20px] md:text-[24px]">
              Even Metamask is difficult.
            </h4>
            <p class="text-[#c4c4c4] text-[12px] md:text-[20px]">
              Metamask is good for technically inclined users, mainstream adoption requires the use of Web2 concepts
              that are already familiar to users. SendIt does that.
            </p>
          </div>
        </div>
      </div>
    </div>
    <img class="absolute z-[-1] top-[65%] -left-[10%] max-md:hidden go-to-linear-animation"
      src="@/assets/images/landing/planet1.svg" loading="lazy" />
  </div>
</template>
