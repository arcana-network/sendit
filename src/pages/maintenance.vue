<script setup lang="ts">
import UnderMaintenanceImg from "@/assets/images/under-maintanence.png";
</script>

<template>
  <div class="h-screen w-screen">
    <img
      :src="UnderMaintenanceImg"
      alt="under maintanence"
      class="h-full w-full border-2 object-fill"
    />
  </div>
</template>
