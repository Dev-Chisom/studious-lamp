<template>
  <div class="relative" v-click-outside="closeDropdown">
    <button @click.stop="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      <span class="text-sm font-medium">{{ currentLocaleName }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" />
    </button>

    <div v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
      style="z-index: 500">
      <div class="py-1" role="menu">
        <button v-for="locale in availableLocales" :key="locale.code" @click="switchLanguage(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-100 dark:bg-gray-700': locale.code === locale }" role="menuitem">
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => {
  return locales.value.filter(l => typeof l !== 'string').map(l => ({
    code: l.code,
    name: l.name
  }))
})

const currentLocaleName = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value)?.name || 'English'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const switchLanguage = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

// Click outside directive
const vClickOutside = {
  beforeMount(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>