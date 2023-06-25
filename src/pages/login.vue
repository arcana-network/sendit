<script setup lang="ts">
import sendItLogo from "../assets/images/send-it-logo.png";
import useAuthStore from "../stores/auth";
import useArcanaAuth from "../use/arcanaAuth";

const { connect, isLoggedIn } = useArcanaAuth();
const authStore = useAuthStore();

async function connectToArcana() {
  await connect();
  authStore.setLoginStatus(await isLoggedIn());
}
</script>

<template>
  <div class="flex h-full">
    <section class="w-1/2 flex flex-col justify-center items-center relative">
      <img
        :src="sendItLogo"
        alt="send it logo"
        class="w-12 h-12 absolute top-4 left-4"
      />
      <section class="min-w-96 space-y-4 flex flex-col items-center">
        <Header class="space-y-0.5 text-center">
          <h1 class="text-3.5xl text-white font-bold">Welcome to SendIt</h1>
          <p class="text-sm">
            Sign-in using any of these methods to get started
          </p>
        </Header>
        <section class="space-y-0.5 w-full">
          <div class="flex flex-col space-y-2">
            <button class="btn btn-login" @click="connectToArcana">
              Connect with Arcana
            </button>
          </div>
        </section>
      </section>
    </section>
    <section class="space-y-3 w-1/2 p-7.5">
      <div class="bg-eerie-black p-10 h-full space-y-3 rounded-2xl">
        <p class="text-3xl">
          Send Digital Assets to anyone even if they don’t have a wallet!
        </p>
        <p class="text-sm text-philippine-gray">
          Send digital assets over email, GitHub, Twitter or many other channels
          in a cryptographically secure way and earn rewards while doing it
        </p>
      </div>
    </section>
  </div>
</template>
