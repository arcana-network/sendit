<script setup lang="ts">
import navMenu from "@/constants/navMenu";

const emit = defineEmits(["navigated"]);
</script>

<template>
  <div class="form-card flex flex-col gap-2 py-3 divide-philippine-gray w-full">
    <div v-for="menu in navMenu" :key="menu.routeName" class="w-full">
      <RouterLink
        class="text-sm w-full px-6 py-3 flex"
        :to="{ name: menu.routeName }"
        @click.stop="emit('navigated')"
        >{{ menu.label }}</RouterLink
      >
    </div>
  </div>
</template>
