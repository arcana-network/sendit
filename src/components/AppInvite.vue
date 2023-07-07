<script lang="ts" setup>
import Overlay from "@/components/overlay.vue";
import { ref, computed } from "vue";
import { isValidEmail } from "@/utils/validation";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";

const emit = defineEmits(["close"]);

const email = ref("");
const loader = useLoaderStore();
const toast = useToast();

const areEmailsValid = computed(() => {
  if (!email.value.trim()) return false;
  const emails = email.value.split(",");
  for (let i = 0; i < emails.length; i++) {
    if (!isValidEmail(emails[i].trim())) return false;
  }
  return true;
});

async function handleEmailInvite() {
  if (areEmailsValid.value) {
    const socket = useSocketConnection();
    const message = email.value.split(",").map((e) => {
      return {
        verifier: "passwordless",
        verifier_id: e.trim(),
      };
    });
    loader.showLoader("Sending invites...");
    await socket.sendMessage(SOCKET_IDS.EMAIL_INVITE, message);
    loader.hideLoader();
    toast.success("Invites sent");
    emit("close");
  } else {
    alert("One or more emails are not valid");
  }
}
</script>

<template>
  <Overlay>
    <div
      class="max-w-[540px] w-screen bg-eerie-black rounded-[10px] border-1 border-jet flex flex-col relative p-4 gap-5"
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
            v-model="email"
          />
        </div>
        <div class="flex justify-end">
          <button
            class="uppercase bg-white rounded-[5px] text-black text-sm font-[500] px-8 py-2"
            :disabled="!areEmailsValid"
            @click.stop="handleEmailInvite"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </Overlay>
</template>
