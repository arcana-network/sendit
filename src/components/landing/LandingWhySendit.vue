<template>
  <div class="landing-container" id="why-sendit">
    <h3 class="landing-section-title uppercase text-center">Why SendIt?</h3>
    <div
      class="grid gap-3 md:gap-6"
      style="
        grid-template-areas:
          'why-sendit-2 why-sendit-2'
          'why-sendit-3 why-sendit-4';
      "
    >
      <!-- <div>
        <div>
          <h4>People roll their eyes if you mention Web3</h4>
          <p>
            Don’t explain crypto, show them the convenience. Just send them some
            crypto using SendIt!
          </p>
        </div>
        <img
          src="@/assets/images/landing/why-sendit-1-111w.png"
          srcset="
            @/assets/images/landing/why-sendit-1-111w.png 111w,
            @/assets/images/landing/why-sendit-1-344w.png 344w
          "
          sizes="(max-width: 767px) 111px, 344px"
          alt="People roll their eyes if you mention Web3"
          loading="lazy"
        />
        <img
            src="@/assets/images/landing/why-sendit-bg-81w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 md:hidden"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-557w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 max-md:hidden"
          />
      </div> -->
      <div
        class="border border-solid border-[#363636] rounded-[5px] md:rounded-[10px] flex justify-between"
        style="grid-area: why-sendit-2"
      >
        <div class="flex flex-col gap-[0.3rem] md:gap-[1rem]">
          <h4 class="font-[500] text-[10px] md:text-[24px]">
            People are scared they’ll make mistakes with wallet addresses
          </h4>
          <p class="text-[#c4c4c4] text-[8px] md:text-[20px]">
            With SendIt, people can send money just using email addresses. What
            could be simpler?
          </p>
        </div>
        <div
          class="relative isolate flex justify-center items-center h-[81px] md:h-[292px]"
        >
          <img
            src="@/assets/images/landing/why-sendit-2-156w.png"
            srcset="
              @/assets/images/landing/why-sendit-2-156w.png 156w,
              @/assets/images/landing/why-sendit-2-502w.png 502w
            "
            sizes="(max-width: 767px) 156px, 502px"
            alt="People are scared they’ll make mistakes with wallet addresses"
            loading="lazy"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-81w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 md:hidden"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-557w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 max-md:hidden"
          />
        </div>
      </div>
      <div
        class="border border-solid border-[#363636] rounded-[5px] md:rounded-[10px] flex flex-col"
        style="grid-area: why-sendit-3"
      >
        <div class="flex flex-col gap-[0.3rem] md:gap-[1rem]">
          <h4 class="font-[500] text-[10px] md:text-[24px]">
            The Crypto learning curve scares people
          </h4>
          <p class="text-[#c4c4c4] text-[8px] md:text-[20px]">
            With SendIt, a self-custodial wallet is created which can be
            accessed with Web2 authentication. Users can learn crypto-specific
            ideas at their own pace.
          </p>
        </div>
        <div
          class="relative isolate flex justify-center items-center h-[81px] md:h-[292px]"
        >
          <img
            src="@/assets/images/landing/why-sendit-3-66w.png"
            srcset="
              @/assets/images/landing/why-sendit-3-66w.png   66w,
              @/assets/images/landing/why-sendit-3-241w.png 241w
            "
            sizes="(max-width: 767px) 66px, 241px"
            alt="The Crypto learning curve scares people"
            loading="lazy"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-81w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 md:hidden"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-557w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 max-md:hidden"
          />
        </div>
      </div>
      <div
        class="border border-solid border-[#363636] rounded-[5px] md:rounded-[10px] flex flex-col"
        style="grid-area: why-sendit-4"
      >
        <div class="flex flex-col gap-[0.3rem] md:gap-[1rem]">
          <h4 class="font-[500] text-[10px] md:text-[24px]">
            Metamask is difficult to navigate
          </h4>
          <p class="text-[#c4c4c4] text-[8px] md:text-[20px]">
            Metamask is good for technically inclined users, mainstream adoption
            requires the use of Web2 concepts that are already familiar to
            users. SendIt does that.
          </p>
        </div>
        <div
          class="relative isolate flex justify-center items-center h-[81px] md:h-[292px]"
        >
          <img
            src="@/assets/images/landing/why-sendit-4-70w.png"
            srcset="
              @/assets/images/landing/why-sendit-4-70w.png   70w,
              @/assets/images/landing/why-sendit-4-242w.png 242w
            "
            sizes="(max-width: 767px) 70px, 242px"
            alt="People roll their eyes if you mention Web3"
            loading="lazy"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-81w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 md:hidden"
          />
          <img
            src="@/assets/images/landing/why-sendit-bg-557w.svg"
            loading="lazy"
            class="z-[-1] absolute top-0 max-md:hidden"
          />
        </div>
      </div>
    </div>
  </div>
</template>
