<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{{ $t('apply.title') }}</h1>
    <Form @submit="onSubmit" :validation-schema="applyFormSchema" v-slot="{ errors }" :initial-values="initialValues">
      <!-- Basic Information Section -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ $t('apply.basicInfo.title') }}</h2>
        <div class="space-y-6">
          <Field name="displayName" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.basicInfo.displayName')"
              :placeholder="$t('apply.basicInfo.displayNamePlaceholder')" :error="meta.touched && errors.displayName"
              required />
          </Field>

          <Field name="username" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.basicInfo.username')"
              :placeholder="$t('apply.basicInfo.usernamePlaceholder')" :error="meta.touched && errors.username" required />
          </Field>

          <Field name="bio" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="textarea" :label="$t('apply.basicInfo.bio')"
              :placeholder="$t('apply.basicInfo.bioPlaceholder')" :error="meta.touched && errors.bio" required />
          </Field>

          <Field name="categories" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="multiselect" :label="$t('apply.basicInfo.categories')"
              :placeholder="$t('apply.basicInfo.categoriesPlaceholder')" :error="meta.touched && errors.categories"
              :options="availableCategories" required />
          </Field>
        </div>
      </section>

      <!-- Social Media Section -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ $t('apply.social.title') }}</h2>
        <div class="space-y-6">
          <Field name="socialMedia.facebook" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.social.facebook')"
              :error="meta.touched && errors.socialMedia?.facebook" />
          </Field>

          <Field name="socialMedia.instagram" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.social.instagram')"
              :error="meta.touched && errors.socialMedia?.instagram" />
          </Field>

          <Field name="socialMedia.twitter" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.social.twitter')"
              :error="meta.touched && errors.socialMedia?.twitter" />
          </Field>

          <Field name="socialMedia.tiktok" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="text" :label="$t('apply.social.tiktok')"
              :error="meta.touched && errors.socialMedia?.tiktok" />
          </Field>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ $t('apply.pricing.title') }}</h2>
        <div class="space-y-6">
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ $t('apply.pricing.monthlySubscription') }}</h3>
            <div class="space-y-4">
              <Field name="monthlyPrice" v-slot="{ field, meta }">
                <FormInput v-model="field.value" v-bind="field" type="number" :label="$t('apply.pricing.monthlyPrice')"
                  placeholder="" min="4.99" step="0.01" :error="meta.touched && errors.monthlyPrice" required />
              </Field>

              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('apply.pricing.applyDiscount') }}:</label>
                <Field name="discounts.quarterly" v-slot="{ field }">
                  <select v-model="selectedPlan"
                    class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    @change="field.onChange">
                    <option v-for="plan in pricingOptions" :key="plan._id" :value="plan._id">
                      {{ plan.discount }}% ({{ plan.cycle }})
                    </option>
                  </select>
                </Field>
              </div>

              <FormInput :model-value="quarterlyPrice" type="number" :label="$t('apply.pricing.quarterlyPrice')"
                :placeholder="$t('apply.pricing.calculating')" readonly />
            </div>
          </div>
        </div>
      </section>

      <!-- Legal Section -->
      <section class="pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Legal</h2>
        <div class="space-y-6">
          <Field name="legal.acceptTerms" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="checkbox" :label="$t('apply.legal.acceptTerms')"
              :error="meta.touched && errors.legal?.acceptTerms" required />
          </Field>

          <Field name="legal.confirmAge" v-slot="{ field, meta }">
            <FormInput v-model="field.value" v-bind="field" type="checkbox" :label="$t('apply.legal.confirmAge')"
              :error="meta.touched && errors.legal?.confirmAge" required />
          </Field>
        </div>
      </section>

      <!-- Submit Button -->
      <div class="mt-8">
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? $t('common.loading') : $t('common.submit') }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import { object, string, array } from 'yup';
import FormInput from '../ui/BaseInput.vue';
import { ref, onMounted, watch } from 'vue';
import * as yup from 'yup';
import { createCreatorApi } from '@whispers/api';
import { useNotification } from '~/composables/useNotifications';
import { useI18n } from 'vue-i18n';
import type { SocialMediaLink, SocialMediaPlatform, CreatorApplicationPayload } from '@whispers/types';

interface PricingOption {
  _id: string;
  discount: number;
  cycle: string;
}

interface FormValues {
  displayName: string;
  username: string;
  bio: string;
  categories: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    tiktok: string;
  };
  monthlyPrice: number;
  discounts: {
    quarterly: string;
  };
  legal: {
    acceptTerms: boolean;
    confirmAge: boolean;
    contentGuidelines: boolean;
  };
}

const { t } = useI18n();
const notification = useNotification();
const availableCategories = [
  'Fitness', 'Lifestyle', 'Education', 'Entertainment',
  'Technology', 'Business', 'Health', 'Sports', 'Music', 'Art'
];
const isSubmitting = ref(false);
const quarterlyPrice = ref(0);
const pricingOptions = ref<PricingOption[]>([]);
const selectedPlan = ref<string | null>(null);

const initialValues: FormValues = {
  displayName: '',
  username: '',
  bio: '',
  categories: [],
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: ''
  },
  monthlyPrice: 0,
  discounts: {
    quarterly: pricingOptions.value[0]?._id || '',
  },
  legal: {
    acceptTerms: true,
    confirmAge: true,
    contentGuidelines: true
  }
};

const applyFormSchema = object({
  displayName: string().required(t('validation.required', { field: t('apply.basicInfo.displayName') })),
  username: string().required(t('validation.required', { field: t('apply.basicInfo.username') })),
  bio: string().required(t('validation.required', { field: t('apply.basicInfo.bio') })),
  categories: array()
    .min(1, t('validation.minCategories'))
    .required(t('validation.required', { field: t('apply.basicInfo.categories') })),
  socialMedia: object({
    facebook: string().optional(),
    instagram: string().optional(),
    twitter: string().optional(),
    tiktok: string().optional()
  }).test(
    'at-least-one-social',
    t('validation.atLeastOneSocial'),
    function (value) {
      const formContext = this.options.context;
      if (!formContext?.touchedSocial) {
        return true;
      }
      return Object.values(value || {}).some(val => val?.trim().length > 0);
    }
  ),
  monthlyPrice: yup.number()
    .typeError(t('validation.mustBeNumber'))
    .required(t('validation.required', { field: t('apply.pricing.monthlyPrice') }))
    .min(4.99, t('validation.minPrice'))
    .test(
      'is-valid-number',
      t('validation.mustBeValidNumber'),
      value => !isNaN(value) && value !== null && value !== undefined
    ),
  discounts: object({
    quarterly: string().required(),
  }),
  legal: object({
    acceptTerms: yup.boolean().oneOf([true], t('validation.mustAcceptTerms')),
    confirmAge: yup.boolean().oneOf([true], t('validation.mustConfirmAge')),
    contentGuidelines: yup.boolean().oneOf([true], t('validation.mustAcceptContentGuidelines')),
  }),
});

const formContext = ref({
  touchedSocial: false
});

function onSocialFieldBlur() {
  formContext.value.touchedSocial = true;
}

watch(
  () => initialValues.monthlyPrice,
  (newPrice: number) => {
    if (newPrice && selectedPlan.value) {
      calculatePeriodPrices(newPrice, selectedPlan.value);
    }
  },
  { immediate: true }
);

function calculatePeriodPrices(monthlyPrice: number, selectedDiscountId: string) {
  if (!monthlyPrice || !selectedDiscountId) return;

  const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
  const selectedOption = pricingOptions.value.find((opt: PricingOption) => opt._id === selectedDiscountId);

  if (selectedOption && selectedOption.cycle === "quarterly") {
    const monthlyDiscounted = monthlyPrice * (1 - (selectedOption.discount / 100));
    quarterlyPrice.value = roundToTwo(monthlyDiscounted * 3);
  }
}

const creatorApi = createCreatorApi();

async function onSubmit(values: FormValues) {
  try {
    isSubmitting.value = true;

    const socialMedia: SocialMediaLink[] = Object.entries(values.socialMedia || {})
      .filter(([_, value]) => value && typeof value === 'string' && value.trim().length > 0)
      .map(([platform, username]) => ({
        platform: platform.toLowerCase() as SocialMediaPlatform,
        username: (username as string).replace(/^@/, ''),
        url: `https://${platform.toLowerCase()}.com/${(username as string).replace(/^@/, '')}`
      }));

    const payload: CreatorApplicationPayload = {
      displayName: values.displayName.trim(),
      username: values.username.trim().toLowerCase(),
      bio: values.bio.trim(),
      categories: values.categories,
      socialMedia,
      pricing: {
        amount: values.monthlyPrice,
        models: [values.discounts.quarterly]
      },
      legal: {
        termsOfService: values.legal.acceptTerms,
        legallyAnAdult: values.legal.confirmAge,
        contentGuidelines: values.legal.contentGuidelines
      }
    };

    await creatorApi.createCreator(payload);
    notification.success(t('notifications.applicationSubmitted'));

  } catch (error: any) {
    notification.error(error.response?.data?.message || t('notifications.applicationFailed'));
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  try {
    const response = await creatorApi.getCreatorPreferences();
    pricingOptions.value = response.data;

    if (pricingOptions.value.length > 0) {
      selectedPlan.value = pricingOptions.value[0]._id;
    }
  } catch (error) {
    notification.error(t('notifications.preferencesFailed'));
  }
});
</script>