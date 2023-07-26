<script setup lang="ts">
import UnderMaintenanceImg from "@/assets/images/under-maintanence.svg";
</script>

<template>
  <div class="h-screen w-screen">
    <img
      :src="UnderMaintenanceImg"
      alt="under maintanence"
      class="border-2 h-full w-full"
    />
  </div>
</template>
