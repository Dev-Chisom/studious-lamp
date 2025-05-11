<template>
	<div class="form-group">
		<label v-if="label" :for="id" class="form-label text-gray-700 dark:text-gray-200">
			{{ label }} <span v-if="required" class="text-error-500 dark:text-error-400 ml-1">*</span>
		</label>

		<div
			class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"
			:class="[
				error ? 'border-error-300' : 'border-gray-300 dark:border-gray-700',
				isDragging
					? 'border-primary-300 bg-primary-50 dark:bg-primary-900'
					: 'hover:border-primary-300 dark:hover:border-primary-400',
			]"
			@dragover.prevent="isDragging = true"
			@dragleave.prevent="isDragging = false"
			@drop.prevent="onDrop"
		>
			<div class="space-y-1 text-center">
				<div v-if="previewUrls.length > 0" class="flex justify-center flex-wrap">
					<div v-for="(preview, index) in previewUrls" :key="index" class="relative w-20 h-20 m-1">
						<!-- Image Preview -->
						<img
							v-if="preview.type === 'image'"
							:src="preview.url"
							alt="Preview"
							class="object-cover w-full h-full rounded-md cursor-pointer"
							@click.stop="openPreview(index)"
						/>
						<!-- Video Preview -->

						<div
							v-else-if="preview.type === 'video'"
							class="relative w-full h-full rounded-md cursor-pointer bg-gray-100 dark:bg-gray-800"
							@click.stop="openPreview(index)"
						>
							<video :src="preview.url" class="w-full h-full object-cover rounded-md" />
							<div class="absolute inset-0 flex items-center justify-center">
								<Icon name="lucide:play" class="h-8 w-8 text-white bg-black/50 rounded-full p-1" />
							</div>
						</div>
						<!-- Other File Preview -->

						<div v-else class="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md">
							<Icon name="lucide:file" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
						</div>
						<button
							class="absolute -top-2 -right-2 bg-error-100 dark:bg-error-700 rounded-full p-1 text-error-600 dark:text-error-200 hover:bg-error-200 dark:hover:bg-error-600"
							@click.stop="removeFile(index)"
						>
							<Icon name="lucide:x" class="h-3 w-3" />
						</button>
					</div>
				</div>

				<div v-else>
					<Icon name="lucide:upload-cloud" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
				</div>

				<div class="flex text-sm text-gray-600 dark:text-gray-300">
					<label
						:for="id"
						class="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
					>
						<span>{{ previewUrls.length ? 'Upload more files' : 'Upload files' }}</span>
						<input :id="id" type="file" :accept="accept" class="sr-only" :multiple="multiple" @change="onFileChange" />
					</label>

					<p class="pl-1">or drag and drop</p>
				</div>

				<p class="text-xs text-gray-500 dark:text-gray-400">{{ acceptText }}</p>
			</div>
		</div>

		<p v-if="error" class="form-error text-error-600 dark:text-error-400">{{ error }}</p>

		<!-- Media Preview Modal -->
		<Teleport to="body">
			<media-preview-modal
				:is-open="previewModal.isOpen"
				:media-items="previewModal.items"
				:current-index="previewModal.currentIndex"
				:current-user="currentUser"
				@close="closePreview"
				@update:current-index="previewModal.currentIndex = $event"
			/>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MediaPreviewModal from './MediaPreviewModal.vue';

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	label: {
		type: String,
		default: '',
	},
	accept: {
		type: String,
		default: 'image/*,video/*',
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	maxSize: {
		type: Number,
		default: 5 * 1024 * 1024, // 5MB
	},
	id: {
		type: String,
		default: () => `file-upload-${Math.random().toString(36).substring(2, 9)}`,
	},
	error: {
		type: String,
		default: '',
	},
	required: {
		type: Boolean,
		default: false,
	},
});

const currentUser = ref({
	name: 'YourUsername',
	avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
});

const emit = defineEmits(['update:modelValue', 'error']);

const isDragging = ref(false);
const files = ref([]);
const previewUrls = ref([]);

// Preview modal state
const previewModal = ref({
	isOpen: false,
	items: [],
	currentIndex: 0,
});

const acceptText = computed(() => {
	if (props.accept === 'image/*') {
		return `PNG, JPG, GIF up to ${formatSize(props.maxSize)}`;
	} else if (props.accept.includes('video')) {
		return `Video files up to ${formatSize(props.maxSize)}`;
	} else {
		return `Files up to ${formatSize(props.maxSize)}`;
	}
});

function formatSize(bytes) {
	if (bytes === 0) {
		return '0 Bytes';
	}
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function isImage(file) {
	return file.type.startsWith('image/');
}

function isVideo(file) {
	return file.type.startsWith('video/');
}

function onFileChange(event) {
	const newFiles = Array.from(event.target.files);
	processFiles(newFiles);
	event.target.value = ''; // Reset file input
}

function onDrop(event) {
	isDragging.value = false;
	const newFiles = Array.from(event.dataTransfer.files);
	processFiles(newFiles);
}

function processFiles(newFiles) {
	const validFiles = newFiles.filter((file) => {
		// Check file size
		if (file.size > props.maxSize) {
			emit('error', `File "${file.name}" exceeds the maximum size of ${formatSize(props.maxSize)}`);
			return false;
		}

		// Check file type if accept is specified
		if (props.accept && props.accept !== '*') {
			const fileType = file.type;
			const acceptTypes = props.accept.split(',').map((type) => type.trim());
			const isValid = acceptTypes.some((type) => {
				if (type.endsWith('/*')) {
					const category = type.replace('/*', '');
					return fileType.startsWith(category + '/');
				}
				return type === fileType;
			});

			if (!isValid) {
				emit('error', `File "${file.name}" has an invalid file type`);
				return false;
			}
		}

		return true;
	});

	if (!props.multiple) {
		// Replace existing files
		files.value = validFiles;
		createPreviews(validFiles);
	} else {
		// Add to existing files
		files.value = [...files.value, ...validFiles];
		createPreviews(validFiles, true);
	}

	emit('update:modelValue', files.value);
}

function createPreviews(newFiles, append = false) {
	if (!append) {
		previewUrls.value = [];
	}

	newFiles.forEach((file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			previewUrls.value.push({
				type: isImage(file) ? 'image' : isVideo(file) ? 'video' : 'file',
				url: e.target.result,
			});
		};
		reader.readAsDataURL(file);
	});
}

function removeFile(index) {
	files.value.splice(index, 1);
	previewUrls.value.splice(index, 1);
	emit('update:modelValue', files.value);
}

function openPreview(index) {
	previewModal.value = {
		isOpen: true,
		items: previewUrls.value,
		currentIndex: index,
	};
}

function closePreview() {
	previewModal.value.isOpen = false;
}
</script>
