<template>
	<component
		:is="computedTag"
		:class="[
			'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
			sizeClasses,
			variantClasses,
			className,
		]"
		v-bind="buttonAttrs"
	>
		<Icon v-if="loading" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
		<Icon v-if="icon && !loading" :name="icon" class="mr-2 h-4 w-4" /> <slot />
	</component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	variant: {
		type: String,
		default: 'primary',
		validator: (val) => ['primary', 'secondary', 'outline', 'ghost', 'link', 'danger'].includes(val),
	},
	size: {
		type: String,
		default: 'default',
		validator: (val) => ['sm', 'default', 'lg', 'icon'].includes(val),
	},
	icon: {
		type: String,
		default: '',
	},
	loading: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	to: {
		type: [String, Object],
		default: undefined,
	},
	href: {
		type: String,
		default: undefined,
	},
	type: {
		type: String,
		default: 'button',
	},
	className: {
		type: String,
		default: '',
	},
});

const variantClasses = computed(() => {
	switch (props.variant) {
		case 'primary':
			return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
		case 'secondary':
			return 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500';
		case 'outline':
			return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500';
		case 'ghost':
			return 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500';
		case 'link':
			return 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto';
		case 'danger':
			return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
		default:
			return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
	}
});

const sizeClasses = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'h-8 px-3 text-xs';
		case 'default':
			return 'h-10 px-4 py-2 text-sm';
		case 'lg':
			return 'h-12 px-6 text-base';
		case 'icon':
			return 'h-10 w-10 p-0';
		default:
			return 'h-10 px-4 py-2 text-sm';
	}
});

const computedTag = computed(() => {
	if (props.to) {
		return 'NuxtLink';
	}
	if (props.href) {
		return 'a';
	}
	return 'button';
});

const buttonAttrs = computed(() => {
	const attrs = {};

	if (props.to) {
		attrs.to = props.to;
	} else if (props.href) {
		attrs.href = props.href;
	} else {
		attrs.type = props.type;
	}

	attrs.disabled = props.disabled || props.loading;

	return attrs;
});
</script>
