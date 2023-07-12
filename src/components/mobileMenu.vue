<script setup lang="ts">
import navMenu from "@/constants/navMenu";
</script>

<template>
  <div class="form-card p-4 flex space-y-2 divide-philippine-gray">
    <div v-for="menu in navMenu" :key="menu.routeName" class="w-full">
      <RouterLink class="text-sm" :to="{ name: menu.routeName }">{{
        menu.label
      }}</RouterLink>
    </div>
  </div>
</template>
