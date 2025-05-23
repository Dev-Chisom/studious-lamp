<template>
  <Form :validation-schema="applyFormSchema" @submit="onSubmit" :initial-values="initialValues"
    v-slot="{ errors, meta, values, setFieldValue, setTouched }" class="space-y-8" validate-on-input>
    <!-- Basic Information -->
    <section>
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.basicInfo.title') }}</h2>
      <div class="space-y-6">
        <Field name="displayName" v-slot="{ field, meta }">
          <FormInput v-model="field.value" :label="t('apply.basicInfo.displayName')" name="displayName"
            :placeholder="t('apply.basicInfo.displayNamePlaceholder')" v-bind="field"
            :error="meta.touched && errors.displayName" required />
        </Field>

        <Field name="username" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.basicInfo.username')" name="username"
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
        <Field name="social.facebook" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.facebook')" name="social.facebook"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:facebook"
            @blur="onSocialBlur(setFieldValue)" />
        </Field>

        <Field name="social.instagram" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.instagram')" name="social.instagram"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:instagram"
            @blur="onSocialBlur(setFieldValue)" />
        </Field>

        <Field name="social.twitter" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.twitter')" name="social.twitter"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:twitter"
            @blur="onSocialBlur(setFieldValue)" />
        </Field>

        <Field name="social.tiktok" v-slot="{ field, meta }">
          <FormInput v-model="field.value" v-bind="field" :label="t('apply.social.tiktok')" name="social.tiktok"
            :placeholder="t('apply.social.usernamePlaceholder')" icon="lucide:music"
            @blur="onSocialBlur(setFieldValue)" />
        </Field>
      </div>
      <ErrorMessage name="social" class="text-error-600 dark:text-error-400 mt-1" />
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
              name="monthlyPrice" placeholder="" min="4.99" step="0.01" :error="meta.touched && errors.monthlyPrice"
              required @input="calculatePeriodPrices(values.monthlyPrice, values.discounts)" />
          </Field>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ t('apply.pricing.subscriptionPlans') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(options, cycle) in preferencesByCycle" :key="cycle"
            class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <div class="flex md:items-center justify-between flex-col md:flex-row mb-3">
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">
                  {{ t('apply.pricing.' + cycle + 'Plan') }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('apply.pricing.' + cycle + 'Description') }}
                </p>
              </div>
              <!-- {{ options }} -->
              <Field :name="`discounts.${cycle}`" v-slot="{ field }">
                <select v-bind="field"
                  class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  @change="() => calculatePeriodPrices(values.monthlyPrice, values.discounts)">
                  <option v-for="option in options" :key="option._id" :value="option._id">
                    <!-- {{ t('apply.pricing.discount', { value: option.discount }) }} -->
                    {{ option?.discount }}%
                  </option>
                </select>
              </Field>
            </div>
            <FormInput :model-value="periodPrices[cycle]" type="number"
              :label="t('apply.pricing.total' + cycle.charAt(0).toUpperCase() + cycle.slice(1) + 'Price')"
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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '../ui/BaseInput.vue';
import { createCreatorApi } from '@whispers/api';
import { useNotification } from '../../composables/useNotifications';
import { ref as vueRef } from 'vue';

const { t } = useI18n();
const notification = useNotification();

// Define types
interface SocialFields {
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
}

interface FormValues {
  displayName: string;
  username: string;
  bio: string;
  categories: string[];
  social: SocialFields;
  monthlyPrice: number;
  discounts: Record<string, string>;
  acceptTerms: boolean;
  confirmAge: boolean;
  socialTouched: boolean;
}

// Define schema first
const applyFormSchema = yup.object({
  displayName: yup.string()
    .required(t('validation.displayNameRequired'))
    .min(2, t('validation.displayNameMin'))
    .max(50, t('validation.displayNameMax')),
  username: yup.string()
    .required(t('validation.usernameRequired'))
    .min(3, t('validation.usernameMin'))
    .max(30, t('validation.usernameMax'))
    .matches(/^[a-zA-Z0-9_-]+$/, t('validation.usernamePattern')),
  bio: yup.string()
    .required(t('validation.bioRequired'))
    .min(10, t('validation.bioMin'))
    .max(500, t('validation.bioMax')),
  categories: yup.array().of(yup.string()).min(1, t('apply.basicInfo.required')).required(),
  social: yup.object({
    facebook: yup.string(),
    instagram: yup.string(),
    twitter: yup.string(),
    tiktok: yup.string(),
  }).test(
    'at-least-one',
    t('validation.atLeastOneSocial'),
    function (value) {
      if (!this.parent.socialTouched) return true;
      return Object.values(value || {}).some(val => val?.trim());
    }
  ),
  socialTouched: yup.boolean().default(false),
  monthlyPrice: yup.number().required().min(4.99),
  discounts: yup.object(),
  acceptTerms: yup.boolean().oneOf([true], t('apply.basicInfo.required')),
  confirmAge: yup.boolean().oneOf([true], t('apply.basicInfo.required'))
});

// Form setup
const isSubmitting = ref(false);
const { handleSubmit, meta: formMeta, setTouched, setFieldValue } = useForm<FormValues>({
  validationSchema: applyFormSchema,
  initialValues: {
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
    discounts: {},
    acceptTerms: false,
    confirmAge: false,
    socialTouched: false
  },
});

// Categories logic
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

function toggleCategory(category: string, currentCategories: string[], handleChange: (categories: string[]) => void) {
  const newCategories = currentCategories.includes(category)
    ? currentCategories.filter((c: string) => c !== category)
    : [...currentCategories, category];
  handleChange(newCategories);
}

function removeCategory(category: string, currentCategories: string[], handleChange: (categories: string[]) => void) {
  handleChange(currentCategories.filter((c: string) => c !== category));
}

const creatorApi = createCreatorApi();

const pricingPreferences = ref<any[]>([]);
const preferencesByCycle = computed<Record<string, any[]>>(() => {
  const grouped: Record<string, any[]> = {};
  for (const pref of pricingPreferences.value) {
    if (!grouped[pref.cycle]) grouped[pref.cycle] = [];
    grouped[pref.cycle].push(pref);
  }
  return grouped;
});

const periodPrices = ref<Record<string, number>>({});

onMounted(async () => {
  try {
    const { data } = await creatorApi.getCreatorPreferences();
    pricingPreferences.value = data;
    for (const cycle in preferencesByCycle.value) {
      if (!preferencesByCycle.value[cycle]) continue;
      const zeroDiscount = preferencesByCycle.value[cycle].find((opt: any) => opt.discount === 0);
      if (zeroDiscount) {
        setFieldValue(`discounts.${cycle}`, zeroDiscount._id);
      } else if (preferencesByCycle.value[cycle][0]) {
        setFieldValue(`discounts.${cycle}`, preferencesByCycle.value[cycle][0]._id);
      }
    }
  } catch (e) {
    notification.error(t('notifications.preferencesFailed'));
  }
});

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
  monthlyPrice: 4.99,
  discounts: {},
  acceptTerms: false,
  confirmAge: false
};

const onSocialBlur = (setFieldValue: (field: keyof FormValues, value: any) => void) => {
  setFieldValue('socialTouched', true);
  // This will trigger validation for all social fields
  setTouched({
    'social.facebook': true,
    'social.instagram': true,
    'social.twitter': true,
    'social.tiktok': true
  });
};

function calculatePeriodPrices(monthlyPrice: number, discounts: Record<string, string>) {
  for (const cycle in discounts) {
    if (!preferencesByCycle.value[cycle]) continue;
    const selectedId = discounts[cycle];
    const option = preferencesByCycle.value[cycle]?.find((opt: any) => opt._id === selectedId);
    if (option) {
      let multiplier = 1;
      if (cycle === 'quarterly') multiplier = 3;
      if (cycle === 'yearly') multiplier = 12;
      // Add more cycles as needed
      periodPrices.value[cycle] = Math.round(monthlyPrice * multiplier * (1 - option.discount / 100) * 100) / 100;
    }
  }
}

async function onSubmit(values: FormValues) {
  try {
    isSubmitting.value = true;
    // ... your submit logic ...
    notification.success(t('notifications.applicationSubmitted'));
  } catch (error: any) {
    notification.error(error?.message || t('notifications.applicationFailed'));
  } finally {
    isSubmitting.value = false;
  }
}
</script>