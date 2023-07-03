<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
</script>

<template>
  <div class="h-full flex flex-col min-h-screen">
    <AppHeader />
    <div class="flex flex-col flex-1 h-full private-page">
      <div class="flex flex-col flex-1">
        <RouterView></RouterView>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
.private-page {
  background: linear-gradient(
    68.66deg,
    rgba(38, 38, 38, 0.8) 0%,
    rgba(14, 14, 14, 0) 100%
  );
}
</style>
