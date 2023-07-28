<script setup lang="ts">
import UnderMaintenanceImg from "@/assets/images/under-maintenance.png";
</script>

<template>
  <div class="h-screen w-screen">
    <img
      :src="UnderMaintenanceImg"
      alt="under maintanence"
      class="h-full w-full object-fill"
    />
  </div>
</template>
