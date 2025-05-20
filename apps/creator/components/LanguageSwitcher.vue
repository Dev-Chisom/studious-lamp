<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      <span class="text-sm font-medium">{{ currentLocale.name }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" />
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
      <div class="py-1" role="menu">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-100 dark:bg-gray-700': locale.code === currentLocale.code }"
          role="menuitem"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => {
  return (locales.value as any[]).map(i => ({
    code: i.code,
    name: i.name
  }))
})

const currentLocale = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value) || availableLocales.value[0]
})

const switchLanguage = (code: string) => {
  locale.value = code
  isOpen.value = false
}
</script> 