<script setup lang="ts">
import navMenu from "../constants/navMenu.ts";
</script>

<template>
  <div class="form-card p-4 flex space-y-2 divide-philippine-gray">
    <div v-for="menu in navMenu" :key="menu.routeName" class="w-full">
      <span class="text-sm">{{ menu.label }}</span>
    </div>
  </div>
</template>
