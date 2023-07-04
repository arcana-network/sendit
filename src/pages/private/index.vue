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
