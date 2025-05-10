<template>
  <div class="min-h-screen max-w-6xl mx-auto bg-gray-50 dark:bg-gray-800">
    <!-- Cover image -->
    <div class="h-64 bg-gray-200 relative">
      <img
        v-if="user.coverImage"
        :src="user.coverImage"
        alt="Cover"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile header -->
      <div class="relative -mt-24 mb-8">
        <div class="max-w-7xl mx-auto">
          <div class="sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <div class="avatar h-32 w-32 ring-4 ring-white">
                <img
                  v-if="user.profileImage"
                  :src="user.profileImage"
                  alt="Profile"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-4xl font-medium dark:bg-primary-900 dark:text-primary-200"
                >
                  {{ userInitials }}
                </div>
              </div>
            </div>
            <div class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div class="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 class="text-2xl font-bold text-gray-800 mt-2 dark:text-gray-100 truncate">
                  {{ user.displayName }}
                </h1>
              </div>
              <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  v-if="isCurrentUser"
                  class="btn-outline border-white text-white hover:bg-white dark:bg-gray-900/10"
                  @click="navigateTo('/settings')"
                >
                  <Icon name="lucide:settings" class="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
                <button
                  v-else
                  class="btn-primary"
                  @click="followUser"
                >
                  <Icon
                    :name="isFollowing ? 'lucide:user-minus' : 'lucide:user-plus'"
                    class="h-5 w-5 mr-2"
                  />
                  {{ isFollowing ? 'Unfollow' : 'Follow' }}
                </button>
              </div>
            </div>
          </div>
          <div class="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {{ user.displayName }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Profile content -->
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
              <div class="space-y-6">
                <!-- Bio -->
                <div>
                  <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">About</h2>
                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                    {{ user.bio || 'No bio yet.' }}
                  </div>
                </div>

                <!-- Stats -->
                <div class="border-t border-gray-200 pt-6">
                  <dl class="grid grid-cols-2 gap-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">Posts</dt>
                      <dd class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {{ user.stats.posts }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">Followers</dt>
                      <dd class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {{ user.stats.followers }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <!-- Social links -->
                <div class="border-t border-gray-200 pt-6">
                  <h2 class="text-sm font-medium text-gray-500 dark:text-gray-200 dark:text-gray-400">Social</h2>
                  <div class="mt-4 space-y-3">
                    <a
                      v-for="social in user.social"
                      :key="social.platform"
                      :href="social.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                    >
                      <Icon :name="`lucide:${social.icon}`" class="h-5 w-5 mr-2" />
                      <span class="text-sm">{{ social.handle }}</span>
                    </a>
                  </div>
                </div>

                <!-- Joined date -->
                <div class="border-t border-gray-200 pt-6">
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                    <Icon name="lucide:calendar" class="h-5 w-5 mr-2" />
                    Joined {{ formatDate(user.joinedAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Create post -->
            <div v-if="isCurrentUser" class="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
              <div class="flex space-x-3">
                <div class="avatar h-10 w-10">
                  <img
                    v-if="user.profileImage"
                    :src="user.profileImage"
                    alt="Profile"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-lg font-medium dark:bg-primary-900 dark:text-primary-200"
                  >
                    {{ userInitials }}
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <textarea
                    v-model="newPost"
                    rows="3"
                    class="form-input"
                    placeholder="Share something with your followers..."
                  ></textarea>
                  <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
                        <Icon name="lucide:image" class="h-5 w-5" />
                      </button>
                      <button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
                        <Icon name="lucide:video" class="h-5 w-5" />
                      </button>
                      <button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
                        <Icon name="lucide:link" class="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      class="btn-primary"
                      :disabled="!newPost.trim()"
                      @click="createPost"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Posts -->
            <div v-if="posts.length > 0" class="space-y-6">
              <div
                v-for="post in posts"
                :key="post.id"
                class="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden"
              >
                <!-- Post header -->
                <div class="p-6">
                  <div class="flex space-x-3">
                    <div class="avatar h-10 w-10">
                      <img
                        :src="user.profileImage"
                        :alt="user.displayName"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ user.displayName }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                        {{ formatDate(post.createdAt) }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <button class="text-gray-400 hover:text-gray-500 dark:text-gray-200">
                        <Icon name="lucide:more-vertical" class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p class="mt-4 text-gray-900 dark:text-gray-100">{{ post.content }}</p>
                </div>

                <!-- Post media -->
                <div v-if="post.media" class="border-t border-gray-200">
                  <div class="aspect-w-16 aspect-h-9">
                    <img
                      :src="post.media"
                      :alt="post.content"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <!-- Post actions -->
                <div class="border-t border-gray-200 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button
                        class="flex items-center text-gray-500 dark:text-gray-200 hover:text-primary-600"
                        @click="toggleLike(post)"
                      >
                        <Icon
                          :name="'lucide:heart'"
                           :fill="post.isLiked ? 'currentColor' : 'none'"
                           :class="post.isLiked ? 'text-red-600' : 'text-gray-400'"
                           class="h-5 w-5 mr-1"
                        />
                        <span class="text-sm">{{ post.likes }}</span>
                      </button>
                      <button class="flex items-center text-gray-500 dark:text-gray-200 hover:text-gray-600">
                        <Icon name="lucide:message-circle" class="h-5 w-5 mr-1" />
                        <span class="text-sm">{{ post.comments }}</span>
                      </button>
                      <button class="flex items-center text-gray-500 dark:text-gray-200 hover:text-gray-600">
                        <Icon name="lucide:share" class="h-5 w-5 mr-1" />
                        <span class="text-sm">Share</span>
                      </button>
                    </div>
                    <button
                      v-if="isCurrentUser"
                      class="text-gray-400 hover:text-error-600"
                      @click="deletePost(post)"
                    >
                      <Icon name="lucide:trash-2" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-else
              class="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8 text-center"
            >
              <Icon name="lucide:file-text" class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                {{ isCurrentUser ? 'Get started by creating your first post.' : 'This user hasn\'t posted anything yet.' }}
              </p>
              <div v-if="isCurrentUser" class="mt-6">
                <button class="btn-primary">
                  <Icon name="lucide:plus" class="h-5 w-5 mr-2" />
                  Create New Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { toast } from 'vue3-toastify'

definePageMeta({
  layout: 'creator',
});

const authStore = useAuthStore();

// Mock user data
const user = ref({
  id: '123',
  displayName: 'John Doe',
  username: 'johndoe',
  profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  coverImage: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  bio: 'Digital creator sharing my journey and experiences. Love photography, travel, and good coffee.',
  stats: {
    posts: 42,
    followers: 1234
  },
  social: [
    {
      platform: 'twitter',
      handle: '@johndoe',
      url: 'https://twitter.com/johndoe',
      icon: 'twitter'
    },
    {
      platform: 'instagram',
      handle: '@johndoe',
      url: 'https://instagram.com/johndoe',
      icon: 'instagram'
    }
  ],
  joinedAt: new Date(2023, 0, 1)
});

// Mock posts data
const posts = ref([
  {
    id: '1',
    content: 'Just wrapped up an amazing photoshoot! Can\'t wait to share more with you all.',
    media: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    content: 'Beautiful sunset today. Sometimes you just need to stop and appreciate the little things.',
    media: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 56,
    comments: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
]);

// New post form
const newPost = ref('');

// Computed properties
const isCurrentUser = computed(() => {
  return authStore.user?.id === user.value.id;
});

const userInitials = computed(() => {
  const name = user.value.displayName;
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

const isFollowing = ref(false);

// Methods
function formatDate(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

async function createPost() {
  if (!newPost.value.trim()) return;
  
  try {
    // In a real app, make API call to create post
    const post = {
      id: `post-${Date.now()}`,
      content: newPost.value,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date()
    };
    
    posts.value.unshift(post);
    newPost.value = '';
    toast.success('Post created successfully');
  } catch (error) {
    toast.error('Failed to create post');
  }
}

function toggleLike(post) {
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
}

async function deletePost(post) {
  try {
    // In a real app, make API call to delete post
    const index = posts.value.findIndex(p => p.id === post.id);
    if (index !== -1) {
      posts.value.splice(index, 1);
    }
    toast.success('Post deleted successfully');
  } catch (error) {
    toast.error('Failed to delete post');
  }
}

function followUser() {
  isFollowing.value = !isFollowing.value;
  user.value.stats.followers += isFollowing.value ? 1 : -1;
  toast.success(isFollowing.value ? 'Following user' : 'Unfollowed user');
}
</script>