<template>
	<div class="container mx-auto max-w-6xl">
		<div>
			<h1 class="text-2xl font-bold mb-6">{{ $t('settings.title') }}</h1>

			<div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm divide-y divide-gray-200">
				<div class="p-6">
					<h2 class="text-lg font-medium mb-4">{{ $t('settings.profile.title') }}</h2>

					<div class="flex items-center space-x-6 mb-6">
						<div class="relative">
							<div class="avatar h-24 w-24">
								<img v-if="profileImage" :src="profileImage" alt="Profile" class="h-full w-full object-cover" />
								<div
									v-else
									class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-medium"
								>
									{{ userInitials }}
								</div>
							</div>
							<button
								class="absolute bottom-0 right-0 bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-sm border border-gray-200 text-gray-500 dark:text-gray-200 hover:text-gray-700"
								@click="$refs.imageInput.click()"
							>
								<Icon name="lucide:camera" class="h-4 w-4" />
							</button>
							<input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
						</div>

						<div>
							<p class="text-sm text-gray-500 dark:text-gray-200">
								{{ $t('settings.profile.pictureUpdated') }}
							</p>
						</div>
					</div>

					<form class="space-y-4" @submit.prevent="updateProfile">
						<FormInput v-model="profile.displayName" label="Display Name" :error="errors.displayName" required />

						<FormInput v-model="profile.username" label="Username" :error="errors.username" required />

						<div>
							<label class="form-label">{{ $t('settings.profile.bio') }}</label>
							<textarea
								v-model="profile.bio"
								rows="3"
								class="form-input"
								:class="errors.bio ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
							/>

							<p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
						</div>

						<div class="pt-4">
							<button type="submit" class="btn-primary" :disabled="loading">
								<Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
								{{ $t('settings.profile.updateProfile') }}
							</button>
						</div>
					</form>
				</div>

				<div class="p-6">
					<h2 class="text-lg font-medium mb-4">{{ $t('settings.email.title') }}</h2>

					<form class="space-y-4" @submit.prevent="updateEmail">
						<FormInput v-model="email.current" label="Current Email" type="email" disabled />

						<FormInput v-model="email.new" label="New Email" type="email" :error="errors.email" required />

						<FormInput
							v-model="email.password"
							label="Current Password"
							type="password"
							:error="errors.password"
							required
						/>

						<div class="pt-4">
							<button type="submit" class="btn-primary" :disabled="loading">
								<Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
								{{ $t('settings.email.updateEmail') }}
							</button>
						</div>
					</form>
				</div>

				<div class="p-6">
					<h2 class="text-lg font-medium mb-4">{{ $t('settings.password.title') }}</h2>

					<form class="space-y-4" @submit.prevent="updatePassword">
						<FormInput
							v-model="password.current"
							label="Current Password"
							type="password"
							:error="errors.currentPassword"
							required
						/>

						<FormInput
							v-model="password.new"
							label="New Password"
							type="password"
							:error="errors.newPassword"
							required
						/>

						<FormInput
							v-model="password.confirm"
							label="Confirm New Password"
							type="password"
							:error="errors.confirmPassword"
							required
						/>

						<div class="pt-4">
							<button type="submit" class="btn-primary" :disabled="loading">
								<Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
								{{ $t('settings.password.updatePassword') }}
							</button>
						</div>
					</form>
				</div>

				<div class="p-6">
					<h2 class="text-lg font-medium mb-4">{{ $t('settings.notifications.title') }}</h2>

					<div class="space-y-4">
						<div v-for="(pref, key) in notifications" :key="key" class="flex items-start">
							<div class="flex items-center h-5">
								<input
									:id="key"
									v-model="notifications[key]"
									type="checkbox"
									class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
							</div>

							<div class="ml-3 text-sm">
								<label :for="key" class="font-medium text-gray-700">{{ getNotificationLabel(key) }}</label>
								<p class="text-gray-500 dark:text-gray-200">{{ getNotificationDescription(key) }}</p>
							</div>
						</div>

						<div class="pt-4">
							<button class="btn-primary" :disabled="loading" @click="updateNotifications">
								<Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
								{{ $t('settings.notifications.savePreferences') }}
							</button>
						</div>
					</div>
				</div>

				<div class="p-6">
					<h2 class="text-lg font-medium text-error-600 mb-4">{{ $t('settings.deleteAccount.title') }}</h2>

					<p class="text-sm text-gray-500 dark:text-gray-200 mb-4">
						{{ $t('settings.deleteAccount.description') }}
					</p>

					<button class="btn-outline border-error-300 text-error-700 hover:bg-error-50" @click="confirmDeleteAccount">
						{{ $t('settings.deleteAccount.deleteAccount') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/store/user';
import { useAuthStore } from '~/store/auth';
import FormInput from '@/components/ui/BaseInput.vue';

const { t } = useI18n();

definePageMeta({
	middleware: ['auth'],
	layout: 'creator',
});

const userStore = useUserStore();
const authStore = useAuthStore();

const loading = ref(false);
const profileImage = ref(userStore.user?.profileImage || '');
const errors = ref({});

const profile = ref({
	displayName: userStore.user?.displayName || '',
	username: '',
	bio: '',
});

const email = ref({
	current: userStore.user?.email || '',
	new: '',
	password: '',
});

const password = ref({
	current: '',
	new: '',
	confirm: '',
});

const notifications = ref({
	newSubscriber: true,
	newMessage: true,
	newComment: true,
	newTip: true,
	marketing: false,
	newsletter: true,
});

const userInitials = computed(() => {
	const name = profile.value.displayName;
	if (!name) {
		return '?';
	}

	const parts = name.split(' ');
	if (parts.length > 1) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

function getNotificationLabel(key) {
	const labels = {
		newSubscriber: t('settings.notifications.newSubscriber'),
		newMessage: t('settings.notifications.newMessage'),
		newComment: t('settings.notifications.newComment'),
		newTip: t('settings.notifications.newTip'),
		marketing: t('settings.notifications.marketing'),
		newsletter: t('settings.notifications.newsletter'),
	};
	return labels[key] || key;
}

function getNotificationDescription(key) {
	const descriptions = {
		newSubscriber: t('settings.notifications.newSubscriberDesc'),
		newMessage: t('settings.notifications.newMessageDesc'),
		newComment: t('settings.notifications.newCommentDesc'),
		newTip: t('settings.notifications.newTipDesc'),
		marketing: t('settings.notifications.marketingDesc'),
		newsletter: t('settings.notifications.newsletterDesc'),
	};
	return descriptions[key] || '';
}

function handleImageUpload(event) {
	const file = event.target.files[0];
	if (!file) {
		return;
	}

	profileImage.value = URL.createObjectURL(file);
	toast.success('Profile picture updated');
}

function updateProfile() {
	loading.value = true;
	errors.value = {};

	try {
		if (!profile.value.displayName) {
			errors.value.displayName = 'Display name is required';
			return;
		}

		toast.success('Profile updated successfully');
	} catch {
		toast.error('Failed to update profile');
	} finally {
		loading.value = false;
	}
}

function updateEmail() {
	loading.value = true;
	errors.value = {};

	try {
		if (!email.value.new) {
			errors.value.email = 'New email is required';
			return;
		}
		if (!email.value.password) {
			errors.value.password = 'Password is required';
			return;
		}

		toast.success('Email updated successfully');
		email.value.current = email.value.new;
		email.value.new = '';
		email.value.password = '';
	} catch {
		toast.error('Failed to update email');
	} finally {
		loading.value = false;
	}
}

function updatePassword() {
	loading.value = true;
	errors.value = {};

	try {
		if (!password.value.current) {
			errors.value.currentPassword = 'Current password is required';
			return;
		}
		if (!password.value.new) {
			errors.value.newPassword = 'New password is required';
			return;
		}
		if (password.value.new !== password.value.confirm) {
			errors.value.confirmPassword = 'Passwords do not match';
			return;
		}

		toast.success('Password updated successfully');
		password.value = { current: '', new: '', confirm: '' };
	} catch {
		toast.error('Failed to update password');
	} finally {
		loading.value = false;
	}
}

function updateNotifications() {
	loading.value = true;

	try {
		toast.success('Notification preferences updated');
	} catch (error) {
		toast.error('Failed to update notification preferences');
	} finally {
		loading.value = false;
	}
}

function confirmDeleteAccount() {
	if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
		toast.success('Account deleted successfully');
		authStore.logout();
		navigateTo('/');
	}
}

onMounted(() => {
	try {
		profile.value.displayName = 'John Doe';
		profile.value.username = 'johndoe';
		profile.value.bio = 'Content creator and digital artist';
		profileImage.value = '/images/default-avatar.png';
	} catch (error) {
		console.log('Error loading profile:', error);
	}
});
</script>
