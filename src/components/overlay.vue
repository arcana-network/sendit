<template>
  <div
    class="fixed inset-0 before:content-{''} before:absolute before:inset-0 z-[99999] before:z-[99998] before:bg-black before:opacity-90 h-[100vh] flex justify-center items-center"
  >
    <div class="relative z-[100000]">
      <slot></slot>
    </div>
  </div>
</template>
