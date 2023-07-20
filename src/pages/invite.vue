<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { decode } from "msgpackr";
import { onMounted } from "vue";
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const { u } = route.query;
  const [verifier, verifierId, id] = decode(Buffer.from(u as string, "base64"));
  router.push({
    name: "Login",
    query: {
      verifier,
      verifierId,
      id,
    },
  });
});
</script>

<template></template>
