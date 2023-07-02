<script setup lang="ts">
import arcanaLogo from "@/assets/images/arcana.svg";
</script>

<template>
  <footer class="space-x-5 px-7.5 py-4 flex items-center">
    <a
      class="text-xs flex items-center space-x-2"
      href="https://arcana.network"
      target="_blank"
    >
      <span>By</span> <img :src="arcanaLogo" alt="Arcana" class="w-24" />
    </a>
    <a
      class="text-xs"
      href="https://github.com/arcana-network/license/blob/main/TERMS.md"
      target="_blank"
      >Terms of Use</a
    >
    <a
      class="text-xs"
      href="https://github.com/arcana-network/license/blob/main/PRIVACY.md"
      target="_blank"
      >Privacy Policy</a
    >
  </footer>
</template>
