<template>
	<div class="fixed inset-0 overflow-y-auto z-[800]" @click.self="emit('close')">
		<div class="flex min-h-screen items-center justify-center p-4 text-center">
			<div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />

			<div
				class="inline-block w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all
        "
				:class="{
					'max-w-md': size === 'sm',
					'max-w-lg': size === 'md',
					'max-w-2xl': size === 'lg',
					'max-w-4xl': size === 'xl',
					'max-w-6xl': size === '2xl',
					'max-w-full': size === 'full'
				}"
			>
				<div class="relative">
					<slot name="header" />
					<div class="absolute right-0 top-0 pr-4 pt-4 z-20">
						<button
							type="button"
							class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
							@click="emit('close')"
						>
							<span class="sr-only">Close</span> <Icon name="lucide:x" class="h-6 w-6" />
						</button>
					</div>
					<template v-if="showDivider">
						<div class="border-b border-gray-200 dark:border-gray-700"></div>
					</template>
				</div>
				<div class="py-4">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface ModalEmits {
  (e: 'close'): void
}

interface ModalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  showDivider?: boolean
}

withDefaults(defineProps<ModalProps>(), {
  size: 'lg', // Default to large size (max-w-2xl)
  showDivider: false
});

const emit = defineEmits<ModalEmits>();
</script>