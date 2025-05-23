<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="flex flex-col items-center">
        <img src="/logo.svg" alt="Logo" class="h-12 w-12 mb-2" />
        <h2 class="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('auth.signInTitle') }}</h2>
      </div>
      <div v-if="loading">{{ $t('common.loading') }}</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <OAuthLogin />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../store/auth';
import OAuthLogin from '@/components/auth/OAuthLogin.vue';
import { createAuthApi } from '@whispers/api';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  // If user is already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    await router.replace('/');
    return;
  }

  // Handle OAuth callback with tokens in query params
  const { accessToken, refreshToken } = route.query;
  
  if (accessToken && typeof accessToken === 'string') {
    loading.value = true;
    try {
      authStore.setTokens(accessToken, refreshToken);
      // Validate token
      const authApi = createAuthApi(accessToken);
      const profile = await authApi.getProfile();
      authStore.setProfile(profile);
      await router.replace('/');
    } catch (e) {
      try {
        const authApi = createAuthApi();
        const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken);
        authStore.setTokens(newAccessToken, refreshToken);
        const profile = await authApi.getProfile();
        authStore.setProfile(profile);
        await router.replace('/');
      } catch (refreshError) {
        error.value = t('auth.authenticationFailed');
        authStore.logout();
      }
    } finally {
      loading.value = false;
    }
  }
});
</script>