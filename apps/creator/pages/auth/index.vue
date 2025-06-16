<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="flex flex-col items-center">
        <img src="/logo.svg" alt="Logo" class="h-12 w-12 mb-2" />
        <h2 class="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ $t('auth.signInTitle') }}
        </h2>
      </div>
      <OAuthLogin :loading="apiLoading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { createAuthApi } from '@whispers/api'
import { useI18n } from 'vue-i18n'
import { useNotification } from '../../composables/useNotifications'
import { useAuthStore } from '../../store/auth'
import { useApiRequest } from '../../composables/useApiRequest'
import OAuthLogin from '@/components/auth/OAuthLogin.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notification = useNotification()

function broadcastAuthEvent(type: string): void {
  if (typeof window !== 'undefined') {
    const authChannel = new BroadcastChannel('auth')
    authChannel.postMessage({ type })
    authChannel.close()
  }
}

async function authenticateAndSetProfile(accessToken: string, refreshToken?: string): Promise<void> {
  authStore.setTokens(accessToken, refreshToken)
  const authApi = createAuthApi(accessToken)
  const profile = await authApi.getProfile()
  authStore.setProfile(profile)
  notification.success(t('auth.loginSuccess'))
  broadcastAuthEvent('login')
  await router.replace('/')
}

const { execute: executeAuth, loading: apiLoading, error: apiError } = useApiRequest(
  async (accessToken: string, refreshToken?: string) => {
    try {
      await authenticateAndSetProfile(accessToken, refreshToken)
    } catch (error) {
      if (refreshToken && typeof refreshToken === 'string') {
        try {
          const authApi = createAuthApi()
          const { accessToken: newAccessToken } = await authApi.refreshToken(refreshToken)
          await authenticateAndSetProfile(newAccessToken, refreshToken)
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          notification.error(t('auth.loginFailed'))
          authStore.logout()
          throw refreshError
        }
      } else {
        console.error('Authentication failed:', error)
        notification.error(t('auth.loginFailed'))
        authStore.logout()
        throw error
      }
    }
  }
)

async function processAuthTokens(): Promise<void> {
  const { accessToken, refreshToken } = route.query
  
  if (!accessToken || typeof accessToken !== 'string') {
    return
  }
  await router.replace({ path: route.path })
  
  try {
    await executeAuth(accessToken, refreshToken as string)
  } catch (error) {
    console.error('Authentication process failed:', error)
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await router.replace('/')
    return
  }
  await processAuthTokens()
})
</script>