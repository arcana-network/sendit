<script setup lang="ts">
import useLoaderStore from "@/stores/loader";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const loaderStore = useLoaderStore();
const route = useRoute();

loaderStore.showLoader("Redirecting back to Sendit. Please wait...");

onMounted(() => {
  window.opener?.postMessage({
    type: "twitter-redirect",
    payload: route.query,
  });
  window.close();
});
</script>

<template>
  <div></div>
</template>
