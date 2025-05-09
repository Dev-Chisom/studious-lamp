<template>
  <div>
    <Head>
      <Title>Forgot Password - Whispers</Title>
    </Head>

    <div class="card p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Forgot your password?</h1>
        <p class="text-gray-600 mt-2">Enter your email and we'll send you a reset link.</p>
      </div>

      <div v-if="emailSent" class="bg-success-50 border border-success-200 p-4 rounded-md mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="lucide:check-circle" class="h-5 w-5 text-success-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-success-800">
              Reset link sent! Please check your email.
            </p>
          </div>
        </div>
      </div>

      <form v-if="!emailSent" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <FormInput
            v-model="email"
            label="Email address"
            type="email"
            placeholder="your@email.com"
            :error="errors.email"
            icon="lucide:mail"
            required
            autofocus
          />

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.loading"
          >
            <Icon v-if="authStore.loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
            Send reset link
          </button>
        </div>
      </form>

      <div v-if="emailSent" class="mt-4">
        <button
          @click="resetForm"
          class="btn-outline w-full"
        >
          Send to a different email
        </button>
      </div>

      <p class="text-center mt-8 text-gray-600">
        Remembered your password?
        <a href="https://studious-lamp-creator.vercel.app/auth/login" target="_blank" class="text-primary-600 hover:text-primary-500 font-medium">
          Log in
        </a>
      </p>
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

const authStore = useAuthStore();
const toast = inject('toast');

const email = ref('');
const errors = reactive({
  email: ''
});
const emailSent = ref(false);

async function handleSubmit() {
  // Reset errors
  errors.email = '';
  
  // Simple validation
  if (!email.value) {
    errors.email = 'Email is required';
    return;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address';
    return;
  }
  
  try {
    const success = await authStore.forgotPassword(email.value);
    
    if (success) {
      emailSent.value = true;
    } else {
      toast.error(authStore.error || 'Failed to send reset email');
    }
  } catch (error) {
    toast.error('Failed to send reset email. Please try again.');
  }
}

function resetForm() {
  email.value = '';
  emailSent.value = false;
}
</script>