<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">Become a Creator</h1>
          <p class="mt-2 text-lg text-gray-600">
            Start sharing your content and building your community on Whispers
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8">
            <form @submit.prevent="submitApplication" class="space-y-6">
              <!-- Basic Information -->
              <div>
                <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div class="space-y-4">
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
                    <label class="form-label">
                      Bio
                      <span class="text-error-500 ml-1">*</span>
                    </label>
                    <textarea
                      v-model="form.bio"
                      rows="3"
                      placeholder="Tell your potential subscribers about yourself"
                      class="form-input"
                      :class="errors.bio ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
                      required
                    ></textarea>
                    <p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
                  </div>
                  
                  <div>
                    <label class="form-label">
                      Categories
                      <span class="text-error-500 ml-1">*</span>
                    </label>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <button
                        v-for="category in availableCategories"
                        :key="category"
                        type="button"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm"
                        :class="form.categories.includes(category)
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
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
                    <p v-if="errors.categories" class="form-error">{{ errors.categories }}</p>
                  </div>
                </div>
              </div>

              <!-- Content & Pricing -->
              <div class="pt-6 border-t border-gray-200">
                <h2 class="text-xl font-semibold mb-4">Content & Pricing</h2>
                
                <div class="space-y-4">
                  <div>
                    <label class="form-label">
                      What type of content will you share?
                      <span class="text-error-500 ml-1">*</span>
                    </label>
                    <textarea
                      v-model="form.contentDescription"
                      rows="3"
                      placeholder="Describe the type of content you plan to share with your subscribers"
                      class="form-input"
                      :class="errors.contentDescription ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
                      required
                    ></textarea>
                    <p v-if="errors.contentDescription" class="form-error">{{ errors.contentDescription }}</p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      v-model="form.monthlyPrice"
                      type="number"
                      label="Monthly Subscription Price ($)"
                      placeholder="9.99"
                      min="4.99"
                      step="0.01"
                      :error="errors.monthlyPrice"
                      required
                    />
                    
                    <FormInput
                      v-model="form.yearlyPrice"
                      type="number"
                      label="Yearly Subscription Price ($)"
                      placeholder="99.99"
                      min="49.99"
                      step="0.01"
                      :error="errors.yearlyPrice"
                    />
                  </div>
                  
                  <p class="text-sm text-gray-500">
                    Recommended: Set your yearly price at a discount to encourage longer subscriptions.
                  </p>
                </div>
              </div>

              <!-- Social Media -->
              <div class="pt-6 border-t border-gray-200">
                <h2 class="text-xl font-semibold mb-4">Social Media</h2>
                
                <div class="space-y-4">
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
              </div>

              <!-- Terms and Conditions -->
              <div class="pt-6 border-t border-gray-200">
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
                      <label for="terms" class="font-medium text-gray-700">
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
                      <label for="age" class="font-medium text-gray-700">
                        I confirm that I am at least 18 years old
                      </label>
                      <p v-if="errors.isAdult" class="form-error">{{ errors.isAdult }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-6">
                <button
                  type="submit"
                  class="btn-primary w-full"
                  :disabled="loading"
                >
                  <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
                  Submit Application
                </button>
                
                <p class="mt-4 text-sm text-gray-500 text-center">
                  Applications are typically reviewed within 2-3 business days
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const toast = inject('toast');
const router = useRouter();

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
  social: {
    instagram: '',
    twitter: '',
    tiktok: ''
  },
  agreedToTerms: false,
  isAdult: false
});

const availableCategories = [
  'Art',
  'Music',
  'Gaming',
  'Fitness',
  'Education',
  'Photography',
  'Technology',
  'Fashion',
  'Cooking',
  'Lifestyle',
  'Travel',
  'Beauty'
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