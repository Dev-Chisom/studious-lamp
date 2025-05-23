<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
			<div class="flex flex-col items-center">
				<img src="/logo.svg" alt="Logo" class="h-12 w-12 mb-2" />
				<h2 class="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('auth.signInTitle') }}
				</h2>
			</div>
			<OAuthLogin :loading="apiLoading" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { createAuthApi } from '@whispers/api';
import { useI18n } from 'vue-i18n';
import { useApiRequest } from '../../composables/useApiRequest';
import { useNotification } from '../../composables/useNotifications';
import { useAuthStore } from '../../store/auth';
import OAuthLogin from '@/components/auth/OAuthLogin.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notification = useNotification();

const { loading: apiLoading, error: apiError } = useApiRequest(async () => Promise.resolve());

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await router.replace('/');
    return;
  }

  const { accessToken, refreshToken } = route.query;

  if (accessToken && typeof accessToken === 'string') {
    await router.replace({ path: route.path });

    apiLoading.value = true;
    try {
      authStore.setTokens(accessToken, refreshToken);
      const authApi = createAuthApi(accessToken);
      const profile = await authApi.getProfile();
      authStore.setProfile(profile);
      notification.success(t('auth.loginSuccess'));
      await router.replace('/');
    } catch {
      try {
        const authApi = createAuthApi();
        const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken);
        authStore.setTokens(newAccessToken, refreshToken);
        const profile = await authApi.getProfile();
        authStore.setProfile(profile);
        notification.success(t('auth.loginSuccess'));
        await router.replace('/');
      } catch {
        notification.error(apiError.value);
        authStore.logout();
      }
    } finally {
      apiLoading.value = false;
    }
  }
});
</script>