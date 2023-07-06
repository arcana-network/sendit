<script setup lang="ts">
import { useRouter } from "vue-router";
import { decode } from "msgpackr";
import { onMounted } from "vue";
const router = useRouter();

onMounted(() => {
  const { u } = router.currentRoute.value.query;
  const [verifier, verifierId] = decode(Buffer.from(u, "base64"));
  router.push({
    name: "Login",
    query: {
      verifier,
      verifierId,
    },
  });
});
</script>

<template></template>
