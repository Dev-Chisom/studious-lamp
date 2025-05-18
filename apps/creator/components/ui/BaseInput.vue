<template>
	<div>
		<label v-if="label" :for="id" class="form-label">
			{{ label }} <span v-if="required" class="text-error-500 ml-1">*</span>
		</label>

		<div class="relative mt-1">
			<div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Icon :name="icon" class="h-5 w-5 text-gray-400 dark:text-gray-500 dark:text-gray-200" />
			</div>

			<input
				:id="id"
				ref="input"
				v-bind="$attrs"
				:value="modelValue"
				:type="inputType"
				:placeholder="placeholder"
				:class="[
					'form-input',
					icon ? 'pl-10' : '',
					error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '',
					'bg-white dark:bg-gray-900 text-gray-900 border-gray-300 placeholder-gray-400',
					'dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500',
				]"
				@input="$emit('update:modelValue', $event.target.value)"
			/>

			<div v-if="type === 'password' && showPasswordToggle" class="absolute inset-y-0 right-0 pr-3 flex items-center">
				<button
					type="button"
					class="text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 focus:outline-none"
					@click="togglePasswordVisibility"
				>
					<Icon :name="passwordVisible ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5" />
				</button>
			</div>
		</div>

		<p v-if="error" class="form-error text-error-600 dark:text-error-400">{{ error }}</p>

		<p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">{{ hint }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'

interface FormInputProps {
	modelValue?: string | number
	label?: string
	placeholder?: string
	type?: InputType
	id?: string
	error?: string | boolean 
	hint?: string
	icon?: string
	required?: boolean
	showPasswordToggle?: boolean
	autofocus?: boolean
}

interface FormInputEmits {
	(e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<FormInputProps>(), {
	modelValue: '',
	label: '',
	placeholder: '',
	type: 'text',
	id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
	error: '',
	hint: '',
	icon: '',
	required: false,
	showPasswordToggle: true,
	autofocus: false,
});

const emit = defineEmits<FormInputEmits>();

const input = ref<HTMLInputElement | null>(null);
const passwordVisible = ref(false);

const inputType = computed<InputType>(() => {
	if (props.type === 'password' && passwordVisible.value) {
		return 'text';
	}
	return props.type;
});

function togglePasswordVisibility(): void {
	passwordVisible.value = !passwordVisible.value;
}

onMounted(() => {
	if (props.autofocus && input.value) {
		input.value.focus();
	}
});
</script>
