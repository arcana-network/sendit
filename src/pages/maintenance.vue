<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <AppHeader hide-nav hide-user-data />
    <div
      class="flex h-full justify-center items-center container flex-grow max-lg:flex-col max-lg:gap-12 p-4 max-lg:py-12"
    >
      <div
        class="flex flex-col flex-grow items-center justify-center w-full lg:w-1/2"
      >
        <section
          class="w-full flex flex-col md:justify-center md:items-center md:text-center relative"
        >
          <section class="w-full max-w-[500px] mx-auto space-y-6 flex flex-col">
            <header
              class="flex flex-col gap-1 text-center justify-center items-center"
            >
              <img src="@/assets/images/maintenance.png" class="w-24 h-24" />
              <h1
                class="text-[1.5rem] lg:text-[2rem] text-white font-bold mt-4"
              >
                We are Under Maintenance
              </h1>
              <p
                class="text-xs lg:text-base text-philippine-gray max-w-[280px] md:text-center md:mx-auto"
              >
                Will be back in a few hours!
              </p>
            </header>
          </section>
        </section>
      </div>
    </div>
  </div>
</template>
