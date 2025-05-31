<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PaginationProps, PaginationData } from '../../types/pagination';
import PaginationButton from './PaginationButton.vue';

const props = withDefaults(defineProps<PaginationProps>(), {
  maxVisiblePages: 5,
  perPageOptions: () => [10, 20, 50, 100],
  showEndButtons: true,
  showPerPage: true,
  showRange: true,
  paginationClass: '',
  disabled: false,
});

const emit = defineEmits(['update:currentPage', 'update:perPage', 'page-change', 'per-page-change']);

// Local state
const localCurrentPage = ref(props.currentPage);
const localPerPage = ref(props.perPage);

// Watch for prop changes
watch(() => props.currentPage, (newValue) => {
  if (newValue !== localCurrentPage.value) {
    localCurrentPage.value = newValue;
  }
});

watch(() => props.perPage, (newValue) => {
  if (newValue !== localPerPage.value) {
    localPerPage.value = newValue;
  }
});

// Watch for local changes and emit events
watch(localCurrentPage, (newValue) => {
  if (newValue !== props.currentPage) {
    emit('update:currentPage', newValue);
    emit('page-change', newValue);
  }
});

watch(localPerPage, (newValue) => {
  if (newValue !== props.perPage) {
    emit('update:perPage', newValue);
    emit('per-page-change', newValue);

    // Reset to first page when changing items per page
    if (localCurrentPage.value !== 1) {
      localCurrentPage.value = 1;
    }
  }
});

// Computed properties
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / localPerPage.value));
});

const startIndex = computed(() => {
  return (localCurrentPage.value - 1) * localPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + localPerPage.value - 1, props.totalItems - 1);
});

const isFirstPage = computed(() => {
  return localCurrentPage.value === 1;
});

const isLastPage = computed(() => {
  return localCurrentPage.value === totalPages.value;
});

const visiblePages = computed(() => {
  const maxVisible = Math.min(props.maxVisiblePages, totalPages.value);

  // If we have fewer pages than max visible, show all pages
  if (totalPages.value <= maxVisible) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  // Calculate the range of pages to display
  let start = localCurrentPage.value - Math.floor(maxVisible / 2);
  let end = start + maxVisible - 1;

  // Adjust if out of bounds
  if (start < 1) {
    start = 1;
    end = maxVisible;
  } else if (end > totalPages.value) {
    end = totalPages.value;
    start = end - maxVisible + 1;
  }

  // Create the array of pages
  const pages: (number | string)[] = [];

  // Add first page with ellipsis if needed
  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('...');
    }
  }

  // Add the visible page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add last page with ellipsis if needed
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...');
    }
    pages.push(totalPages.value);
  }

  return pages;
});

const paginationData = computed<PaginationData>(() => {
  return {
    currentPage: localCurrentPage.value,
    totalPages: totalPages.value,
    visiblePages: visiblePages.value,
    startIndex: startIndex.value,
    endIndex: endIndex.value,
    isFirstPage: isFirstPage.value,
    isLastPage: isLastPage.value,
    perPage: localPerPage.value,
    perPageOptions: props.perPageOptions,
  };
});

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== localCurrentPage.value) {
    localCurrentPage.value = page;
  }
};

const goToFirstPage = () => {
  goToPage(1);
};

const goToPrevPage = () => {
  goToPage(localCurrentPage.value - 1);
};

const goToNextPage = () => {
  goToPage(localCurrentPage.value + 1);
};

const goToLastPage = () => {
  goToPage(totalPages.value);
};

const changePerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  localPerPage.value = parseInt(target.value, 10);
};

// Range text
const rangeText = computed(() => {
  if (props.totalItems === 0) {
    return 'No items';
  }

  const start = startIndex.value + 1;
  const end = Math.min(endIndex.value + 1, props.totalItems);

  return `${start} - ${end} of ${props.totalItems}`;
});
</script>

<template>
	<div
		:class="['flex flex-col items-center gap-4 w-full py-4', paginationClass]" role="navigation"
		aria-label="Pagination">
		<div class="flex w-full justify-between items-center">
			<div v-if="showRange" class="text-sm text-gray-700 dark:text-gray-300 mr-4">
				{{ rangeText }}
			</div>


			<div class="flex items-center gap-1">
				<PaginationButton
					v-if="showEndButtons" icon="first" label="First" :disabled="isFirstPage || disabled"
					aria-label="Go to first page" @click="goToFirstPage" />

				<PaginationButton
					icon="prev" label="Previous" :disabled="isFirstPage || disabled"
					aria-label="Go to previous page" @click="goToPrevPage" />

				<div class="flex items-center gap-1">
					<template v-for="(page, index) in visiblePages" :key="index">
						<PaginationButton
							v-if="typeof page === 'number'" :label="page" :active="page === localCurrentPage"
							:disabled="disabled" :aria-label="`Go to page ${page}`" @click="goToPage(page)" />
						<span v-else class="px-3 py-1 text-gray-600 dark:text-gray-400">{{ page }}</span>
					</template>
				</div>

				<PaginationButton
					icon="next" label="Next" :disabled="isLastPage || disabled" aria-label="Go to next page"
					@click="goToNextPage" />

				<PaginationButton
					v-if="showEndButtons" icon="last" label="Last" :disabled="isLastPage || disabled"
					aria-label="Go to last page" @click="goToLastPage" />
			</div>

			<div v-if="showPerPage" class="flex items-center gap-2">
				<label for="per-page-select" class="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Per
					page:</label>
				<select
					id="per-page-select"
					class="appearance-none bg-gray-100 dark:bg-gray-800 border border-transparent rounded-md px-3 py-1.5 pr-8 text-sm text-gray-900 dark:text-gray-100 cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					:value="localPerPage" :disabled="disabled" @change="changePerPage">
					<option v-for="option in perPageOptions" :key="option" :value="option">
						{{ option }}
					</option>
				</select>
			</div>
		</div>
	</div>
</template>