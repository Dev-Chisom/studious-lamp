<template>
	<div class="relative inline-block group">
		<slot />
		<span
			class="absolute z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200
             bg-gray-800 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap
             bottom-full left-1/2 transform -translate-x-1/2 mb-2"
		>
			{{ text }}
			<span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></span>
		</span>
	</div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>