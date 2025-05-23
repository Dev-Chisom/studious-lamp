<template>
  <div class="space-y-4">
    <button
      class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      @click="loginWithGoogle"
      :disabled="loading"
    >
      <Icon name="logos:google-icon" class="h-5 w-5 mr-2" /> {{ $t('auth.continueWithGoogle') }}
    </button>
    <button
      class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      @click="loginWithTwitter"
      :disabled="loading"
    >
      <Icon name="logos:twitter" class="h-5 w-5 mr-2" /> {{ $t('auth.continueWithTwitter') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOAuthUrl } from '@whispers/api';

const loading = ref<boolean>(false);

async function loginWithGoogle(): Promise<void> {
 loading.value = true;
  window.location.href = getOAuthUrl('google');
}

async function loginWithTwitter(): Promise<void> {
  loading.value = true;
  window.location.href = getOAuthUrl('x');
}
</script> 