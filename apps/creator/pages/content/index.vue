<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
    <Head>
      <Title>{{ t('content.management.title') }} - Whispers</Title>
    </Head>

    <!-- Header Section -->
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
      <div class="flex-1 min-w-0">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
          {{ t('content.management.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('content.management.description') }}
        </p>
      </div>

      <div class="flex-shrink-0">
        <NuxtLink 
          to="/content/new" 
          class="btn-primary w-full sm:w-auto flex items-center justify-center"
        >
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" /> 
          <span class="hidden sm:inline">{{ t('content.management.createNew') }}</span>
          <span class="sm:hidden">{{ t('content.management.createNew') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters Section -->
    <ContentFilters
      v-model:search="search"
      v-model:visibility-filter="visibilityFilter"
      class="mb-6"
    />

    <!-- Content Table Section -->
    <div class="mb-6">
      <ContentTable
        :content="paginatedContent"
        :loading="loading"
        @edit="editContent"
        @delete="confirmDelete"
      />
    </div>

    <!-- Pagination Section -->
    <div class="flex justify-center sm:justify-between items-center">
      <Pagination
        v-if="pagination.pages > 1"
        :current-page="page"
        :per-page="limit"
        :total-items="pagination.total"
        :per-page-options="[10, 20, 50, 100]"
        :show-end-buttons="true"
        :show-per-page="true"
        :show-range="true"
        class="w-full"
        @update:current-page="updatePage"
        @update:per-page="updateLimit"
      />
    </div>

    <!-- Delete Modal -->
    <DeleteContentModal
      v-model="showDeleteModal"
      :content="contentToDelete"
      :loading="deleteLoading"
      @confirm="deleteContent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '~/store/content'
import type { Content } from '~/types/content'
import Pagination from '~/components/ui/Pagination.vue'
import ContentFilters from '~/components/content/ContentFilters.vue'
import ContentTable from '~/components/content/ContentTable.vue'
import DeleteContentModal from '~/components/content/DeleteContentModal.vue'
import { useNotification } from '~/composables/useNotifications'
import { useApiRequest } from '~/composables/useApiRequest'

definePageMeta({
  layout: 'creator',
  middleware: ['auth'],
})

const { t } = useI18n()
const contentStore = useContentStore()
const { success, error } = useNotification()
const { loading: deleteLoading, execute: executeDelete } = useApiRequest(contentStore.deleteContent)

// Reactive state
const loading = ref<boolean>(true)
const search = ref<string>('')
const visibilityFilter = ref<string>('all')
const showDeleteModal = ref<boolean>(false)
const contentToDelete = ref<Content | null>(null)
const page = ref<number>(1)
const limit = ref<number>(10)

// Computed properties
const filteredContent = computed<Content[]>(() => {
  if (!contentStore.content?.posts || !Array.isArray(contentStore.content.posts)) {
    return []
  }
  
  let result = [...contentStore.content.posts]
  
  // Apply search filter
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase().trim()
    result = result.filter(content => 
      content.title?.toLowerCase().includes(searchTerm) ||
      content.description?.toLowerCase().includes(searchTerm) ||
      content.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Apply visibility filter
  if (visibilityFilter.value !== 'all') {
    result = result.filter(content => content.visibility === visibilityFilter.value)
  }
  
  return result
})

const paginatedContent = computed<Content[]>(() => {
  const start = (page.value - 1) * limit.value
  const end = start + limit.value
  return filteredContent.value.slice(start, end)
})

const pagination = computed(() => {
  const total = filteredContent.value.length
  const pages = Math.ceil(total / limit.value)
  
  return {
    total,
    pages,
    currentPage: page.value,
    perPage: limit.value
  }
})

// Methods
function editContent(content: Content): void {
  if (!content._id) {
    error(t('notifications.invalidContent'))
    return
  }
  navigateTo(`/content/edit/${content._id}`)
}

function confirmDelete(content: Content): void {
  if (!content._id) {
    error(t('notifications.invalidContent'))
    return
  }
  contentToDelete.value = content
  showDeleteModal.value = true
}

async function deleteContent(): Promise<void> {
  if (!contentToDelete.value?._id) {
    error(t('notifications.invalidContent'))
    return
  }
  
  try {
    await executeDelete(contentToDelete.value._id)
    success(t('notifications.contentDeleted'))
    showDeleteModal.value = false
    contentToDelete.value = null
    await contentStore.fetchContent() // Refresh content list after deletion
    if (paginatedContent.value.length === 0 && page.value > 1) {
      page.value = 1
    }
  } catch (err) {
    console.error('Error deleting content:', err)
    error(t('notifications.contentDeleteFailed'))
  }
}

function updatePage(newPage: number): void {
  page.value = newPage
}

function updateLimit(newLimit: number): void {
  limit.value = newLimit
  page.value = 1
}

async function loadContent(): Promise<void> {
  try {
    loading.value = true
    await contentStore.fetchContent()
  } catch (err) {
    console.error('Error loading content:', err)
    error(t('notifications.contentLoadFailed'))
  } finally {
    loading.value = false
  }
}

// Watchers
watch([search, visibilityFilter], () => {
  page.value = 1
})

// Lifecycle
onMounted(() => {
  loadContent()
})
</script>