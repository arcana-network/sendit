<script setup lang="ts">
import useLoaderStore from "@/stores/loader";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { content } from "@/constants/content";

const loaderStore = useLoaderStore();
const route = useRoute();

loaderStore.showLoader(content.TWITTER_REDIRECT_MSG);

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
@/constants/content
