<template>
  <div>
    <Head>
      <Title>Posts - Creator Dashboard</Title>
    </Head>

    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Posts</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage and create new posts for your subscribers.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink to="/creator/content/new" class="btn-primary">
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
          Create New Post
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormInput
          v-model="filters.search"
          placeholder="Search posts..."
          icon="lucide:search"
        />
        
        <select
          v-model="filters.visibility"
          class="form-input"
        >
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="subscribers">Subscribers Only</option>
          <option value="ppv">Pay-per-view</option>
        </select>
        
        <select
          v-model="filters.sortBy"
          class="form-input"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="earnings">Highest Earnings</option>
        </select>
      </div>
    </div>

    <!-- Posts list -->
    <div class="bg-white rounded-lg shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <Icon name="lucide:loader" class="h-8 w-8 mx-auto animate-spin text-primary-500" />
        <p class="mt-2 text-gray-500">Loading posts...</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="p-8 text-center">
        <Icon name="lucide:file-x" class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ filters.search ? 'Try adjusting your search or filters.' : 'Get started by creating your first post.' }}
        </p>
        <div class="mt-6">
          <NuxtLink to="/creator/content/new" class="btn-primary">
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Create New Post
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img
                        v-if="post.mediaUrls && post.mediaUrls[0]"
                        :src="post.mediaUrls[0]"
                        :alt="post.title"
                        class="h-10 w-10 rounded object-cover"
                      />
                      <div v-else class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                        <Icon name="lucide:file" class="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ post.title }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ truncateText(post.content, 50) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="badge"
                    :class="{
                      'badge-success': post.visibility === 'public',
                      'badge-primary': post.visibility === 'subscribers',
                      'badge-secondary': post.visibility === 'ppv'
                    }"
                  >
                    {{ post.visibility === 'ppv' ? 'Pay-per-view' : post.visibility }}
                  </span>
                  <div v-if="post.price" class="mt-1 text-sm text-gray-500">
                    ${{ post.price }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 space-y-1">
                    <div class="flex items-center">
                      <Icon name="lucide:eye" class="h-4 w-4 text-gray-400 mr-1" />
                      {{ post.views }} views
                    </div>
                    <div class="flex items-center">
                      <Icon name="lucide:heart" class="h-4 w-4 text-gray-400 mr-1" />
                      {{ post.likes }} likes
                    </div>
                    <div class="flex items-center">
                      <Icon name="lucide:message-square" class="h-4 w-4 text-gray-400 mr-1" />
                      {{ post.comments }} comments
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">${{ post.earnings.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500">
                    {{ post.purchases }} purchases
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(post.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      class="text-gray-400 hover:text-gray-500"
                      @click="editPost(post.id)"
                    >
                      <Icon name="lucide:pencil" class="h-5 w-5" />
                    </button>
                    <button
                      class="text-gray-400 hover:text-error-500"
                      @click="confirmDelete(post.id)"
                    >
                      <Icon name="lucide:trash-2" class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                class="btn-outline"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                Previous
              </button>
              <button
                class="btn-outline"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ endIndex }}</span>
                  of
                  <span class="font-medium">{{ totalPosts }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                  >
                    <Icon name="lucide:chevron-left" class="h-5 w-5" />
                  </button>
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                    :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-50'"
                    @click="currentPage = page"
                  >
                    {{ page }}
                  </button>
                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                  >
                    <Icon name="lucide:chevron-right" class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                <Icon name="lucide:alert-triangle" class="h-6 w-6 text-error-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Delete Post
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deletePost"
            >
              Delete
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContentStore } from '~/stores/content';

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresCreator: true
  }
});

const contentStore = useContentStore();
const toast = inject('toast');

// State
const loading = ref(true);
const filters = ref({
  search: '',
  visibility: '',
  sortBy: 'newest'
});
const currentPage = ref(1);
const itemsPerPage = 10;
const showDeleteModal = ref(false);
const postToDelete = ref(null);

// Mock data for posts
const posts = ref([
  {
    id: '1',
    title: 'Welcome to my page!',
    content: 'Thank you for supporting my content.',
    mediaUrls: ['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200'],
    visibility: 'public',
    views: 1234,
    likes: 89,
    comments: 12,
    earnings: 0,
    purchases: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Exclusive Content',
    content: 'This is premium content only for my subscribers.',
    mediaUrls: ['https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=200'],
    visibility: 'subscribers',
    views: 456,
    likes: 45,
    comments: 8,
    earnings: 0,
    purchases: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Premium Tutorial',
    content: 'Step-by-step guide available for purchase.',
    mediaUrls: ['https://images.pexels.com/photos/5417678/pexels-photo-5417678.jpeg?auto=compress&cs=tinysrgb&w=200'],
    visibility: 'ppv',
    price: 9.99,
    views: 789,
    likes: 67,
    comments: 15,
    earnings: 249.75,
    purchases: 25,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
]);

// Fetch posts on mount
onMounted(async () => {
  try {
    // In a real app, fetch posts from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    loading.value = false;
  } catch (error) {
    toast.error('Failed to load posts');
    loading.value = false;
  }
});

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value];
  
  // Apply search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search)
    );
  }
  
  // Apply visibility filter
  if (filters.value.visibility) {
    result = result.filter(post => post.visibility === filters.value.visibility);
  }
  
  // Apply sorting
  switch (filters.value.sortBy) {
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'popular':
      result.sort((a, b) => b.views - a.views);
      break;
    case 'earnings':
      result.sort((a, b) => b.earnings - a.earnings);
      break;
    default: // newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  return result;
});

const totalPosts = computed(() => filteredPosts.value.length);
const totalPages = computed(() => Math.ceil(totalPosts.value / itemsPerPage));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalPosts.value));

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// Methods
function truncateText(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function editPost(id) {
  navigateTo(`/creator/content/edit/${id}`);
}

function confirmDelete(id) {
  postToDelete.value = id;
  showDeleteModal.value = true;
}

async function deletePost() {
  try {
    // In a real app, make API call to delete post
    const index = posts.value.findIndex(post => post.id === postToDelete.value);
    if (index !== -1) {
      posts.value.splice(index, 1);
    }
    
    showDeleteModal.value = false;
    postToDelete.value = null;
    toast.success('Post deleted successfully');
  } catch (error) {
    toast.error('Failed to delete post');
  }
}
</script>