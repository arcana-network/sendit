<script lang="ts" setup>
// @ts-nocheck
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import ArrowIcon from "@/assets/images/icons/down-arrow.svg";

const props = defineProps({
  options: {
    type: Array,
    default: null,
  },
  displayField: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Object, Boolean],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  triggerStyle: {
    type: [String, Object, Array],
    default: "",
  },
  triggerClass: {
    type: String,
    default: "",
  },
  showTooltip: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

let value = ref(props.modelValue);
let isOpen = ref(false);

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
}

function onChange(option, ev) {
  value.value = option;
  emit("update:modelValue", option);
  emit("change", ev, option);
  toggle();
}

function clickListener() {
  isOpen.value = false;
}

onMounted(() => {
  document.body.addEventListener("click", clickListener);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", clickListener);
});

watch(
  () => props.modelValue,
  () => {
    value.value = props.modelValue;
  }
);
</script>

<template>
  <div
    class="custom-select"
    :class="{ open: isOpen, disabled }"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-disabled="disabled"
    @click.stop="toggle"
  >
    <div
      class="custom-select__trigger input"
      :class="triggerClass"
      :style="triggerStyle"
    >
      <span
        v-if="(!displayField && value) || value[displayField]"
        class="custom-select-value"
      >
        <span v-if="displayField">
          {{ value[displayField] }}
        </span>
        <span v-else>
          {{ value }}
        </span>
      </span>
      <span v-else class="text-white opacity-50">{{ placeholder }}</span>
      <img :src="ArrowIcon" alt="Select" class="w-4" />
    </div>
    <div class="custom-options" role="listbox" tabindex="-1">
      <span
        v-for="option in options"
        :key="option"
        role="option"
        :data-value="option"
        :aria-selected="option === value"
        class="custom-option"
        @click.stop="onChange(option, $event)"
      >
        <span
          v-if="props.displayField"
          :title="props.showTooltip ? option[props.displayField] : ''"
        >
          {{ option[props.displayField] }}
        </span>
        <span v-else :title="props.showTooltip ? option : ''">
          {{ option }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  min-width: 12em;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.custom-select__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-white);
  cursor: pointer;
}

.custom-options {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 9999;
  display: block;
  max-height: 10rem;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: none;
  visibility: hidden;
  border-top: 0;
  border-radius: 0 0 10px 10px;
  opacity: 0;
  transition: all 0.3s;
  padding: 8px;
  background: #272727;
}

.custom-select.open .custom-options {
  pointer-events: all;
  visibility: visible;
  opacity: 1;
}

.custom-option {
  position: relative;
  display: block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-grey);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  border-radius: 5px;
}

.custom-option:hover {
  border: 1px solid white;
}

.custom-option.selected {
  color: var(--text-white);
}

.custom-select.disabled .custom-select__trigger {
  cursor: not-allowed;
}

.custom-select.disabled .custom-select-value,
.custom-select.disabled {
  opacity: 0.6;
}
</style>
