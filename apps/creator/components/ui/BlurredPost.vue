<template>
	<div class="relative w-full h-full">
		<slot />

		<div
			class="absolute inset-0 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 flex flex-col items-center justify-center text-center p-6"
		>
			<div class="max-w-xs mx-auto">
				<h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{{ $t('content.premium.title') }}</h3>

				<p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">{{ $t('content.premium.description') }}</p>
				<button variant="primary" class="px-4 py-2 text-sm" @click="emit('subscribe')">
					{{ $t('content.premium.subscribeNow') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(['subscribe']);
</script>
