<template>
	<div class="min-h-screen flex flex-col">
		<NuxtLayout> <NuxtPage /> </NuxtLayout>
	</div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

// Initialize auth state from local storage on app start
const authStore = useAuthStore();
onMounted(() => {
	authStore.initAuth();
});
</script>
