<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Account Settings</h1>

      <div class="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        <!-- Profile section -->
        <div class="p-6">
          <h2 class="text-lg font-medium mb-4">Profile Information</h2>
          
          <div class="flex items-center space-x-6 mb-6">
            <div class="relative">
              <div class="avatar h-24 w-24">
                <img
                  v-if="profileImage"
                  :src="profileImage"
                  alt="Profile"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-medium"
                >
                  {{ userInitials }}
                </div>
              </div>
              <button
                class="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700"
                @click="$refs.imageInput.click()"
              >
                <Icon name="lucide:camera" class="h-4 w-4" />
              </button>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </div>
            
            <div>
              <p class="text-sm text-gray-500">
                Upload a new profile picture. Recommended size: 400x400px.
              </p>
            </div>
          </div>
          
          <form @submit.prevent="updateProfile" class="space-y-4">
            <FormInput
              v-model="profile.displayName"
              label="Display Name"
              :error="errors.displayName"
              required
            />
            
            <FormInput
              v-model="profile.username"
              label="Username"
              :error="errors.username"
              required
            />
            
            <div>
              <label class="form-label">Bio</label>
              <textarea
                v-model="profile.bio"
                rows="3"
                class="form-input"
                :class="errors.bio ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
              ></textarea>
              <p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
            </div>
            
            <div class="pt-4">
              <button type="submit" class="btn-primary" :disabled="loading">
                <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Email settings -->
        <div class="p-6">
          <h2 class="text-lg font-medium mb-4">Email Settings</h2>
          
          <form @submit.prevent="updateEmail" class="space-y-4">
            <FormInput
              v-model="email.current"
              label="Current Email"
              type="email"
              disabled
            />
            
            <FormInput
              v-model="email.new"
              label="New Email"
              type="email"
              :error="errors.email"
              required
            />
            
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
                Update Email
              </button>
            </div>
          </form>
        </div>

        <!-- Password settings -->
        <div class="p-6">
          <h2 class="text-lg font-medium mb-4">Change Password</h2>
          
          <form @submit.prevent="updatePassword" class="space-y-4">
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
                Update Password
              </button>
            </div>
          </form>
        </div>

        <!-- Notification preferences -->
        <div class="p-6">
          <h2 class="text-lg font-medium mb-4">Notification Preferences</h2>
          
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
                <p class="text-gray-500">{{ getNotificationDescription(key) }}</p>
              </div>
            </div>
            
            <div class="pt-4">
              <button
                @click="updateNotifications"
                class="btn-primary"
                :disabled="loading"
              >
                <Icon v-if="loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        <!-- Delete account -->
        <div class="p-6">
          <h2 class="text-lg font-medium text-error-600 mb-4">Delete Account</h2>
          
          <p class="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button
            @click="confirmDeleteAccount"
            class="btn-outline border-error-300 text-error-700 hover:bg-error-50"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import FormInput from '@/components/ui/FormInput.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true
  }
});

const authStore = useAuthStore();
const toast = inject('toast');

const loading = ref(false);
const profileImage = ref(authStore.user?.profileImage || '');
const errors = ref({});

// Profile form
const profile = ref({
  displayName: authStore.user?.displayName || '',
  username: '',
  bio: ''
});

// Email form
const email = ref({
  current: authStore.user?.email || '',
  new: '',
  password: ''
});

// Password form
const password = ref({
  current: '',
  new: '',
  confirm: ''
});

// Notification preferences
const notifications = ref({
  newSubscriber: true,
  newMessage: true,
  newComment: true,
  newTip: true,
  marketing: false,
  newsletter: true
});

const userInitials = computed(() => {
  const name = profile.value.displayName;
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

function getNotificationLabel(key) {
  const labels = {
    newSubscriber: 'New Subscribers',
    newMessage: 'Direct Messages',
    newComment: 'Comments on Posts',
    newTip: 'Tips and Donations',
    marketing: 'Marketing Updates',
    newsletter: 'Newsletter'
  };
  return labels[key];
}

function getNotificationDescription(key) {
  const descriptions = {
    newSubscriber: 'Get notified when someone subscribes to your content',
    newMessage: 'Receive notifications for new direct messages',
    newComment: 'Get notified when someone comments on your posts',
    newTip: 'Receive notifications for tips and donations',
    marketing: 'Receive updates about new features and promotions',
    newsletter: 'Subscribe to our weekly newsletter'
  };
  return descriptions[key];
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // In a real app, upload the file to a server
  // For now, create a local URL
  profileImage.value = URL.createObjectURL(file);
  toast.success('Profile picture updated');
}

async function updateProfile() {
  loading.value = true;
  errors.value = {};
  
  try {
    // Validate
    if (!profile.value.displayName) {
      errors.value.displayName = 'Display name is required';
      return;
    }
    
    // In a real app, make API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
  } finally {
    loading.value = false;
  }
}

async function updateEmail() {
  loading.value = true;
  errors.value = {};
  
  try {
    // Validate
    if (!email.value.new) {
      errors.value.email = 'New email is required';
      return;
    }
    if (!email.value.password) {
      errors.value.password = 'Password is required';
      return;
    }
    
    // In a real app, make API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Email updated successfully');
    email.value.current = email.value.new;
    email.value.new = '';
    email.value.password = '';
  } catch (error) {
    toast.error('Failed to update email');
  } finally {
    loading.value = false;
  }
}

async function updatePassword() {
  loading.value = true;
  errors.value = {};
  
  try {
    // Validate
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
    
    // In a real app, make API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Password updated successfully');
    password.value = { current: '', new: '', confirm: '' };
  } catch (error) {
    toast.error('Failed to update password');
  } finally {
    loading.value = false;
  }
}

async function updateNotifications() {
  loading.value = true;
  
  try {
    // In a real app, make API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Notification preferences updated');
  } catch (error) {
    toast.error('Failed to update notification preferences');
  } finally {
    loading.value = false;
  }
}

function confirmDeleteAccount() {
  // In a real app, show a confirmation modal
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // Handle account deletion
    toast.success('Account deleted successfully');
    authStore.logout();
    navigateTo('/');
  }
}
</script>