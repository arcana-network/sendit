<template>
  <div
    class="landing-container flex flex-col md:flex-row justify-center gap-[50px] items-center md:items-start md:gap-20 pt-[60px] pb-[10px] mx-auto">
    <div
      class="flex bg-[#212121] bg-opacity-60 gap-[1.5rem] md:gap-[4rem] px-[3rem] py-[1rem] md:px-[3.5rem] md:py-[1rem] lg:py-[2rem] lg:px-[3.5rem] max-w-[600px] justify-center w-max rounded-[12px] md:rounded-[30px] -mt-[10px] md:-mt-[25px] border-opacity-50 backdrop-blur-[50px] border-5 border-[#181819]">
      <div class=" flex flex-row items-center gap-10 -ml-5 md:-ml-10">
        <img src="@/assets/images/landing/users.svg" alt="Users signed up"
          class="h-[60px] md:h-[100px] 2xl:h-[150px]" />
        <div class="flex flex-col items-start gap-1">
          <span
            class="font-bold-onest text-[20px] md:text-[30px] lg:text-[40px] 2xl:text-[60px] leading-[1.5]">500K+</span>
          <span class="text-[#c4c4c4] text-[12px] md:text-[12px] lg:text-[20px] 2xl:text-[30px] ">Users Signed Up</span>
        </div>
      </div>
    </div>
    <div
      class="flex bg-[#212121] bg-opacity-60 gap-[1.5rem] md:gap-[4rem] px-[3rem] py-[1rem] md:px-[3.5rem] md:py-[1rem] lg:py-[2rem] lg:px-[3.5rem] max-w-[600px] justify-center w-max rounded-[12px] md:rounded-[30px] -mt-[10px] md:-mt-[25px] border-opacity-50 backdrop-blur-[50px] border-5 border-[#181819]">
      <div class="flex flex-row items-center gap-10 -ml-5 md:-ml-10">
        <img src="@/assets/images/landing/transactions.svg" alt="Transactions Sent"
          class="h-[60px] md:h-[100px] 2xl:h-[150px]" />
        <div class="flex flex-col items-start gap-1">
          <span
            class="font-bold-onest text-[20px] md:text-[30px] lg:text-[40px] 2xl:text-[60px] leading-[1.5]">3M+</span>
          <span
            class="text-[#c4c4c4] text-[12px] md:text-[12px] lg:text-[20px] 2xl:text-[30px] text-center">Transactions
            Sent</span>
        </div>
      </div>
    </div>
  </div>
</template>
