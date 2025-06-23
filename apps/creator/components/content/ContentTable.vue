<template>
  <div class="flow-root">
    <SkeletonLoader v-if="loading" variant="table" :rows="6" height="4rem" class="mb-4" />
    
    <template v-if="content.length > 0">
    <!-- Mobile Card Layout -->
    <div class="block md:hidden space-y-4">
      <div 
        v-for="item in content" 
        :key="item._id" 
        class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ item.title }}
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ item.body }}
            </p>
          </div>
          <div class="flex items-center space-x-2 ml-3">
            <button
              class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1"
              :title="t('content.management.list.edit')"
              @click="$emit('edit', item)"
            >
              <Icon name="lucide:pencil" class="h-4 w-4" />
            </button>
            <button
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
              :title="t('content.management.list.delete')"
              @click="$emit('delete', item)"
            >
              <Icon name="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-4">
            <span
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" 
              :class="{
                'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                  item.visibility === 'public',
                'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':
                  item.visibility === 'private',
                'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400':
                  item.visibility === 'pay-to-view',
              }"
            >
              {{ t(`content.management.filters.${item.visibility}`) }}
            </span>
            <span class="flex items-center">
              <Icon name="lucide:eye" class="h-3 w-3 mr-1" />
              {{ item.metadata.views }}
            </span>
          </div>
          <span class="text-xs">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>
    <!-- Desktop Table Layout -->
    <div class="hidden md:block -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
                  {{ t('content.management.list.title') }}
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('content.management.list.visibility') }}
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('content.management.list.views') }}
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ t('content.management.list.date') }}
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">{{ t('content.management.list.actions') }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              <tr v-if="loading">
                <td colspan="5" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {{ t('content.management.list.loading') }}
                </td>
              </tr>
              <tr v-else-if="content.length === 0">
                <td colspan="5" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {{ t('content.management.list.noContent') }}
                </td>
              </tr>
              <template v-else>
                <tr v-for="item in content" :key="item._id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div class="flex items-center gap-2">
                      <div class="min-w-0 flex-1">
                        <div class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ item.title }}</div>
                        <div class="text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ item.body }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" 
                      :class="{
                        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                          item.visibility === 'public',
                        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':
                          item.visibility === 'private',
                        'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400':
                          item.visibility === 'pay-to-view',
                      }"
                    >
                      {{ t(`content.management.filters.${item.visibility}`) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ item.metadata.views }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(item.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex justify-end gap-2">
                      <button
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                        :title="t('content.management.list.edit')"
                        @click="$emit('edit', item)"
                      >
                        <Icon name="lucide:pencil" class="h-5 w-5" />
                      </button>
                      <button
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        :title="t('content.management.list.delete')"
                        @click="$emit('delete', item)"
                      >
                        <Icon name="lucide:trash-2" class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </template>

    <!-- Empty State for Mobile -->
    <div v-if="!loading && content.length === 0" class="block md:hidden text-center py-8">
      <div class="text-gray-500 dark:text-gray-400">
        <Icon name="lucide:file-text" class="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p class="text-sm">{{ t('content.management.list.noContent') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SkeletonLoader from '~/components/ui/SkeletonLoader.vue';
import type { Content } from '~/types/content';

defineProps<{
  content: Content[]
  loading: boolean
}>();

defineEmits<{
  (e: 'edit', content: Content): void
  (e: 'delete', content: Content): void
}>();

const { t } = useI18n();
</script> 