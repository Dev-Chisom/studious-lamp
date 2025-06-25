<template>
  <div class="mt-8 flow-root">
    <SkeletonLoader v-if="loading" variant="table" :rows="6" height="4rem" class="mb-4" />
    <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                      <div>
                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ item.title }}</div>
                        <div class="text-gray-500 dark:text-gray-400">{{ item.body }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="{
                        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                          item.visibility === 'public',
                        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':
                          item.visibility === 'private',
                        'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400':
                          item.visibility === 'pay-to-view',
                      }">
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
                        @click="$emit('edit', item)">
                        <Icon name="lucide:pencil" class="h-5 w-5" />
                      </button>
                      <button
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        :title="t('content.management.list.delete')"
                        @click="$emit('delete', item)">
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