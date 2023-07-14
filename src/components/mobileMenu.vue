<script setup lang="ts">
import navMenu from "@/constants/navMenu";

const emit = defineEmits(["navigated"]);
</script>

<template>
  <div class="form-card p-4 flex space-y-2 divide-philippine-gray">
    <div v-for="menu in navMenu" :key="menu.routeName" class="w-full">
      <RouterLink
        class="text-sm w-full"
        :to="{ name: menu.routeName }"
        @click.stop="emit('navigated')"
        >{{ menu.label }}</RouterLink
      >
    </div>
  </div>
</template>
