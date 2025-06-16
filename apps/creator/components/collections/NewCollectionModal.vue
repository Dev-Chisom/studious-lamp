<template>
  <Modal v-if="modelValue" @close="$emit('update:modelValue', false)">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ t('createNewCollection') }}</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('collectionName') }}</label>
          <input
            v-model="collectionName"
            type="text"
            class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder="My Favorite Posts"
          />
        </div>

        <BaseButton :loading="loading" variant="primary" class="w-full" @click="createCollection">
          {{ t('createCollection') }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseButton from '~/components/ui/BaseButton.vue';
import Modal from '~/components/ui/Modal.vue';

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', name: string): void
}>();

const { t } = useI18n();
const collectionName = ref('');

const createCollection = () => {
  if (!collectionName.value.trim()) return;
  emit('create', collectionName.value);
  collectionName.value = '';
};
</script> 