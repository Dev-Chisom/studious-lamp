<template>
	<form @submit.prevent="onSubmit">
		<div class="p-6 space-y-6">
			<!-- Title -->

			<div>
				<form-input
					v-model="form.title"
					:label="t('postTitle')"
					:placeholder="t('enterPostTitle')"
					:error="errors.title"
					required
				/>
			</div>

			<!-- Content -->

			<div>
				<label class="form-label"> {{ t('postContent') }} <span class="text-error-500 ml-1">*</span> </label>
				<textarea
					v-model="form.content"
					rows="5"
					:placeholder="t('writePostContent')"
					class="form-input"
					:class="errors.content ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
					required
				/>

				<p v-if="errors.content" class="form-error">{{ errors.content }}</p>
			</div>

			<!-- Media upload -->

			<div>
				<form-file-upload
					v-model="mediaFiles"
					:label="t('mediaFiles')"
					accept="image/*,video/*"
					multiple
					:error="errors.mediaFiles"
				/>

				<p class="mt-1 text-xs text-gray-500 dark:text-gray-200">
					{{ t('uploadMediaHint') }}
				</p>
			</div>

			<!-- Post settings -->

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
				<!-- Visibility -->

				<div>
					<label class="form-label"> {{ t('visibility') }} </label>
					<div class="mt-2 space-y-3">
						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									id="visibility-public"
									v-model="form.visibility"
									type="radio"
									value="public"
									class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
							</div>

							<div class="ml-3 text-sm">
								<label for="visibility-public" class="font-medium text-gray-700 dark:text-gray-200">{{ t('public') }}</label>
								<p class="text-gray-500 dark:text-gray-200">{{ t('publicHint') }}</p>
							</div>
						</div>

						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									id="visibility-subscribers"
									v-model="form.visibility"
									type="radio"
									value="subscribers"
									class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
							</div>

							<div class="ml-3 text-sm">
								<label for="visibility-subscribers" class="font-medium text-gray-700 dark:text-gray-200">{{ t('subscribersOnly') }}</label>
								<p class="text-gray-500 dark:text-gray-200">{{ t('subscribersOnlyHint') }}</p>
							</div>
						</div>

						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									id="visibility-ppv"
									v-model="form.visibility"
									type="radio"
									value="ppv"
									class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
							</div>

							<div class="ml-3 text-sm">
								<label for="visibility-ppv" class="font-medium text-gray-700 dark:text-gray-200">{{ t('payPerView') }}</label>
								<p class="text-gray-500 dark:text-gray-200">{{ t('payPerViewHint') }}</p>
							</div>
						</div>
					</div>

					<p v-if="errors.visibility" class="form-error mt-2">{{ errors.visibility }}</p>
				</div>

				<!-- Additional settings depending on visibility -->

				<div v-if="form.visibility === 'ppv'">
					<form-input
						v-model="form.price"
						:label="t('price')"
						type="number"
						min="1"
						step="0.01"
						:placeholder="t('pricePlaceholder')"
						:error="errors.price"
						required
					/>
				</div>

				<!-- Schedule settings -->

				<div class="md:col-span-2">
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								id="schedule"
								v-model="isScheduled"
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
							/>
						</div>

						<div class="ml-3 text-sm">
							<label for="schedule" class="font-medium text-gray-700 dark:text-gray-200">{{ t('scheduleForLater') }}</label>
							<p class="text-gray-500 dark:text-gray-200">{{ t('scheduleHint') }}</p>
						</div>
					</div>

					<div v-if="isScheduled" class="mt-3">
						<form-input
							v-model="scheduledDate"
							:label="t('publishDate')"
							type="datetime-local"
							:min="minScheduleDate"
							:error="errors.scheduledDate"
							required
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-gray-50 dark:bg-gray-800 py-3 flex justify-between">
			<button type="button" class="btn-outline" @click="$emit('cancel')">{{ t('cancel') }}</button>
			<div class="flex space-x-2">
				<button type="button" class="btn-outline" @click="onDraft">{{ t('saveAsDraft') }}</button>
				<button type="submit" class="btn-primary" :disabled="loading">
					<Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
					{{ isScheduled ? t('schedulePost') : t('publishNow') }}
				</button>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import FormInput from '@/components/ui/BaseInput.vue';
import FormFileUpload from '@/components/ui/FormFileUpload.vue';

type Visibility = 'public' | 'subscribers' | 'ppv'

interface FormData {
	title: string
	content: string
	visibility: Visibility
	price: number
	mediaUrls: string[]
}

interface FormErrors {
	title?: string
	content?: string
	visibility?: string
	price?: string
	mediaFiles?: string
	scheduledDate?: string
}

interface PostFormProps {
	initialValues?: Partial<FormData>
	errors?: FormErrors
	loading?: boolean
	minScheduleDate?: string
}

interface PostFormEmits {
	(
		e: 'submit',
		data: FormData & {
			mediaFiles: File[]
			isScheduled: boolean
			scheduledDate: string
		},
	): void
	(
		e: 'draft',
		data: FormData & {
			mediaFiles: File[]
			isScheduled: boolean
			scheduledDate: string
		},
	): void
	(e: 'cancel'): void
}

const props = withDefaults(defineProps<PostFormProps>(), {
	initialValues: () => ({}),
	errors: () => ({}),
	loading: false,
	minScheduleDate: '',
});

const emit = defineEmits<PostFormEmits>();

const { t } = useI18n();

const form = reactive<FormData>({
	title: '',
	content: '',
	visibility: 'public',
	price: 4.99,
	mediaUrls: [],
});
const mediaFiles = ref<File[]>([]);
const isScheduled = ref(false);
const scheduledDate = ref('');

watch(
	() => props.initialValues,
	(val) => {
		if (val) {
			Object.assign(form, val);
			if (val.mediaUrls) {
				mediaFiles.value = val.mediaUrls.map((url) => new File([], url));
			}
		}
	},
	{ immediate: true },
);

function onSubmit(): void {
	emit('submit', {
		...form,
		mediaFiles: mediaFiles.value,
		isScheduled: isScheduled.value,
		scheduledDate: scheduledDate.value,
	});
}

function onDraft(): void {
	emit('draft', {
		...form,
		mediaFiles: mediaFiles.value,
		isScheduled: isScheduled.value,
		scheduledDate: scheduledDate.value,
	});
}
</script>
