<template>
    <div class="min-h-screen max-w-6xl mx-auto">
        <Head>
            <Title>Become a Creator - Creator Dashboard</Title>
        </Head>
      <div class="container mx-auto px-4 py-8">
        <div>
          <div class="text-left mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Become a Creator</h1>
          </div>
  
          <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 sm:p-8">
              <form @submit.prevent="submitApplication" class="space-y-8">
                <!-- Basic Information -->
                <section>
                  <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Basic Information</h2>
                  
                  <div class="space-y-6">
                    <FormInput
                      v-model="form.displayName"
                      label="Display Name"
                      placeholder="How you'll appear to your subscribers"
                      :error="errors.displayName"
                      required
                    />
                    
                    <FormInput
                      v-model="form.username"
                      label="Username"
                      placeholder="Your unique username (e.g., johndoe)"
                      :error="errors.username"
                      required
                    />
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Bio
                        <span class="text-error-500">*</span>
                      </label>
                      <textarea
                        v-model="form.bio"
                        rows="3"
                        placeholder="Tell your potential subscribers about yourself"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
                        :class="errors.bio ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
                        required
                      ></textarea>
                      <p v-if="errors.bio" class="mt-1 text-sm text-error-500">{{ errors.bio }}</p>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Categories
                        <span class="text-error-500">*</span>
                      </label>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="category in availableCategories"
                          :key="category"
                          type="button"
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors"
                          :class="form.categories.includes(category)
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'"
                          @click="toggleCategory(category)"
                        >
                          {{ category }}
                          <Icon
                            v-if="form.categories.includes(category)"
                            name="lucide:x"
                            class="ml-1 h-4 w-4"
                            @click.stop="removeCategory(category)"
                          />
                        </button>
                      </div>
                      <p v-if="errors.categories" class="mt-1 text-sm text-error-500">{{ errors.categories }}</p>
                    </div>
                  </div>
                </section>
  
                <!-- Pricing -->
                <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Pricing</h2>
                  
                  <div class="space-y-6">
                    <div class="mb-8">
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly Subscription</h3>
                      <FormInput
                        v-model="form.monthlyPrice"
                        type="number"
                        label="Monthly Price ($)"
                        placeholder="9.99"
                        min="4.99"
                        step="0.01"
                        :error="errors.monthlyPrice"
                        required
                        @input="calculatePeriodPrices"
                      />
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Set your base monthly price. Other prices will be calculated automatically.
                      </p>
                    </div>

                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Subscription Plans</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <!-- Quarterly -->
                      <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
                        <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
                          <div>
                            <h4 class="font-medium text-gray-800 dark:text-gray-200">Quarterly Plan</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">3 months subscription</p>
                          </div>
                          <select 
                            v-model="form.discounts.quarterly"
                            class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            @change="calculatePeriodPrices"
                          >
                            <option value="0">0% discount</option>
                            <option value="10">10% discount</option>
                            <option value="15">15% discount</option>
                            <option value="20">20% discount</option>
                          </select>
                        </div>
                        <FormInput
                          v-model="form.quarterlyPrice"
                          type="number"
                          label="Total Quarterly Price"
                          placeholder="Calculating..."
                          step="0.01"
                          readonly
                        />
                      </div>

                      <!-- Bi-Annual -->
                      <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
                        <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
                          <div>
                            <h4 class="font-medium text-gray-800 dark:text-gray-200">Bi-Annual Plan</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">6 months subscription</p>
                          </div>
                          <select 
                            v-model="form.discounts.biAnnual"
                            class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            @change="calculatePeriodPrices"
                          >
                            <option value="0">0% discount</option>
                            <option value="15">15% discount</option>
                            <option value="20">20% discount</option>
                            <option value="25">25% discount</option>
                          </select>
                        </div>
                        <FormInput
                          v-model="form.biAnnualPrice"
                          type="number"
                          label="Total Bi-Annual Price"
                          placeholder="Calculating..."
                          step="0.01"
                          readonly
                        />
                      </div>

                      <!-- Annual -->
                      <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
                        <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
                          <div>
                            <h4 class="font-medium text-gray-800 dark:text-gray-200">Annual Plan</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">12 months subscription</p>
                          </div>
                          <select 
                            v-model="form.discounts.yearly"
                            class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            @change="calculatePeriodPrices"
                          >
                            <option value="0">0% discount</option>
                            <option value="20">20% discount</option>
                            <option value="25">25% discount</option>
                            <option value="30">30% discount</option>
                            <option value="35">35% discount</option>
                            <option value="40">40% discount</option>
                            <option value="50">50% discount</option>
                          </select>
                        </div>
                        <FormInput
                          v-model="form.yearlyPrice"
                          type="number"
                          label="Total Annual Price"
                          placeholder="Calculating..."
                          step="0.01"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </section>
  
                <!-- Social Media -->
                <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Social Media</h2>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <FormInput
                      v-model="form.social.facebook"
                      label="Facebook Username"
                      placeholder="@username"
                      icon="lucide:facebook"
                    />
                    
                    <FormInput
                      v-model="form.social.instagram"
                      label="Instagram Username"
                      placeholder="@username"
                      icon="lucide:instagram"
                    />
                    
                    <FormInput
                      v-model="form.social.twitter"
                      label="Twitter Username"
                      placeholder="@username"
                      icon="lucide:twitter"
                    />
                    
                    <FormInput
                      v-model="form.social.tiktok"
                      label="TikTok Username"
                      placeholder="@username"
                      icon="lucide:music"
                    />
                  </div>
                </section>
  
                <!-- Terms and Conditions -->
                <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div class="space-y-4">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input
                          id="terms"
                          v-model="form.agreedToTerms"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">
                          I agree to the
                          <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500">
                            Terms of Service
                          </NuxtLink>
                          and
                          <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500">
                            Content Guidelines
                          </NuxtLink>
                        </label>
                        <p v-if="errors.agreedToTerms" class="form-error">{{ errors.agreedToTerms }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input
                          id="age"
                          v-model="form.isAdult"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="age" class="font-medium text-gray-700 dark:text-gray-300">
                          I confirm that I am at least 18 years old
                        </label>
                        <p v-if="errors.isAdult" class="form-error">{{ errors.isAdult }}</p>
                        <p class="mt-4 text-sm text-gray-500 dark:text-gray-300 text-center">
                          Applications are typically reviewed within 2-3 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
  
                <div class="pt-6 flex justify-end">
                  <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">Submitting...</span>
                    <span v-else>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import FormInput from '@/components/ui/FormInput.vue'
  import { toast } from 'vue3-toastify'

  definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true
  }
});
  
  const authStore = useAuthStore();
  const router = useRouter();
  const isSubmitting = ref(false)
  const loading = ref(false);
  const errors = reactive({});
  
  const form = reactive({
    displayName: authStore.user?.displayName || '',
    username: '',
    bio: '',
    categories: [],
    contentDescription: '',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    quarterlyPrice: null,
    biAnnualPrice: null,
    yearlyPrice: null,
    discounts: {
      quarterly: 15, 
      biAnnual: 20, 
      yearly: 30
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: ''
    },
    agreedToTerms: false,
    isAdult: false
  });
  
  const availableCategories = [
    'Fitness',
    'Lifestyle',
    'Education',
    'Entertainment',
    'Technology',
    'Business',
    'Health',
    'Sports',
    'Music',
    'Art'
  ];
  
  function toggleCategory(category) {
    const index = form.categories.indexOf(category);
    if (index === -1) {
      if (form.categories.length < 3) {
        form.categories.push(category);
      } else {
        toast.error('Maximum 3 categories allowed');
      }
    } else {
      form.categories.splice(index, 1);
    }
  }
  
  function removeCategory(category) {
    const index = form.categories.indexOf(category);
    if (index !== -1) {
      form.categories.splice(index, 1);
    }
  }
  
  function calculatePeriodPrices() {
    const monthlyPrice = parseFloat(form.monthlyPrice) || 0;
    
    // Calculate quarterly price
    const quarterlyDiscount = parseInt(form.discounts.quarterly) / 100;
    form.quarterlyPrice = (monthlyPrice * 3 * (1 - quarterlyDiscount)).toFixed(2);
    
    // Calculate bi-annual price
    const biAnnualDiscount = parseInt(form.discounts.biAnnual) / 100;
    form.biAnnualPrice = (monthlyPrice * 6 * (1 - biAnnualDiscount)).toFixed(2);
    
    // Calculate annual price
    const yearlyDiscount = parseInt(form.discounts.yearly) / 100;
    form.yearlyPrice = (monthlyPrice * 12 * (1 - yearlyDiscount)).toFixed(2);
  }
  
  async function submitApplication() {
    loading.value = true;
    errors = {};
    
    try {
      // Validate form
      let isValid = true;
      
      if (!form.displayName) {
        errors.displayName = 'Display name is required';
        isValid = false;
      }
      
      if (!form.username) {
        errors.username = 'Username is required';
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
        errors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
        isValid = false;
      }
      
      if (!form.bio) {
        errors.bio = 'Bio is required';
        isValid = false;
      }
      
      if (form.categories.length === 0) {
        errors.categories = 'Please select at least one category';
        isValid = false;
      }
      
      if (!form.contentDescription) {
        errors.contentDescription = 'Content description is required';
        isValid = false;
      }
      
      if (!form.monthlyPrice || form.monthlyPrice < 4.99) {
        errors.monthlyPrice = 'Monthly price must be at least $4.99';
        isValid = false;
      }
      
      if (form.yearlyPrice && form.yearlyPrice < form.monthlyPrice * 10) {
        errors.yearlyPrice = 'Yearly price should offer at least a 15% discount';
        isValid = false;
      }
      
      if (!form.agreedToTerms) {
        errors.agreedToTerms = 'You must agree to the terms';
        isValid = false;
      }
      
      if (!form.isAdult) {
        errors.isAdult = 'You must be at least 18 years old';
        isValid = false;
      }
      
      if (!isValid) {
        loading.value = false;
        return;
      }
      
      // Submit application
      // In a real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Application submitted successfully!');
      router.push('/creator/dashboard');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      loading.value = false;
    }
  }
  </script>