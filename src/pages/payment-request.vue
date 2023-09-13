<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { decode } from "msgpackr";
import { onMounted } from "vue";
const router = useRouter();
const route = useRoute();
import { hexlify } from "ethers";

onMounted(() => {
  if (route.query.x) {
    const [verifier, verifierId, requestId] = decode(
      Buffer.from(route.query.x as string, "base64")
    );
    console.log({
      name: "App",
      query: {
        verifier,
        verifierId,
        requestId: hexlify(requestId),
      },
      requestId,
    });
    router.push({
      name: "App",
      query: {
        verifier,
        verifierId,
        requestId: hexlify(requestId),
      },
    });
  }
});
</script>

<template></template>
