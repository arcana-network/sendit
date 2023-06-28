<script lang="ts" setup>
import Overlay from "./overlay.vue";

const emit = defineEmits(["close"]);

function handleEmailInvite() {
  alert("Invite");
}
</script>

<template>
  <Overlay>
    <div
      class="w-[540px] bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
    >
      <button class="absolute right-4 top-4" @click.stop="emit('close')">
        <img src="@/assets/images/icons/close.svg" alt="close" />
      </button>
      <span class="font-[500]">Invite</span>
      <form class="flex flex-col gap-5" @submit.prevent="handleEmailInvite">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-[500]" for="email-invite"
            >Add Email ID</label
          >
          <input
            type="text"
            id="email-invite"
            placeholder="Email, comma separated"
            class="text-sm placeholder:text-philippine-gray bg-[#313131] rounded-[5px] p-2"
          />
        </div>
        <div class="flex justify-end">
          <button
            class="uppercase bg-white rounded-[5px] text-black text-sm font-[500] px-8 py-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </Overlay>
</template>
