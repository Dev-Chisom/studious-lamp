<script setup lang="ts">
defineProps<{
  active?: boolean;
  disabled?: boolean;
  label: string | number;
}>();
</script>

<template>
	<button
		type="button"
		:class="[
			'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
			'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
			active
				? 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400'
				: 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
			disabled
				? 'opacity-50 cursor-not-allowed'
				: 'hover:text-gray-900 dark:hover:text-white',
		]"
		:disabled="disabled"
		:aria-current="active ? 'page' : undefined"
	>
		{{ label }}
	</button>
</template>