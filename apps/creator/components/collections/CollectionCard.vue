<template>
  <Card class="hover:shadow-hover transition-shadow">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ collection.name }}</h3>

      <p class="text-gray-500">{{ collection.posts.length }} posts</p>

      <div class="grid grid-cols-2 gap-2">
        <div v-for="(post, index) in collection.posts.slice(0, 4)" :key="index" class="aspect-square">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover rounded-lg" />
        </div>
      </div>

      <BaseButton variant="outline" class="w-full" @click="$emit('view', collection)">
        {{ t('viewCollection') }}
      </BaseButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseButton from '~/components/ui/BaseButton.vue';
import Card from '~/components/ui/Card.vue';

interface CollectionPost {
  id: string
  image: string
  title: string
}

interface Collection {
  id: string
  name: string
  posts: CollectionPost[]
}

defineProps<{
  collection: Collection
}>();

defineEmits<{
  (e: 'view', collection: Collection): void
}>();

const { t } = useI18n();
</script> 