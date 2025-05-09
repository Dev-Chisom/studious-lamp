<template>
  <div>
    <Head>
      <Title>Reset Password - Whispers</Title>
    </Head>

    <div class="card p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Reset your password</h1>
        <p class="text-gray-600 mt-2">Please enter your new password.</p>
      </div>

      <div v-if="resetComplete" class="bg-success-50 border border-success-200 p-4 rounded-md mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="lucide:check-circle" class="h-5 w-5 text-success-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-success-800">
              Password reset successful!
            </p>
          </div>
        </div>
      </div>

      <form v-if="!resetComplete" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <FormInput
            v-model="password"
            label="New Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            icon="lucide:lock"
            required
            autofocus
          />

          <FormInput
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            icon="lucide:lock-check"
            required
          />

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.loading"
          >
            <Icon v-if="authStore.loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
            Reset Password
          </button>
        </div>
      </form>

      <div v-if="resetComplete" class="mt-6">
        <a href="https://studious-lamp-creator.vercel.app/auth/login" target="_blank" class="btn-primary w-full">
          Go to Login
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import FormInput from '@/components/ui/FormInput.vue'

definePageMeta({
  layout: 'auth'
});

const route = useRoute();
const authStore = useAuthStore();
const toast = inject('toast');

const token = route.params.token;
const password = ref('');
const confirmPassword = ref('');
const errors = reactive({
  password: '',
  confirmPassword: ''
});
const resetComplete = ref(false);

async function handleSubmit() {
  // Reset errors
  errors.password = '';
  errors.confirmPassword = '';
  
  // Simple validation
  let isValid = true;
  
  if (!password.value) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (password.value.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  }
  
  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    const success = await authStore.resetPassword(token, password.value);
    
    if (success) {
      resetComplete.value = true;
    } else {
      toast.error(authStore.error || 'Failed to reset password');
    }
  } catch (error) {
    toast.error('Failed to reset password. Please try again.');
  }
}
</script>