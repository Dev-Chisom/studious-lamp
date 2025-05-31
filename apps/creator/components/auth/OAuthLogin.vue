<template>
	<div class="space-y-4">
		<button
			class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
			:disabled="loading || googleLoading"
			@click="loginWithGoogle"
		>
			<Icon name="logos:google-icon" class="h-5 w-5 mr-2" />
			<span v-if="googleLoading">
				<Icon name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
			</span>
			<span>
				{{ $t('auth.continueWithGoogle') }}
			</span>
		</button>
		<button
			class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
			:disabled="loading || twitterLoading"
			@click="loginWithTwitter"
		>
			<Icon name="logos:twitter" class="h-5 w-5 mr-2" />
			<span v-if="twitterLoading">
				<Icon name="lucide:loader-2" class="h-5 w-5 animate-spin mr-2" />
			</span>
			<span>
				{{ $t('auth.continueWithTwitter') }}
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOAuthUrl } from '@whispers/api';

const props = defineProps<{ loading: boolean }>();

const googleLoading = ref(false);
const twitterLoading = ref(false);

function loginWithGoogle(): void {
	if (!props.loading && !googleLoading.value) {
		googleLoading.value = true;
		window.location.href = getOAuthUrl('google');
	}
}

function loginWithTwitter(): void {
	if (!props.loading && !twitterLoading.value) {
		twitterLoading.value = true;
		window.location.href = getOAuthUrl('x');
	}
}
</script>
