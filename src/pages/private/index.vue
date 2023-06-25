<script setup lang="ts">
import Header from "../../components/layout/Header.vue";
import Footer from "../../components/layout/Footer.vue";
</script>

<template>
  <div class="h-full flex flex-col">
    <Header />
    <div class="flex-1">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>
