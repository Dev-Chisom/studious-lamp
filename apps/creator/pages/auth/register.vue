<template>
  <div>
    <Head>
      <Title>Create an account - Whispers</Title>
    </Head>

    <div class="card p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Create an account</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Join Whispers to connect with creators and fans.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <FormInput
            v-model="displayName"
            label="Full Name"
            placeholder="John Doe"
            :error="errors.displayName"
            icon="lucide:user"
            required
            autofocus
          />

          <FormInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            :error="errors.email"
            icon="lucide:mail"
            required
          />

          <FormInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            icon="lucide:lock"
            required
          />

          <FormInput
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            icon="lucide:lock"
            required
          />

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="agreedToTerms"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-600 dark:text-gray-400">
                I agree to the
                <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Terms of Service
                </NuxtLink>
                and
                <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Privacy Policy
                </NuxtLink>
              </label>
              <p v-if="errors.agreedToTerms" class="text-error-600 dark:text-error-400 mt-1">
                {{ errors.agreedToTerms }}
              </p>
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.loading"
          >
            <Icon v-if="authStore.loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
            Create account
          </button>
        </div>
      </form>

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-200 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="btn-outline inline-flex items-center justify-center w-full"
          >
            <Icon name="lucide:globe-lock" class="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            class="btn-outline inline-flex items-center justify-center w-full"
          >
            <Icon name="lucide:twitter" class="h-5 w-5 mr-2" />
            Twitter
          </button>
        </div>
      </div>

      <p class="text-center mt-8 text-gray-600 dark:text-gray-400">
        Already have an account?
        <a href="https://studious-lamp-creator.vercel.app/auth/login" target="_blank" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
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

const router = useRouter();
const authStore = useAuthStore();
const toast = inject('toast');

const displayName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreedToTerms = ref(false);
const errors = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: ''
});

async function handleSubmit() {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Simple validation
  let isValid = true;
  
  if (!displayName.value) {
    errors.displayName = 'Full name is required';
    isValid = false;
  }
  
  if (!email.value) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
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
  
  if (!agreedToTerms.value) {
    errors.agreedToTerms = 'You must agree to the terms and privacy policy';
    isValid = false;
  }
  
  if (!isValid) return;
  
  try {
    const success = await authStore.register({
      displayName: displayName.value,
      email: email.value,
      password: password.value
    });
    
    if (success) {
      toast.success('Account created successfully!');
      router.push('/');
    } else {
      toast.error(authStore.error || 'Failed to create account');
    }
  } catch (error) {
    toast.error('Registration failed. Please try again.');
  }
}
</script>