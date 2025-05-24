<template>
	<Form
		v-slot="{ errors, meta, values, setFieldValue }"
		:validation-schema="applyFormSchema"
		:initial-values="initialValues"
		class="space-y-8"
		validate-on-input
		@submit="onSubmit"
	>
		<!-- Basic Information -->
		<section>
			<h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.basicInfo.title') }}</h2>
			<div class="space-y-6">
				<Field v-slot="{ field, meta }" name="displayName">
					<FormInput
						v-model="field.value"
						:label="t('apply.basicInfo.displayName')"
						name="displayName"
						:placeholder="t('apply.basicInfo.displayNamePlaceholder')"
						v-bind="field"
						:error="meta.touched && errors.displayName"
						required
					/>
				</Field>

				<Field v-slot="{ field, meta }" name="username">
					<FormInput
						v-model="field.value"
						v-bind="field"
						:label="t('apply.basicInfo.username')"
						name="username"
						:placeholder="t('apply.basicInfo.usernamePlaceholder')"
						:error="meta.touched && errors.username"
						required
					/>
				</Field>

				<Field v-slot="{ field, meta, handleChange }" name="bio">
					<div>
						<label class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
							{{ t('apply.basicInfo.bio') }} <span class="form-error text-error-600 dark:text-error-400">*</span>
						</label>
						<textarea
							v-bind="field"
							rows="3"
							:placeholder="t('apply.basicInfo.bioPlaceholder')"
							class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500"
							:class="{ 'border-error-500': meta.touched && errors.bio }"
							@input="
								(e) => {
									field.onChange(e)
									handleChange(e)
								}
							"
						/>
						<ErrorMessage name="bio" class="text-sm form-error text-error-600 dark:text-error-400 mt-1" />
					</div>
				</Field>

				<Field v-slot="{ value = [], handleChange }" name="categories">
					<div>
						<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
							{{ t('apply.basicInfo.categories') }} <span class="form-error text-error-600 dark:text-error-400">*</span>
						</label>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="cat in availableCategories"
								:key="cat"
								type="button"
								class="inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors"
								:class="
									value.includes(cat)
										? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
										: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
								"
								@click="() => toggleCategory(cat, value, handleChange)"
							>
								{{ cat }}
								<Icon
									v-if="value.includes(cat)"
									name="lucide:x"
									class="ml-1 h-4 w-4"
									@click.stop="() => removeCategory(cat, value, handleChange)"
								/>
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
				<Field v-slot="{ field }" name="social.facebook">
					<FormInput
						v-model="field.value"
						v-bind="field"
						:label="t('apply.social.facebook')"
						name="social.facebook"
						:placeholder="t('apply.social.usernamePlaceholder')"
						icon="lucide:facebook"
						@blur="onSocialBlur(setFieldValue)"
					/>
				</Field>

				<Field v-slot="{ field }" name="social.instagram">
					<FormInput
						v-model="field.value"
						v-bind="field"
						:label="t('apply.social.instagram')"
						name="social.instagram"
						:placeholder="t('apply.social.usernamePlaceholder')"
						icon="lucide:instagram"
						@blur="onSocialBlur(setFieldValue)"
					/>
				</Field>

				<Field v-slot="{ field }" name="social.twitter">
					<FormInput
						v-model="field.value"
						v-bind="field"
						:label="t('apply.social.twitter')"
						name="social.twitter"
						:placeholder="t('apply.social.usernamePlaceholder')"
						icon="lucide:twitter"
						@blur="onSocialBlur(setFieldValue)"
					/>
				</Field>

				<Field v-slot="{ field }" name="social.tiktok">
					<FormInput
						v-model="field.value"
						v-bind="field"
						:label="t('apply.social.tiktok')"
						name="social.tiktok"
						:placeholder="t('apply.social.usernamePlaceholder')"
						icon="lucide:music"
						@blur="onSocialBlur(setFieldValue)"
					/>
				</Field>
			</div>
			<ErrorMessage name="social" class="text-error-600 dark:text-error-400 mt-1" />
		</section>

		<!-- Pricing Section -->
		<section class="pt-8 border-t border-gray-200 dark:border-gray-700">
			<h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{{ t('apply.pricing.title') }}</h2>
			<div class="space-y-6">
				<div class="mb-8">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
						{{ t('apply.pricing.monthlySubscription') }}
					</h3>
					<Field v-slot="{ field, meta }" name="monthlyPrice">
						<FormInput
							v-model="field.value"
							v-bind="field"
							type="number"
							:label="t('apply.pricing.monthlyPrice')"
							name="monthlyPrice"
							placeholder=""
							min="4.99"
							step="0.01"
							:error="meta.touched && errors.monthlyPrice"
							required
							@input="calculatePeriodPrices(values.monthlyPrice, values.discounts)"
						/>
					</Field>
				</div>

				<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
					{{ t('apply.pricing.subscriptionPlans') }}
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div
						v-for="(options, cycle) in preferencesByCycle"
						:key="cycle"
						class="p-4 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm"
					>
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
							<Field v-slot="{ field }" :name="`discounts.${cycle}`">
								<select
									v-bind="field"
									class="border rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
									@change="() => calculatePeriodPrices(values.monthlyPrice, values.discounts)"
								>
									<option disabled value="">{{ t('common.select') }}</option>
									<option v-for="option in options" :key="option._id" :value="option._id">
										{{ option?.discount }}%
									</option>
								</select>
							</Field>
						</div>
						<FormInput
							:model-value="periodPrices[cycle]"
							type="number"
							:label="t('apply.pricing.total' + cycle.charAt(0).toUpperCase() + cycle.slice(1) + 'Price')"
							:placeholder="t('apply.pricing.calculating')"
							readonly
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="pt-8 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-start">
				<Field
					v-slot="{ field, errorMessage, meta }"
					name="acceptTerms"
					type="checkbox"
					:value="true"
					:unchecked-value="false"
				>
					<div class="flex items-start mt-2">
						<div class="flex items-center h-5">
							<input
								id="accept-terms"
								type="checkbox"
								v-bind="field"
								class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
							/>
						</div>
						<div class="ml-3 text-sm">
							<label for="accept-terms" class="font-medium text-gray-700 dark:text-gray-300">{{
								t('apply.legal.acceptTerms')
							}}</label>
							<div
								v-if="(meta.touched || meta.dirty) && errorMessage"
								class="text-sm form-error text-error-600 dark:text-error-400 mt-1"
							>
								{{ errorMessage }}
							</div>
						</div>
					</div>
				</Field>
			</div>

			<Field
				v-slot="{ field, errorMessage, meta }"
				name="confirmAge"
				type="checkbox"
				:value="true"
				:unchecked-value="false"
				class="mt-4"
			>
				<div class="flex items-start mt-2">
					<div class="flex items-center h-5">
						<input
							id="confirm-age"
							type="checkbox"
							v-bind="field"
							class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
					</div>
					<div class="ml-3 text-sm">
						<label for="confirm-age" class="font-medium text-gray-700 dark:text-gray-300">{{
							t('apply.legal.confirmAge')
						}}</label>
						<div
							v-if="(meta.touched || meta.dirty) && errorMessage"
							class="text-sm form-error text-error-600 dark:text-error-400 mt-1"
						>
							{{ errorMessage }}
						</div>
					</div>
				</div>
			</Field>
		</section>

		<div class="pt-6 flex justify-end">
			<button
				type="submit"
				:disabled="!meta.valid || apiLoading"
				class="w-full sm:w-auto px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
				:class="{
					'bg-primary-600 text-white hover:bg-primary-700': meta.valid && !apiLoading,
					'bg-primary-500 text-white cursor-wait': apiLoading,
					'bg-gray-300 text-gray-500 cursor-not-allowed': !meta.valid,
				}"
			>
				<template v-if="apiLoading">
					<Icon name="lucide:loader-2" class="h-5 w-5 animate-spin" />
					<span>{{ t('apply.processing') }}</span>
				</template>
				<template v-else>
					<Icon name="lucide:send" class="h-5 w-5" />
					<span>{{ t('apply.button') }}</span>
				</template>
			</button>
		</div>
	</Form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
import { createCreatorApi } from '@whispers/api'
import { useApiRequest } from '../../composables/useApiRequest'
import FormInput from '../ui/BaseInput.vue'
import { useNotification } from '../../composables/useNotifications'

const { t } = useI18n()
const notification = useNotification()

interface SocialFields {
	facebook: string
	instagram: string
	twitter: string
	tiktok: string
}

interface FormValues {
	displayName: string
	username: string
	bio: string
	categories: string[]
	social: SocialFields
	monthlyPrice: number
	discounts: Record<string, string>
	acceptTerms: boolean
	confirmAge: boolean
	socialTouched: boolean
}

const applyFormSchema = yup.object({
	displayName: yup
		.string()
		.required(t('validation.displayNameRequired'))
		.min(2, t('validation.displayNameMin'))
		.max(50, t('validation.displayNameMax')),
	username: yup
		.string()
		.required(t('validation.usernameRequired'))
		.min(3, t('validation.usernameMin'))
		.max(30, t('validation.usernameMax'))
		.matches(/^[a-zA-Z0-9_-]+$/, t('validation.usernamePattern')),
	bio: yup
		.string()
		.required(t('validation.bioRequired'))
		.min(10, t('validation.bioMin'))
		.max(500, t('validation.bioMax')),
	categories: yup.array().of(yup.string()).min(1, t('apply.basicInfo.required')).required(),
	social: yup
		.object({
			facebook: yup.string(),
			instagram: yup.string(),
			twitter: yup.string(),
			tiktok: yup.string(),
		})
		.test('at-least-one', t('validation.atLeastOneSocial'), function (value) {
			if (!this.parent.socialTouched) return true
			return Object.values(value || {}).some((val) => val?.trim())
		}),
	socialTouched: yup.boolean().default(false),
	monthlyPrice: yup.number().required().min(4.99),
	discounts: yup.object(),
	acceptTerms: yup.boolean().oneOf([true], t('apply.basicInfo.required')),
	confirmAge: yup.boolean().oneOf([true], t('apply.basicInfo.required')),
})

const { setTouched, setFieldValue } = useForm<FormValues>({
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
			tiktok: '',
		},
		monthlyPrice: 4.99,
		discounts: {},
		acceptTerms: false,
		confirmAge: false,
		socialTouched: false,
	},
})

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
	t('categories.gaming'),
])

function toggleCategory(category: string, currentCategories: string[], handleChange: (categories: string[]) => void) {
	const newCategories = currentCategories.includes(category)
		? currentCategories.filter((c: string) => c !== category)
		: [...currentCategories, category]
	handleChange(newCategories)
}

function removeCategory(category: string, currentCategories: string[], handleChange: (categories: string[]) => void) {
	handleChange(currentCategories.filter((c: string) => c !== category))
}

const creatorApi = createCreatorApi()
const { loading: apiLoading, error: apiError, execute: createCreator } = useApiRequest(creatorApi.createCreator)

const pricingPreferences = ref<any[]>([])
const preferencesByCycle = computed<Record<string, any[]>>(() => {
	const grouped: Record<string, any[]> = {}
	for (const pref of pricingPreferences.value) {
		if (!grouped[pref.cycle]) grouped[pref.cycle] = []
		grouped[pref.cycle].push(pref)
	}
	return grouped
})

const periodPrices = ref<Record<string, number>>({})

onMounted(async () => {
	try {
		const { data } = await creatorApi.getCreatorPreferences()
		pricingPreferences.value = data
		for (const cycle in preferencesByCycle.value) {
			if (!preferencesByCycle.value[cycle]) continue
			const zeroDiscount = preferencesByCycle.value[cycle].find((opt: any) => opt.discount === 0)
			if (zeroDiscount) {
				setFieldValue(`discounts.${cycle}`, zeroDiscount._id)
			} else if (preferencesByCycle.value[cycle][0]) {
				setFieldValue(`discounts.${cycle}`, preferencesByCycle.value[cycle][0]._id)
			}
		}
	} catch (e) {
		notification.error(t('notifications.preferencesFailed'))
	}
})

const initialValues = computed(() => {
	const discounts = {} as Record<string, string>

	for (const cycle in preferencesByCycle.value) {
		const zeroDiscount = preferencesByCycle.value[cycle].find((opt) => opt.discount === 0)
		discounts[cycle] = zeroDiscount?._id || preferencesByCycle.value[cycle][0]?._id
	}

	return {
		displayName: '',
		username: '',
		bio: '',
		categories: [],
		social: {
			facebook: '',
			instagram: '',
			twitter: '',
			tiktok: '',
		},
		monthlyPrice: 4.99,
		discounts,
		acceptTerms: false,
		confirmAge: false,
		socialTouched: false,
	}
})

const onSocialBlur = (setFieldValue: (field: keyof FormValues, value: any) => void) => {
	setFieldValue('socialTouched', true)
	setTouched({
		'social.facebook': true,
		'social.instagram': true,
		'social.twitter': true,
		'social.tiktok': true,
	})
}

function calculatePeriodPrices(monthlyPrice: number, discounts: Record<string, string>) {
	for (const cycle in discounts) {
		if (!preferencesByCycle.value[cycle]) continue
		const selectedId = discounts[cycle]
		const option = preferencesByCycle.value[cycle]?.find((opt: any) => opt._id === selectedId)
		if (option) {
			let multiplier = 1
			if (cycle === 'quarterly') multiplier = 3
			if (cycle === 'yearly') multiplier = 12
			periodPrices.value[cycle] = Math.round(monthlyPrice * multiplier * (1 - option.discount / 100) * 100) / 100
		}
	}
}

async function onSubmit(values: FormValues, { resetForm }: { resetForm: () => void }) {
	try {
		const allowedPlatforms = ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube'] as const
		const socialUrlMap = {
			facebook: (username: string) => `https://facebook.com/${username}`,
			instagram: (username: string) => `https://instagram.com/${username}`,
			twitter: (username: string) => `https://twitter.com/${username}`,
			tiktok: (username: string) => `https://tiktok.com/@${username}`,
			youtube: (username: string) => `https://youtube.com/${username}`,
		}
		const payload = {
			displayName: values.displayName,
			username: values.username,
			bio: values.bio,
			categories: values.categories,
			socialMedia: Object.entries(values.social)
				.filter(([platform, username]) => allowedPlatforms.includes(platform as any) && username && username.trim())
				.map(([platform, username]) => ({
					platform: platform as (typeof allowedPlatforms)[number],
					url: socialUrlMap[platform as keyof typeof socialUrlMap](username),
				})),
			pricing: {
				amount: values.monthlyPrice,
				models: Object.keys(preferencesByCycle.value).map((cycle) => {
					return values.discounts[cycle] || preferencesByCycle.value[cycle][0]?._id
				}),
			},
			legal: {
				termsOfService: values.acceptTerms,
				legallyAnAdult: values.confirmAge,
				contentGuidelines: values.acceptTerms,
			},
		}
		await createCreator(payload)
		notification.success(t('notifications.applicationSubmitted'))
		resetForm()

		setFieldValue('displayName', '')
		setFieldValue('username', '')
		setFieldValue('bio', '')
		setFieldValue('categories', [])
		setFieldValue('social', {
			facebook: '',
			instagram: '',
			twitter: '',
			tiktok: '',
		})
		setFieldValue('monthlyPrice', 4.99)
		setFieldValue('acceptTerms', false)
		setFieldValue('confirmAge', false)
		setFieldValue('socialTouched', false)

		Object.keys(preferencesByCycle.value).forEach((cycle) => {
			const zeroDiscount = preferencesByCycle.value[cycle].find((opt) => opt.discount === 0)
			setFieldValue(`discounts.${cycle}`, zeroDiscount?._id || preferencesByCycle.value[cycle][0]?._id)
		})
		for (const cycle in preferencesByCycle.value) {
			if (!preferencesByCycle.value[cycle]) continue
			const zeroDiscount = preferencesByCycle.value[cycle].find((opt: any) => opt.discount === 0)
			if (zeroDiscount) {
				setFieldValue(`discounts.${cycle}`, zeroDiscount._id)
			} else if (preferencesByCycle.value[cycle][0]) {
				setFieldValue(`discounts.${cycle}`, preferencesByCycle.value[cycle][0]._id)
			}
		}
		calculatePeriodPrices(initialValues.value.monthlyPrice, initialValues.value.discounts)
	} catch (error: any) {
		notification.error(apiError.value || t('notifications.applicationFailed'))
	} finally {
		apiLoading.value = false
	}
}
</script>
