<template>
	<input
		:value="localValue"
		:placeholder="placeholder"
		:type="type"
		class="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
		aria-label="Search"
		@input="onInput"
	/>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
const props = defineProps({
  modelValue: { type: String, default: '' },
  debounce: { type: Number, default: 300 },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
});
const emit = defineEmits(['update:modelValue']);
const localValue = ref(props.modelValue);
let timeout: ReturnType<typeof setTimeout> | null = null;

watch(() => props.modelValue, (val) => {
  if (val !== localValue.value) localValue.value = val;
});

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  localValue.value = value;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update:modelValue', value);
  }, props.debounce);
}
onBeforeUnmount(() => { if (timeout) clearTimeout(timeout); });
</script> 