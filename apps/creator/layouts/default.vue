<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
		<div class="fixed top-4 right-4 z-50">
			<LanguageSwitcher />
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts">
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
</script>
