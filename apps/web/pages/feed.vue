<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Feed header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Your Feed</h1>
        <button
          class="btn-outline"
          @click="sortBy = sortBy === 'latest' ? 'popular' : 'latest'"
        >
          <Icon
            :name="sortBy === 'latest' ? 'lucide:clock' : 'lucide:trending-up'"
            class="h-5 w-5 mr-2"
          />
          {{ sortBy === 'latest' ? 'Latest' : 'Popular' }}
        </button>
      </div>

      <!-- Posts -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader" class="h-8 w-8 mx-auto animate-spin text-primary-500" />
        <p class="mt-2 text-gray-500">Loading posts...</p>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <Icon name="lucide:users" class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
        <p class="mt-1 text-gray-500">
          Subscribe to creators to see their posts in your feed.
        </p>
        <NuxtLink to="/explore" class="btn-primary mt-4">
          Explore Creators
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="post in sortedPosts"
          :key="post.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <!-- Post header -->
          <div class="p-4 flex items-center space-x-3">
            <NuxtLink :to="`/creators/${post.creator.username}`" class="avatar h-10 w-10">
              <img
                :src="post.creator.profileImage"
                :alt="post.creator.displayName"
                class="h-full w-full object-cover"
              />
            </NuxtLink>
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <NuxtLink
                  :to="`/creators/${post.creator.username}`"
                  class="font-medium hover:text-primary-600"
                >
                  {{ post.creator.displayName }}
                </NuxtLink>
                <span v-if="post.creator.isVerified" class="ml-1 text-primary-500">
                  <Icon name="lucide:badge-check" class="h-4 w-4" />
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ formatTime(post.createdAt) }}</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600">
              <Icon name="lucide:more-horizontal" class="h-5 w-5" />
            </button>
          </div>

          <!-- Post content -->
          <div v-if="post.content" class="px-4 pb-4">
            <p class="text-gray-900 whitespace-pre-line">{{ post.content }}</p>
          </div>

          <!-- Media carousel -->
          <div v-if="post.media && post.media.length > 0" class="relative">
            <!-- Media items -->
            <div class="relative">
              <div
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${activeSlide[post.id] * 100}%)` }"
              >
                <div
                  v-for="(media, index) in post.media"
                  :key="index"
                  class="w-full flex-shrink-0"
                >
                  <!-- Image -->
                  <img
                    v-if="media.type === 'image'"
                    :src="media.url"
                    :alt="post.content"
                    class="w-full aspect-square object-cover cursor-pointer"
                    @click="openMediaPreview(post.media, index)"
                  />
                  
                  <!-- Video -->
                  <video
                    v-else-if="media.type === 'video'"
                    :src="media.url"
                    controls
                    class="w-full aspect-square object-cover"
                  ></video>
                </div>
              </div>

              <!-- Navigation arrows -->
              <button
                v-if="post.media.length > 1 && activeSlide[post.id] > 0"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
                @click="prevSlide(post.id)"
              >
                <Icon name="lucide:chevron-left" class="h-6 w-6" />
              </button>
              <button
                v-if="post.media.length > 1 && activeSlide[post.id] < post.media.length - 1"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
                @click="nextSlide(post.id)"
              >
                <Icon name="lucide:chevron-right" class="h-6 w-6" />
              </button>

              <!-- Dots indicator -->
              <div
                v-if="post.media.length > 1"
                class="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1"
              >
                <button
                  v-for="(_, index) in post.media"
                  :key="index"
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="index === activeSlide[post.id] ? 'bg-white' : 'bg-white/50'"
                  @click="setSlide(post.id, index)"
                ></button>
              </div>
            </div>
          </div>

          <!-- Post actions -->
          <div class="px-4 py-3 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  class="flex items-center text-gray-500 hover:text-primary-600"
                  @click="toggleLike(post)"
                >
                  <Icon
                    :name="post.isLiked ? 'lucide:heart-fill' : 'lucide:heart'"
                    :class="post.isLiked ? 'text-primary-600' : ''"
                    class="h-5 w-5 mr-1"
                  />
                  <span class="text-sm">{{ post.likes }}</span>
                </button>
                <button
                  class="flex items-center text-gray-500 hover:text-gray-600"
                  @click="showComments(post)"
                >
                  <Icon name="lucide:message-circle" class="h-5 w-5 mr-1" />
                  <span class="text-sm">{{ post.comments.length }}</span>
                </button>
                <button class="flex items-center text-gray-500 hover:text-gray-600">
                  <Icon name="lucide:share" class="h-5 w-5 mr-1" />
                  <span class="text-sm">Share</span>
                </button>
              </div>
              <div v-if="post.visibility === 'subscribers'" class="badge badge-primary">
                Subscribers Only
              </div>
            </div>

            <!-- Comments section -->
            <div v-if="post.showComments" class="mt-4 space-y-4">
              <div class="border-t border-gray-100 pt-4">
                <!-- Comment input -->
                <div class="flex space-x-3">
                  <div class="avatar h-8 w-8">
                    <img
                      :src="authStore.user?.profileImage"
                      :alt="authStore.user?.displayName"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="flex-1">
                    <form @submit.prevent="addComment(post)">
                      <input
                        v-model="newComments[post.id]"
                        type="text"
                        placeholder="Write a comment..."
                        class="form-input text-sm"
                      />
                    </form>
                  </div>
                </div>

                <!-- Comments list -->
                <div class="mt-4 space-y-4">
                  <div
                    v-for="comment in post.comments"
                    :key="comment.id"
                    class="flex space-x-3"
                  >
                    <div class="avatar h-8 w-8">
                      <img
                        :src="comment.user.profileImage"
                        :alt="comment.user.displayName"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <div class="bg-gray-50 rounded-lg px-4 py-2">
                        <div class="font-medium text-sm">{{ comment.user.displayName }}</div>
                        <p class="text-sm">{{ comment.content }}</p>
                      </div>
                      <div class="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                        <span>{{ formatTime(comment.createdAt) }}</span>
                        <button class="hover:text-primary-600">Like</button>
                        <button class="hover:text-primary-600">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="hasMorePosts" class="mt-8 text-center">
        <button
          class="btn-outline"
          :disabled="loadingMore"
          @click="loadMorePosts"
        >
          <Icon
            v-if="loadingMore"
            name="lucide:loader"
            class="animate-spin h-5 w-5 mr-2"
          />
          Load More
        </button>
      </div>
    </div>

    <!-- Media preview modal -->
    <div
      v-if="mediaModal.isOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      @click="closeMediaPreview"
    >
      <div class="relative max-w-6xl max-h-[90vh] p-4">
        <!-- Navigation arrows -->
        <button
          v-if="mediaModal.items.length > 1 && mediaModal.currentIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
          @click.stop="prevMediaPreview"
        >
          <Icon name="lucide:chevron-left" class="h-8 w-8" />
        </button>
        <button
          v-if="mediaModal.items.length > 1 && mediaModal.currentIndex < mediaModal.items.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
          @click.stop="nextMediaPreview"
        >
          <Icon name="lucide:chevron-right" class="h-8 w-8" />
        </button>

        <!-- Close button -->
        <button
          class="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full hover:bg-white/20"
          @click="closeMediaPreview"
        >
          <Icon name="lucide:x" class="h-6 w-6" />
        </button>

        <!-- Media content -->
        <img
          v-if="currentMedia.type === 'image'"
          :src="currentMedia.url"
          class="max-w-full max-h-[90vh] mx-auto"
          @click.stop
        />
        <video
          v-else-if="currentMedia.type === 'video'"
          :src="currentMedia.url"
          controls
          class="max-w-full max-h-[90vh] mx-auto"
          @click.stop
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
  meta: {
    requiresAuth: true
  }
});

const authStore = useAuthStore();
const loading = ref(true);
const loadingMore = ref(false);
const sortBy = ref('latest');
const activeSlide = ref({});
const newComments = ref({});

// Media preview modal state
const mediaModal = ref({
  isOpen: false,
  items: [],
  currentIndex: 0
});

// Mock posts data
const posts = ref([
  {
    id: '1',
    creator: {
      id: '123',
      displayName: 'Jane Smith',
      username: 'janesmith',
      profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      isVerified: true
    },
    content: 'Just wrapped up an amazing photoshoot! Here are some exclusive behind-the-scenes shots for my subscribers. 📸✨',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    visibility: 'subscribers',
    likes: 124,
    isLiked: false,
    comments: [
      {
        id: '1',
        user: {
          displayName: 'Mike Johnson',
          profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
        },
        content: 'Amazing work! Love the lighting in these shots.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ],
    showComments: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    creator: {
      id: '456',
      displayName: 'Alex Williams',
      username: 'alexwilliams',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      isVerified: false
    },
    content: 'New gaming setup tour! Check out my latest video 🎮',
    media: [
      {
        type: 'video',
        url: 'https://player.vimeo.com/external/394678700.sd.mp4?s=353646b8d6a0da48b40f6a3fe0e8f09797c1f5dd&profile_id=165&oauth2_token_id=57447761'
      }
    ],
    visibility: 'public',
    likes: 89,
    isLiked: true,
    comments: [],
    showComments: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  }
]);

// Computed
const sortedPosts = computed(() => {
  const sorted = [...posts.value];
  if (sortBy.value === 'popular') {
    sorted.sort((a, b) => b.likes - a.likes);
  } else {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return sorted;
});

const hasMorePosts = computed(() => {
  // In a real app, this would be based on pagination info from the API
  return false;
});

const currentMedia = computed(() => {
  return mediaModal.value.items[mediaModal.value.currentIndex] || {};
});

// Methods
function formatTime(date) {
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
    return new Date(date).toLocaleDateString();
  }
}

function toggleLike(post) {
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
}

function showComments(post) {
  post.showComments = !post.showComments;
}

async function addComment(post) {
  const content = newComments.value[post.id];
  if (!content?.trim()) return;
  
  const comment = {
    id: `comment-${Date.now()}`,
    user: {
      displayName: authStore.user?.displayName || 'Anonymous',
      profileImage: authStore.user?.profileImage || 'https://via.placeholder.com/200'
    },
    content,
    createdAt: new Date()
  };
  
  post.comments.push(comment);
  newComments.value[post.id] = '';
}

function prevSlide(postId) {
  if (activeSlide.value[postId] > 0) {
    activeSlide.value[postId]--;
  }
}

function nextSlide(postId) {
  const post = posts.value.find(p => p.id === postId);
  if (activeSlide.value[postId] < post.media.length - 1) {
    activeSlide.value[postId]++;
  }
}

function setSlide(postId, index) {
  activeSlide.value[postId] = index;
}

function openMediaPreview(items, index = 0) {
  mediaModal.value = {
    isOpen: true,
    items,
    currentIndex: index
  };
}

function closeMediaPreview() {
  mediaModal.value.isOpen = false;
}

function prevMediaPreview() {
  if (mediaModal.value.currentIndex > 0) {
    mediaModal.value.currentIndex--;
  }
}

function nextMediaPreview() {
  if (mediaModal.value.currentIndex < mediaModal.value.items.length - 1) {
    mediaModal.value.currentIndex++;
  }
}

async function loadMorePosts() {
  loadingMore.value = true;
  try {
    // In a real app, fetch more posts from API
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    loadingMore.value = false;
  }
}

// Initialize
onMounted(async () => {
  try {
    // In a real app, fetch posts from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Initialize active slide for each post
    posts.value.forEach(post => {
      activeSlide.value[post.id] = 0;
    });
  } finally {
    loading.value = false;
  }
});
</script>