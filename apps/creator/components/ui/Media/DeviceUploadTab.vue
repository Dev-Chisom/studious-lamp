<template>
  <div class="h-full flex flex-col p-6">
    <!-- Upload Area -->
    <div class="flex-1 flex flex-col">
      <!-- Drag & Drop Zone -->
      <div
        :class="[
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*,video/*"
          multiple
          class="hidden"
          @change="onFileSelect"
        />
        
        <div class="space-y-4">
          <div class="mx-auto bg-primary rounded-full flex items-center justify-center">
            <Icon name="lucide:upload-cloud" class="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Drop your files here
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              or click to browse from your device
            </p>
            
            <button
              type="button"
              class="inline-flex items-center space-x-2 btn-primary font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
              @click="fileInput?.click()"
            >
              <Icon name="lucide:folder-open" class="w-5 h-5" />
              <span>Choose Files</span>
            </button>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <p>Maximum {{ maxFiles }} files • Images and videos supported</p>
            <p>Up to 100MB per file</p>
          </div>
        </div>
      </div>

      <!-- Selected Files List -->
      <div v-if="selectedFiles.length > 0" class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-base font-semibold text-gray-900 dark:text-white">
            Selected Files ({{ selectedFiles.length }}/{{ maxFiles }})
          </h4>
          <button
            type="button"
            class="text-sm text-gray-500 hover:text-red-500 transition-colors"
            @click="clearAllFiles"
          >
            Clear All
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          <SelectedFileItem
            v-for="(file, index) in selectedFiles"
            :key="file.id"
            :file="file"
            :index="index"
            @remove="$emit('remove-file', index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SelectedFileItem from './SelectedFileItem.vue'

const props = defineProps<{
  selectedFiles: any[]
  maxFiles: number
}>()

const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void
  (e: 'remove-file', index: number): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    emit('files-selected', Array.from(input.files))
    input.value = '' // Clear input
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    emit('files-selected', Array.from(files))
  }
}

function clearAllFiles() {
  // Emit remove for each file in reverse order to avoid index issues
  for (let i = props.selectedFiles.length - 1; i >= 0; i--) {
    emit('remove-file', i)
  }
}
</script>