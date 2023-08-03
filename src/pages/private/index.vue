<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { useConnection } from "@/stores/connection";

const conn = useConnection();
</script>

<template>
  <div class="h-full flex flex-col min-h-screen">
    <AppHeader class="sticky top-0 z-[999]" id="header" />
    <div class="flex flex-col flex-1 h-full private-page">
      <div class="flex flex-col flex-1 container">
        <RouterView v-if="conn.connected"></RouterView>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
