<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
			<div class="flex flex-col items-center">
				<img src="/logo.svg" alt="Logo" class="h-12 w-12 mb-2" />
				<h2 class="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Sign in to your account</h2>
			</div>

			<div class="space-y-4">
				<button
					class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
					@click="loginWithGoogle"
				>
					<Icon name="logos:google-icon" class="h-5 w-5 mr-2" /> Continue with Google
				</button>
				<button
					class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
					@click="loginWithTwitter"
				>
					<Icon name="logos:twitter" class="h-5 w-5 mr-2" /> Continue with Twitter
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();

// Types for OAuth providers
interface OAuthResponse {
	success: boolean
	error?: string
}

const loading = ref<boolean>(false);

async function loginWithGoogle(): Promise<void> {
	loading.value = true;
	try {
		// Replace with your actual Google OAuth logic
		// Example: await $auth.loginWith('google')
		// Simulate success
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success('Logged in with Google!');
		router.push('/');
	} catch (error) {
		toast.error('Google login failed.');
	} finally {
		loading.value = false;
	}
}

async function loginWithTwitter(): Promise<void> {
	loading.value = true;
	try {
		// Replace with your actual Twitter OAuth logic
		// Example: await $auth.loginWith('twitter')
		// Simulate success
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success('Logged in with Twitter!');
		router.push('/');
	} catch (error) {
		toast.error('Twitter login failed.');
	} finally {
		loading.value = false;
	}
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
