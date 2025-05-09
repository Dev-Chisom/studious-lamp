<template>
  <div>
    <Head>
      <Title>Log in to Whispers</Title>
    </Head>

    <div class="card shadow-xl/20 p-8 dark:bg-gray-700">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Log in to your account</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Please enter your details.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <FormInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            :error="errors.email"
            icon="lucide:mail"
            required
            autofocus
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

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input 
                v-model="rememberMe" 
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <a href="https://studious-lamp-creator.vercel.app/auth/forgot-password" target="_blank" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.loading"
          >
            <Icon v-if="authStore.loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
            Log in
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
        Don't have an account yet?
        <NuxtLink to="https://studious-lamp-creator.vercel.app/auth/register" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
          Sign up
        </NuxtLink>
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
const route = useRoute();
const authStore = useAuthStore();
const toast = inject('toast');

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errors = reactive({
  email: '',
  password: ''
});

// If there's a redirect query parameter, we'll redirect there after login
const redirectPath = computed(() => route.query.redirect || '/');

async function handleSubmit() {
  // Reset errors
  errors.email = '';
  errors.password = '';
  
  // Simple validation
  let isValid = true;
  
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
  }
  
  if (!isValid) return;
  
  try {
    const success = await authStore.login(email.value, password.value, rememberMe.value);
    
    if (success) {
      toast.success('Successfully logged in!');
      navigateTo(redirectPath.value);
    } else {
      toast.error(authStore.error || 'Invalid email or password');
    }
  } catch (error) {
    toast.error('Login failed. Please try again.');
  }
}
</script>