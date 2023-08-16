<script lang="ts" setup>
import Overlay from "@/components/overlay.vue";
import { ref, computed, ComputedRef, watch } from "vue";
import { isValidEmail } from "@/utils/validation";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import useLoaderStore from "@/stores/loader";
import { useToast } from "vue-toastification";
import { normaliseEmail } from "@/utils/normalise";

const emit = defineEmits(["close"]);

const email = ref("");
const loader = useLoaderStore();
const toast = useToast();
const hasStartedTyping = ref(false);
const conn = useConnection();
const emailsArr = ref([] as string[]);
const bogusEmails = ref([] as string[]);
const nonBogusEmails = ref([] as string[]);

const areEmailsValid: ComputedRef<{
  valid: boolean;
  message?: string;
  type?: string;
  invalidEmails?: string[];
  repeatedEmails?: string[];
}> = computed(() => {
  if (hasStartedTyping.value && email.value.includes(",")) {
    const invalidEmails = [] as string[];
    const repeatedEmails = [] as string[];
    if (!email.value.trim())
      return {
        valid: true,
      };
    const emails = email.value.split(",");
    emailsArr.value = [...emailsArr.value, ...emails.filter((e) => e.trim())];
    email.value = "";
    if (emailsArr.value.length > 10) {
      return {
        valid: false,
        message: "You can invite a maximum of 10 people at a time",
        type: "max",
      };
    }
    for (let i = 0; i < emailsArr.value.length; i++) {
      if (!emailsArr.value[i].trim()) continue;
      if (!isValidEmail(emailsArr.value[i].trim())) {
        invalidEmails.push(emailsArr.value[i]);
      }
      if (emailsArr.value.indexOf(emailsArr.value[i]) !== i) {
        repeatedEmails.push(emailsArr.value[i]);
      }
    }
    if (invalidEmails.length) {
      return {
        valid: false,
        message: "One or more emails are not valid",
        type: "invalid",
        invalidEmails,
      };
    }
    if (repeatedEmails.length) {
      return {
        valid: false,
        message: "Emails cannot be repeated",
        type: "repeated",
        repeatedEmails,
      };
    }
  }
  return {
    valid: true,
  };
});

async function handleEmailInvite() {
  if (areEmailsValid.value.valid && !bogusEmails.value.length) {
    const invites = emailsArr.value.map((e) => {
      return {
        verifier: "passwordless",
        verifier_id: normaliseEmail(e),
      };
    });
    const message = {
      invites,
    };
    loader.showLoader("Sending invites...");
    try {
      await conn.sendMessage(SOCKET_IDS.EMAIL_INVITE, message);
      email.value = "";
      emailsArr.value = [];
      hasStartedTyping.value = false;
      bogusEmails.value = [];
      nonBogusEmails.value = [];
      toast.success("Invites sent");
    } catch (e) {
    } finally {
      loader.hideLoader();
      emit("close");
    }
  } else {
    toast.error("One or more emails are not valid");
  }
}

watch(emailsArr, async (arr) => {
  bogusEmails.value = bogusEmails.value.filter((e) => arr.includes(e));
  nonBogusEmails.value = nonBogusEmails.value.filter((e) => arr.includes(e));
  for (let i = 0; i < arr.length; i++) {
    if (
      !bogusEmails.value.includes(arr[i]) &&
      !nonBogusEmails.value.includes(arr[i]) &&
      !areEmailsValid.value.invalidEmails?.includes(arr[i]) &&
      !areEmailsValid.value.repeatedEmails?.includes(arr[i]) &&
      arr[i].trim()
    ) {
      const email = arr[i];
      const message = {
        email_address: email,
      };
      const res = await conn.sendMessage(SOCKET_IDS.CHECK_EMAIL, message);
      if (res.disposable) {
        bogusEmails.value.push(email);
      } else {
        nonBogusEmails.value.push(email);
      }
    }
  }
});

function handleEmailRemove(index: number) {
  emailsArr.value = emailsArr.value.filter((_, i) => i !== index);
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
        <div class="flex flex-col gap-1 space-y-1">
          <label class="text-xs text-start font-[500]" for="email-invite"
            >Add Email ID</label
          >
          <div
            class="text-sm placeholder:text-philippine-gray bg-[#313131] rounded-[5px] p-2 input flex flex-col gap-4"
          >
            <div
              v-if="emailsArr.length"
              class="flex flex-wrap items-center gap-2"
            >
              <div
                v-for="(em, index) in emailsArr"
                :key="em"
                class="bg-[#494949] inline-flex items-center gap-1 pl-2 rounded-[5px]"
                :class="{
                  'bg-[#ff4264]':
                    bogusEmails.includes(em) ||
                    areEmailsValid.invalidEmails?.includes(em) ||
                    areEmailsValid.repeatedEmails?.includes(em),
                }"
              >
                <span class="text-[12px] ellipsis">{{ em }}</span>
                <button @click.stop="handleEmailRemove(index)" class="p-1">
                  <img
                    src="@/assets/images/icons/close.svg"
                    alt="close"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>
            <input
              v-if="emailsArr.length < 10"
              type="text"
              id="email-invite"
              class="bg-transparent w-full outline-none"
              placeholder="Enter email, comma separated"
              v-model="email"
              @input="hasStartedTyping = true"
            />
          </div>
          <span v-if="!areEmailsValid.valid" class="text-[10px] text-[#ff4264]">
            {{ areEmailsValid.message }}
          </span>
          <span
            v-else-if="bogusEmails.length"
            class="text-[10px] text-[#ff4264]"
          >
            Email addresses highlighted are problematic and won’t be sent
            invites
          </span>
        </div>
        <div class="flex justify-end">
          <button
            class="uppercase bg-white rounded-[5px] text-black text-sm font-[500] px-8 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="
              !areEmailsValid.valid ||
              bogusEmails.length > 0 ||
              !hasStartedTyping ||
              !emailsArr.length
            "
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </Overlay>
</template>
