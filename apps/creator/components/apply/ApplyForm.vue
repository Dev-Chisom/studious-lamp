<template>
  <Form :validation-schema="applyFormSchema" @submit="onSubmit" :initial-values="initialValues"
    v-slot="{ errors, meta, values }" class="space-y-8" validate-on-input>
    <!-- Basic Information -->
    <section>
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.basicInfo.title') }}</h2>
      <div class="space-y-6">
        <Field name="displayName" v-slot="{ field, meta }">
          <FormInput v-model="field.value" :label="t('apply.basicInfo.displayName')"
            :placeholder="t('apply.basicInfo.displayNamePlaceholder')" v-bind="field"
            :error="meta.touched && errors.displayName" required />
        </Field>

        <Field name="username" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.basicInfo.username')"
            :placeholder="t('apply.basicInfo.usernamePlaceholder')" :error="meta.touched && errors.username" required />
        </Field>

        <Field name="bio" v-slot="{ field, meta, handleChange }">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              {{ t('apply.basicInfo.bio') }} <span class="form-error text-error-600 dark:text-error-400">*</span>
            </label>
            <textarea v-bind="field" @input="(e) => {
              field.onChange(e);
              handleChange(e);
            }" rows="3" :placeholder="t('apply.basicInfo.bioPlaceholder')"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
              :class="{ 'border-error-500': meta.touched && errors.bio }" />
            <ErrorMessage name="bio" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
          </div>
        </Field>

        <Field name="categories" v-slot="{ value = [], handleChange }">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {{ t('apply.basicInfo.categories') }} <span class="form-error text-error-600 dark:text-error-400">*</span>
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
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.social.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="social.facebook" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.facebook')"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:facebook"
            :error="meta.touched && errors.social?.facebook" />
        </Field>

        <Field name="social.instagram" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.instagram')"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:instagram"
            :error="meta.touched && errors.social?.instagram" />
        </Field>

        <Field name="social.twitter" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.twitter')"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:twitter"
            :error="meta.touched && errors.social?.twitter" />
        </Field>

        <Field name="social.tiktok" v-slot="{ field, meta }" @blur="onSocialFieldBlur">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.tiktok')"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:music"
            :error="meta.touched && errors.social?.tiktok" />
        </Field>
      </div>
      <ErrorMessage name="social" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
    </section>

    <!-- Pricing Section -->
    <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.pricing.title') }}</h2>
      <div class="space-y-6">
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{
            t('apply.pricing.monthlySubscription') }}</h3>
          <Field name="monthlyPrice" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="number" :label="t('apply.pricing.monthlyPrice')"
              placeholder="" min="4.99" step="0.01" :error="meta.touched && errors.monthlyPrice" required
              @input="calculatePeriodPrices(values.monthlyPrice, values.discounts)" />
          </Field>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ t('apply.pricing.subscriptionPlans') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Quarterly -->
          <div class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ t('apply.pricing.quarterlyPlan') }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('apply.pricing.quarterlyDescription') }}</p>
              </div>
              <Field name="discounts.quarterly" v-slot="{ field }">
                <select v-bind="field"
                  class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  @change="() => calculatePeriodPrices(values.monthlyPrice, values.discounts)">
                  <option value="0">{{ t('apply.pricing.discount', { value: 0 }) }}</option>
                  <option value="10">{{ t('apply.pricing.discount', { value: 10 }) }}</option>
                  <option value="15">{{ t('apply.pricing.discount', { value: 15 }) }}</option>
                  <option value="20">{{ t('apply.pricing.discount', { value: 20 }) }}</option>
                </select>
              </Field>
            </div>
            <FormInput :model-value="quarterlyPrice" type="number" :label="t('apply.pricing.totalQuarterlyPrice')"
              :placeholder="t('apply.pricing.calculating')" readonly />
          </div>
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
              <label for="accept-terms" class="font-medium text-gray-700 dark:text-gray-300">{{
                t('apply.legal.acceptTerms') }}</label>
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
            <label for="confirm-age" class="font-medium text-gray-700 dark:text-gray-300">{{ t('apply.legal.confirmAge')
              }}</label>
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
        <span v-if="isSubmitting">{{ t('apply.submit.processing') }}</span>
        <span v-else>{{ t('apply.button') }}</span>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { ref, computed } from 'vue';
import type { Composer } from 'vue-i18n';
import { useI18n } from 'vue-i18n';
import { Form, Field, ErrorMessage } from 'vee-validate';
import FormInput from '../ui/BaseInput.vue';
import { createCreatorApi } from '@whispers/api';
import { useNotification } from '../../composables/useNotifications';

const { t } = useI18n() as Composer;
const notification = useNotification();

interface ApplyFormValues {
  displayName: string;
  username: string;
  bio: string;
  categories: string[];
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  monthlyPrice: number;
  discounts: {
    quarterly?: string;
    biAnnual?: string;
    yearly?: string;
  };
  acceptTerms: boolean;
  confirmAge: boolean;
}

const isSubmitting: Ref<boolean> = ref(false);
const quarterlyPrice: Ref<number> = ref(0);
const biAnnualPrice: Ref<number> = ref(0);
const yearlyPrice: Ref<number> = ref(0);

const applyFormSchema = {
  displayName: 'required|min:2|max:50',
  username: 'required|min:3|max:30|alpha_dash',
  bio: 'required|min:10|max:500',
  categories: 'required|min:1',
  'social.facebook': 'alpha_dash',
  'social.instagram': 'alpha_dash',
  'social.twitter': 'alpha_dash',
  'social.tiktok': 'alpha_dash',
  monthlyPrice: 'required|min_value:4.99',
  'discounts.quarterly': 'numeric|min_value:0|max_value:20',
  'discounts.biAnnual': 'numeric|min_value:0|max_value:25',
  'discounts.yearly': 'numeric|min_value:0|max_value:50',
  acceptTerms: 'required|accepted',
  confirmAge: 'required|accepted'
};

const initialValues: Partial<ApplyFormValues> = {
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
  monthlyPrice: 4.99,
  discounts: {
    quarterly: '0',
    biAnnual: '0',
    yearly: '0'
  },
  acceptTerms: false,
  confirmAge: false
};
const availableCategories = computed(() => [
  t('categories.art'),
  t('categories.music'),
  t('categories.photography'),
  t('categories.writing'),
  t('categories.technology'),
  t('categories.education'),
  t('categories.entertainment'),
  t('categories.lifestyle'),
  t('categories.sports'),
  t('categories.gaming')
]);

function toggleCategory(category: string, currentCategories: string[], handleChange: (value: string[]) => void) {
  const newCategories = currentCategories.includes(category)
    ? currentCategories.filter(c => c !== category)
    : [...currentCategories, category];
  handleChange(newCategories);
}

function removeCategory(category: string, currentCategories: string[], handleChange: (value: string[]) => void) {
  handleChange(currentCategories.filter(c => c !== category));
}

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}

function calculatePeriodPrices(monthlyPrice: number, discounts: { quarterly?: string; biAnnual?: string; yearly?: string }) {
  if (!monthlyPrice) return;

  quarterlyPrice.value = roundToTwo(monthlyPrice * 3 * (1 - (parseInt(discounts.quarterly || '0') / 100)));
  biAnnualPrice.value = roundToTwo(monthlyPrice * 6 * (1 - (parseInt(discounts.biAnnual || '0') / 100)));
  yearlyPrice.value = roundToTwo(monthlyPrice * 12 * (1 - (parseInt(discounts.yearly || '0') / 100)));
}

async function onSubmit(values: ApplyFormValues) {
  try {
    isSubmitting.value = true;

    // Transform social to array of objects
    const socialMedia = Object.entries(values.social || {})
      .filter(([_, value]) => value && typeof value === 'string' && value.length > 0)
      .map(([platform, username]) => ({
        platform,
        url: `https://${platform}.com/${(username as string).replace(/^@/, '')}`
      }));

    // Build pricing models array
    const pricingModels = [
      { discountType: quarterlyPrice.value, models: 'quarterly' },
      { discountType: biAnnualPrice.value, models: 'biAnnual' },
      { discountType: yearlyPrice.value, models: 'yearly' }
    ];

    // Build payload
    const payload = {
      displayName: values.displayName,
      username: values.username,
      bio: values.bio,
      categories: values.categories,
      socialMedia,
      pricing: {
        amount: values.monthlyPrice,
        models: pricingModels
      },
      legal: {
        termsOfService: values.acceptTerms,
        contentGuidelines: true,
        legallyAnAdult: values.confirmAge
      }
    };

    const api = createCreatorApi();
    const response = await api.createCreator(payload);
    notification.success(t('notifications.applicationSubmitted'));
    console.log('API response:', response);
  } catch (error: any) {
    notification.error(error?.message || t('notifications.applicationFailed'));
    console.error('Submission error:', error);
  } finally {
    isSubmitting.value = false;
  }
}

function onSocialFieldBlur() {
  // Implementation of onSocialFieldBlur function
}
</script>