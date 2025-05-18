<template>
  <Form :validation-schema="applyFormSchema" @submit="onSubmit" :initial-values="initialValues"
    v-slot="{ errors, meta, values }" class="space-y-8" validate-on-input>
    <!-- Basic Information -->
    <section>
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Basic Information</h2>
      <div class="space-y-6">
        <Field name="displayName" v-slot="{ field, meta }">
          <FormInput v-model="field.value" label="Display Name" placeholder="How you'll appear to your subscribers"
            v-bind="field" :error="meta.touched && errors.displayName" required />
        </Field>

        <Field name="username" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" label="Username"
            placeholder="Your unique username (e.g., johndoe)" :error="meta.touched && errors.username" required />
        </Field>

        <Field name="bio" v-slot="{ field, meta, handleChange }">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Bio <span class="form-error text-error-600 dark:text-error-400">*</span>
            </label>
            <textarea v-bind="field" @input="(e) => {
              field.onChange(e);
              handleChange(e);
            }" rows="3" placeholder="Tell your potential subscribers about yourself"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
              :class="{ 'border-error-500': meta.touched && errors.bio }" />
            <ErrorMessage name="bio" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
          </div>
        </Field>

        <Field name="categories" v-slot="{ value = [], handleChange }">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Categories (select at least one) <span class="form-error text-error-600 dark:text-error-400">*</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button v-for="cat in availableCategories" :key="cat" type="button"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors"
                :class="value.includes(cat)
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" @click="() => toggleCategory(cat, value, handleChange)">
                {{ cat }}
                <Icon v-if="value.includes(cat)" name="lucide:x" class="ml-1 h-4 w-4"
                  @click.stop="() => removeCategory(cat, value, handleChange)" />
              </button>
            </div>
            <ErrorMessage name="categories" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
          </div>
        </Field>
      </div>
    </section>

    <!-- Social Media -->
    <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Social Media</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="social.facebook" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" label="Facebook Username" placeholder="@username"
            icon="lucide:facebook" :error="meta.touched && errors.social?.facebook" />
        </Field>

        <Field name="social.instagram" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" label="Instagram Username" placeholder="@username"
            icon="lucide:instagram" :error="meta.touched && errors.social?.instagram" />
        </Field>

        <Field name="social.twitter" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" label="Twitter Username" placeholder="@username"
            icon="lucide:twitter" :error="meta.touched && errors.social?.twitter" />
        </Field>

        <Field name="social.tiktok" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" label="TikTok Username" placeholder="@username"
            icon="lucide:music" :error="meta.touched && errors.social?.tiktok" />
        </Field>
      </div>
      <ErrorMessage name="social" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
    </section>

    <!-- Pricing Section -->
    <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Pricing</h2>
      <div class="space-y-6">
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly Subscription</h3>
          <Field name="monthlyPrice" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="number" label="Monthly Price ($)" placeholder=""
              min="4.99" step="0.01" :error="meta.touched && errors.monthlyPrice" required
              @input="calculatePeriodPrices(values.monthlyPrice, values.discounts)" />
            <ErrorMessage name="monthlyPrice" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
          </Field>
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
              <Field name="discounts.quarterly" v-slot="{ field }">
                <select v-bind="field"
                  class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  @change="() => calculatePeriodPrices(values.monthlyPrice, values.discounts)">
                  <option value="0">0% discount</option>
                  <option value="10">10% discount</option>
                  <option value="15">15% discount</option>
                  <option value="20">20% discount</option>
                </select>
              </Field>
            </div>
            <FormInput :model-value="quarterlyPrice" type="number" label="Total Quarterly Price"
              placeholder="Calculating..." readonly />
          </div>

          <!-- Other plan types (Bi-Annual, Annual) would follow same pattern -->
          <!-- Bi-Annual -->
          <!-- <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">Bi-Annual Plan</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">6 months subscription</p>
              </div>
              <Field name="discounts.biAnnual" v-slot="{ field }">
                <select v-bind="field"
                  class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  @change="calculatePeriodPrices(values.monthlyPrice, values.discounts)">
                  <option value="0">0% discount</option>
                  <option value="15">15% discount</option>
                  <option value="20">20% discount</option>
                  <option value="25">25% discount</option>
                </select>
              </Field>
            </div>
            <FormInput v-model="biAnnualPrice" type="number" label="Total Bi-Annual Price" placeholder="Calculating..."
              step="0.01" readonly />
          </div> -->

          <!-- Annual -->
          <!-- <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">Annual Plan</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">12 months subscription</p>
              </div>
              <Field name="discounts.yearly" v-slot="{ field }">
                <select v-bind="field"
                  class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  @change="calculatePeriodPrices(values.monthlyPrice, values.discounts)">
                  <option value="0">0% discount</option>
                  <option value="20">20% discount</option>
                  <option value="25">25% discount</option>
                  <option value="30">30% discount</option>
                  <option value="35">35% discount</option>
                  <option value="40">40% discount</option>
                  <option value="50">50% discount</option>
                </select>
              </Field>
            </div>
            <FormInput v-model="yearlyPrice" type="number" label="Total Annual Price" placeholder="Calculating..."
              step="0.01" readonly />
          </div> -->
        </div>
      </div>
    </section>

    <section class="pt-8 border-t border-gray-200 dark:border-gray-700">

      <div class="flex items-start">
        <Field name="acceptTerms" type="checkbox" :value="true" :unchecked-value="false"
          v-slot="{ field, errorMessage, meta }">
          <div class="flex items-start mt-2">
            <div class="flex items-center h-5">
              <input type="checkbox" id="accept-terms" v-bind="field"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
            <div class="ml-3 text-sm">
              <label for="accept-terms" class="font-medium text-gray-700 dark:text-gray-300">I accept the terms and
                conditions</label>
              <div v-if="(meta.touched || meta.dirty) && errorMessage"
                class="text-sm form-error text-error-600 dark:text-error-400 mt-1">{{
                  errorMessage }}</div>
            </div>
          </div>
        </Field>
      </div>

      <Field name="confirmAge" type="checkbox" :value="true" :unchecked-value="false"
        v-slot="{ field, errorMessage, meta }" class="mt-4">
        <div class="flex items-start mt-2">
          <div class="flex items-center h-5">
            <input type="checkbox" id="confirm-age" v-bind="field"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          </div>
          <div class="ml-3 text-sm">
            <label for="confirm-age" class="font-medium text-gray-700 dark:text-gray-300">I confirm I am over 18</label>
            <div v-if="(meta.touched || meta.dirty) && errorMessage"
              class="text-sm form-error text-error-600 dark:text-error-400 mt-1">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </Field>

    </section>

    <div class="pt-6 flex justify-end">
      <button type="submit" :disabled="!meta.valid || isSubmitting"
        class="w-full sm:w-auto px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        :class="{
          'bg-primary-600 text-white hover:bg-primary-700': meta.valid,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !meta.valid
        }">
        <span v-if="isSubmitting">Processing...</span>
        <span v-else>Submit Application</span>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { object, string, array } from 'yup';
import FormInput from '../ui/BaseInput.vue';
import { ref, onMounted } from 'vue';
import * as yup from 'yup';
import { createCreatorApi } from '@whispers/api';
import { toast } from 'vue3-toastify';

const availableCategories = [
  'Fitness', 'Lifestyle', 'Education', 'Entertainment',
  'Technology', 'Business', 'Health', 'Sports', 'Music', 'Art'
];
const isSubmitting = ref(false);
const initialValues = {
  displayName: '',
  username: '',
  bio: '',
  categories: [],
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: ''
  },
  monthlyPrice: 0,
  discounts: {
    quarterly: 0,
    biAnnual: 0,
    yearly: 0
  },
  legal: {
    terms: false,
    isAdult: false
  }
};

const quarterlyPrice = ref(0);
const biAnnualPrice = ref(0);
const yearlyPrice = ref(0);

const applyFormSchema = object({
  displayName: string().required('Display name is required'),
  username: string().required('Username is required'),
  bio: string().required('Bio is required'),
  categories: array()
    .min(1, 'Select at least one category')
    .required('Categories are required'),
  social: object({
    facebook: string().optional(),
    instagram: string().optional(),
    twitter: string().optional(),
    tiktok: string().optional()
  }).test(
    'at-least-one-social',
    'Please provide at least one social media username',
    function (value) {

      const formContext = this.options.context;

      if (!formContext?.touchedSocial) {
        return true;
      }

      return Object.values(value || {}).some(val => val?.trim().length > 0);
    }
  ),
  monthlyPrice: yup.number()
    .typeError('Monthly price must be a number')
    .required('Monthly price is required')
    .min(4.99, 'Minimum price is $4.99')
    .test(
      'is-valid-number',
      'Monthly price must be a valid number',
      value => !isNaN(value) && value !== null && value !== undefined
    ),
  discounts: object({
    quarterly: string().required(),
    biAnnual: string().required(),
    yearly: string().required()
  }),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms'),
  confirmAge: yup.boolean().oneOf([true], 'You must confirm your age'),
});

const formContext = ref({
  touchedSocial: false
});

function onSocialFieldBlur() {
  formContext.value.touchedSocial = true;
}

function toggleCategory(cat: string, currentValue: string[], handleChange: (value: string[]) => void) {
  const newValue = currentValue.includes(cat)
    ? currentValue.filter(c => c !== cat)
    : [...currentValue, cat];
  handleChange(newValue);
}

function removeCategory(cat: string, currentValue: string[], handleChange: (value: string[]) => void) {
  handleChange(currentValue.filter(c => c !== cat));
}

function calculatePeriodPrices(monthlyPrice: number, discounts: any) {
  if (!monthlyPrice || !discounts) return;

  const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  quarterlyPrice.value = roundToTwo(monthlyPrice * 3 * (1 - (parseInt(discounts.quarterly || '0') / 100)));
  biAnnualPrice.value = roundToTwo(monthlyPrice * 6 * (1 - (parseInt(discounts.biAnnual || '0') / 100)));
  yearlyPrice.value = roundToTwo(monthlyPrice * 12 * (1 - (parseInt(discounts.yearly || '0') / 100)));
}

// async function onSubmit(values: any) {
//   try {
//     isSubmitting.value = true;

//     // Transform social to array of objects
//     const socialMedia = Object.entries(values.social || {})
//       .filter(([_, value]) => value && typeof value === 'string' && value.length > 0)
//       .map(([platform, username]) => ({
//         platform,
//         url: `https://${platform}.com/${(username as string).replace(/^@/, '')}`
//       }));

//     // Build pricing models array
//     const pricingModels = [
//       { discountType: quarterlyPrice.value, models: 'quarterly' },
//       { discountType: biAnnualPrice.value, models: 'biAnnual' },
//       { discountType: yearlyPrice.value, models: 'yearly' }
//     ];

//     // Build payload
//     const payload = {
//       displayName: values.displayName,
//       username: values.username,
//       bio: values.bio,
//       categories: values.categories,
//       socialMedia,
//       pricing: {
//         amount: values.monthlyPrice,
//         models: pricingModels
//       },
//       legal: {
//         termsOfService: values.acceptTerms,
//         contentGuidelines: true, // or set based on your form if needed
//         legallyAnAdult: values.confirmAge
//       }
//     };

//     const api = createCreatorApi();
//     const response = await api.createCreator(payload);
//     toast.success('Application submitted successfully!');
//     console.log('API response:', response);
//     // Optionally reset form or redirect
//   } catch (error: any) {
//     toast.error(error?.message || 'Failed to submit application');
//     console.error('Submission error:', error);
//   } finally {
//     isSubmitting.value = false;
//   }
// }

const creatorApi = createCreatorApi();

async function onSubmit(values: any) {
  try {
    isSubmitting.value = true;

    // Transform social media data
    const socialMedia = Object.entries(values.social || {})
      .filter(([_, value]) => value && typeof value === 'string' && value.trim().length > 0)
      .map(([platform, username]) => ({
        platform: platform.toLowerCase(),
        username: (username as string).replace(/^@/, ''),
        url: `https://${platform.toLowerCase()}.com/${(username as string).replace(/^@/, '')}`
      }));

    // Build pricing models
    const pricingModels = [
      {
        type: 'quarterly',
        amount: quarterlyPrice.value,
        discount: parseInt(values.discounts.quarterly) || 0
      },
      {
        type: 'biAnnual',
        amount: biAnnualPrice.value,
        discount: parseInt(values.discounts.biAnnual) || 0
      },
      {
        type: 'yearly',
        amount: yearlyPrice.value,
        discount: parseInt(values.discounts.yearly) || 0
      }
    ].filter(model => model.amount > 0);

    // Build the complete payload
    const payload = {
      displayName: values.displayName.trim(),
      username: values.username.trim().toLowerCase(),
      bio: values.bio.trim(),
      categories: values.categories,
      socialMedia,
      pricing: {
        monthly: values.monthlyPrice,
        models: pricingModels
      },
      legal: {
        termsAccepted: values.legal.terms,
        adultContent: values.legal.isAdult
      }
    };

    // Initialize API service and make the call
    // Add token if needed
    const response = await creatorApi.createCreator(payload);

    toast.success('Creator application submitted successfully!');
    console.log('API Response:', response);

    // Handle successful submission (reset form, redirect, etc.)

  } catch (error: any) {
    console.error('Submission Error:', error);
    toast.error(error.response?.data?.message || 'Failed to submit application');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  try {
    const response = await creatorApi.getCreatorPreferences()
    console.log(response.data, 'Creator preferences')
  } catch (error) {
    console.error('Failed to fetch creator preferences:', error)
  }
})
</script>