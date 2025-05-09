<template>
  <div>
    <Head>
      <Title>Create New Post - Whispers</Title>
    </Head>

    <div class="mb-6">
      <div class="flex items-center">
        <NuxtLink 
          to="/creator/content"
          class="mr-2 text-gray-500 hover:text-gray-700"
        >
          <Icon name="lucide:arrow-left" class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Create New Post</h1>
      </div>
      <p class="mt-1 text-sm text-gray-500">
        Share new content with your subscribers.
      </p>
    </div>

    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-6">
          <!-- Title -->
          <div>
            <FormInput
              v-model="post.title"
              label="Post Title"
              placeholder="Enter post title..."
              :error="errors.title"
              required
            />
          </div>

          <!-- Content -->
          <div>
            <label class="form-label">
              Post Content
              <span class="text-error-500 ml-1">*</span>
            </label>
            <textarea
              v-model="post.content"
              rows="5"
              placeholder="Write your post content here..."
              class="form-input"
              :class="errors.content ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''"
              required
            ></textarea>
            <p v-if="errors.content" class="form-error">{{ errors.content }}</p>
          </div>

          <!-- Media upload -->
          <div>
            <FormFileUpload
              v-model="mediaFiles"
              label="Media Files"
              accept="image/*,video/*"
              multiple
              :error="errors.mediaFiles"
            />
            <p class="mt-1 text-xs text-gray-500">
              Upload images or videos to share with your subscribers. Max 10 files.
            </p>
          </div>

          <!-- Post settings -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <!-- Visibility -->
            <div>
              <label class="form-label">
                Visibility
              </label>
              <div class="mt-2 space-y-3">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="visibility-public"
                      v-model="post.visibility"
                      type="radio"
                      value="public"
                      class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="visibility-public" class="font-medium text-gray-700">Public</label>
                    <p class="text-gray-500">Visible to everyone, including non-subscribers</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="visibility-subscribers"
                      v-model="post.visibility"
                      type="radio"
                      value="subscribers"
                      class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="visibility-subscribers" class="font-medium text-gray-700">Subscribers Only</label>
                    <p class="text-gray-500">Only visible to your paid subscribers</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="visibility-ppv"
                      v-model="post.visibility"
                      type="radio"
                      value="ppv"
                      class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="visibility-ppv" class="font-medium text-gray-700">Pay-per-view</label>
                    <p class="text-gray-500">Users must pay a one-time fee to access</p>
                  </div>
                </div>
              </div>
              <p v-if="errors.visibility" class="form-error mt-2">{{ errors.visibility }}</p>
            </div>

            <!-- Additional settings depending on visibility -->
            <div v-if="post.visibility === 'ppv'">
              <FormInput
                v-model="post.price"
                label="Price ($)"
                type="number"
                min="1"
                step="0.01"
                placeholder="4.99"
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
                  <label for="schedule" class="font-medium text-gray-700">Schedule for later</label>
                  <p class="text-gray-500">Set a future date and time to publish this post</p>
                </div>
              </div>

              <div v-if="isScheduled" class="mt-3">
                <FormInput
                  v-model="scheduledDate"
                  label="Publish Date"
                  type="datetime-local"
                  :min="minScheduleDate"
                  :error="errors.scheduledDate"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
          <button
            type="button"
            class="btn-outline"
            @click="$router.push('/creator/content')"
          >
            Cancel
          </button>
          <div class="flex space-x-2">
            <button
              type="button"
              class="btn-outline"
              @click="saveAsDraft"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="contentStore.loading"
            >
              <Icon v-if="contentStore.loading" name="lucide:loader-2" class="animate-spin h-5 w-5 mr-2" />
              {{ isScheduled ? 'Schedule Post' : 'Publish Now' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useContentStore } from '~/stores/content';
import FormFileUpload from '@/components/ui/FormFileUpload.vue'

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresCreator: true
  }
});

const router = useRouter();
const contentStore = useContentStore();
const toast = inject('toast');

// Form state
const post = reactive({
  title: '',
  content: '',
  visibility: 'public',
  price: 4.99,
  mediaUrls: []
});

const mediaFiles = ref([]);
const isScheduled = ref(false);
const scheduledDate = ref('');
const errors = reactive({
  title: '',
  content: '',
  mediaFiles: '',
  visibility: '',
  price: '',
  scheduledDate: ''
});

// Get minimum schedule date (current time + 10 minutes)
const minScheduleDate = computed(() => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  return date.toISOString().slice(0, 16);
});

// Methods
function validateForm() {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Title validation
  if (!post.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  } else if (post.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
    isValid = false;
  }
  
  // Content validation
  if (!post.content.trim()) {
    errors.content = 'Content is required';
    isValid = false;
  }
  
  // Media files validation
  if (mediaFiles.value.length > 10) {
    errors.mediaFiles = 'Maximum 10 files allowed';
    isValid = false;
  }
  
  // Price validation for PPV content
  if (post.visibility === 'ppv') {
    if (!post.price) {
      errors.price = 'Price is required for pay-per-view content';
      isValid = false;
    } else if (post.price < 1 || post.price > 100) {
      errors.price = 'Price must be between $1 and $100';
      isValid = false;
    }
  }
  
  // Schedule validation
  if (isScheduled.value) {
    if (!scheduledDate.value) {
      errors.scheduledDate = 'Please select a publish date';
      isValid = false;
    } else {
      const scheduleTime = new Date(scheduledDate.value).getTime();
      const minTime = new Date(minScheduleDate.value).getTime();
      
      if (scheduleTime < minTime) {
        errors.scheduledDate = 'Schedule time must be at least 10 minutes in the future';
        isValid = false;
      }
    }
  }
  
  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }
  
  try {
    // In a real app, you'd upload the media files first and get URLs
    // Here we'll just use fake URLs for demonstration
    post.mediaUrls = mediaFiles.value.map((_, index) => 
      `https://images.pexels.com/photos/${3000000 + index}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800`
    );
    
    // Add creator ID (would come from auth in real app)
    const postData = {
      ...post,
      creatorId: '123'
    };
    
    // Add scheduled date if set
    if (isScheduled.value && scheduledDate.value) {
      postData.scheduledFor = new Date(scheduledDate.value).toISOString();
    }
    
    const newPost = await contentStore.createPost(postData);
    
    toast.success(isScheduled.value ? 'Post scheduled successfully' : 'Post published successfully');
    router.push('/creator/content');
  } catch (error) {
    toast.error('Failed to create post. Please try again.');
  }
}

function saveAsDraft() {
  // In a real app, this would save the post as a draft
  toast.info('Draft saved successfully');
}
</script>