<template>
  <div class="landing-container flex md:flex-row justify-center gap-20 pt-[60px] pb-[10px] mx-auto">
    <div
      class="flex bg-[#1E1E1E] bg-opacity-40 gap-[1.5rem] md:gap-[4rem] px-[2.75rem] py-[1rem] md:px-[3.25rem] md:py-[2rem] max-w-[600px] justify-center w-max rounded-[12px] md:rounded-[30px] -mt-[10px] md:-mt-[25px] border-opacity-50"
      style="
        -webkit-backdrop-filter: blur(50px);
        backdrop-filter: blur(50px);
        border: 5px solid #181819;
      ">
      <div class="flex flex-row items-center gap-10 -ml-5">
        <img src="@/assets/images/landing/users.svg" alt="Users signed up" style="height: 100px;" />
        <div class="flex flex-col items-start gap-1">
          <span class="font-bold text-[20px] md:text-[40px] leading-[1.5]">500K+</span>
          <span class="text-[#c4c4c4] text-[8px] md:text-[20px]">Users Signed Up</span>
        </div>
      </div>
    </div>
    <div
      class="flex bg-[#1E1E1E] bg-opacity-40 gap-[1.5rem] md:gap-[4rem] px-[2.75rem] py-[1rem] md:px-[3.25rem] md:py-[2rem] max-w-[600px] justify-center w-max rounded-[12px] md:rounded-[30px] -mt-[10px] md:-mt-[25px] border-opacity-50"
      style="
        -webkit-backdrop-filter: blur(50px);
        backdrop-filter: blur(50px);
        border: 5px solid #181819;
      ">
      <div class="flex flex-row items-center gap-10 -ml-5">
        <img src="@/assets/images/landing/transactions.svg" alt="Transactions Sent" style="height: 100px;" />
        <div class="flex flex-col items-start gap-1">
          <span class="font-bold text-[20px] md:text-[40px] leading-[1.5]">3M+</span>
          <span class="text-[#c4c4c4] text-[8px] md:text-[20px] text-center">Transactions Sent</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .landing-container {
    flex-direction: row;
    gap: 50px;
    align-items: center;
  }
}
</style>
