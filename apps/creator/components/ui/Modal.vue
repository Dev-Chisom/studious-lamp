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
				<div class="absolute right-0 top-0 pr-4 pt-4">
					<button
						type="button"
						class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
						@click="emit('close')"
					>
						<span class="sr-only">Close</span> <Icon name="lucide:x" class="h-6 w-6" />
					</button>
				</div>

				<div class="py-6">
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
}

withDefaults(defineProps<ModalProps>(), {
  size: 'lg' // Default to large size (max-w-2xl)
});

const emit = defineEmits<ModalEmits>();
</script>