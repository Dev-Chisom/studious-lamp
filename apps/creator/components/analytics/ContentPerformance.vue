<template>
  <div class="card">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{{ t('contentPerformance') }}</h3>
    </div>

    <ul class="divide-y divide-gray-200">
      <li v-for="post in posts" :key="post.id" class="px-4 py-4 sm:px-6">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 h-16 w-16">
            <img :src="post.thumbnail" :alt="post.title" class="h-16 w-16 object-cover rounded-lg" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ post.title }}</p>

            <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
              <div class="flex items-center">
                <Icon name="lucide:eye" class="h-4 w-4 mr-1" />
                {{ post.views }} {{ t('views') }}
              </div>

              <div class="flex items-center">
                <Icon name="lucide:heart" class="h-4 w-4 mr-1" />
                {{ post.likes }} {{ t('likes') }}
              </div>

              <div class="flex items-center">
                <Icon name="lucide:message-circle" class="h-4 w-4 mr-1" />
                {{ post.comments }} {{ t('comments') }}
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
            {{ formatDate(post.date) }}
          </div>
        </div>
      </li>

      <li v-if="posts.length === 0" class="px-4 py-6 text-center text-gray-500 dark:text-gray-200 dark:text-gray-400">
        {{ t('analytics.no_content_yet') }}
      </li>
    </ul>

    <div class="border-t border-gray-200 px-4 py-4 sm:px-6">
      <NuxtLink to="/content" class="text-sm font-medium text-primary-600 hover:text-primary-500">
        {{ t('analytics.view_all_content') }} <span aria-hidden="true"> &rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface ContentPost {
  id: string
  title: string
  thumbnail: string
  likes: number
  comments: number
  views: number
  date: Date
}

defineProps<{
  posts: ContentPost[]
}>();

const { t } = useI18n();

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script> 