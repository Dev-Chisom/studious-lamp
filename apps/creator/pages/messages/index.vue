<template>
	<div class="container mx-auto max-w-6xl">
		<div>
			<h1 class="text-2xl font-bold mb-6">{{ $t('messages.title') }}</h1>

			<div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
				<div class="grid grid-cols-12 h-[calc(100vh-12rem)]">
					<!-- Conversations List -->
					<div class="col-span-4 border-r border-gray-200 dark:border-gray-700">
						<div class="p-4 border-b border-gray-200 dark:border-gray-700">
							<div class="relative">
								<input
									type="text"
									:placeholder="$t('messages.search')"
									class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
								/>
								<Icon name="lucide:search" class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
							</div>
						</div>

						<div class="overflow-y-auto h-[calc(100%-4rem)]">
							<div
								v-for="conversation in conversations"
								:key="conversation.id"
								class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
								:class="{ 'bg-gray-50 dark:bg-gray-800': selectedConversation?.id === conversation.id }"
								@click="selectConversation(conversation)"
							>
								<div class="flex items-center space-x-3">
									<div class="avatar h-12 w-12">
										<img
											:src="conversation.user.profileImage"
											:alt="conversation.user.displayName"
											class="h-full w-full object-cover rounded-full"
										/>
									</div>

									<div class="flex-1 min-w-0">
										<div class="flex items-center justify-between">
											<h3 class="text-sm font-medium truncate">{{ conversation.user.displayName }}</h3>
											<span class="text-xs text-gray-500 dark:text-gray-200">
												{{ formatTimeAgo(conversation.lastMessage?.timestamp) }}
											</span>
										</div>

										<p class="text-sm text-gray-500 dark:text-gray-200 truncate">
											{{ conversation.lastMessage?.content }}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Chat Area -->
					<div class="col-span-8 flex flex-col">
						<div v-if="selectedConversation" class="flex-1 flex flex-col">
							<!-- Chat Header -->
							<div class="p-4 border-b border-gray-200 dark:border-gray-700">
								<div class="flex items-center space-x-3">
									<div class="avatar h-10 w-10">
										<img
											:src="selectedConversation.user.profileImage"
											:alt="selectedConversation.user.displayName"
											class="h-full w-full object-cover rounded-full"
										/>
									</div>

									<div>
										<h2 class="font-medium">{{ selectedConversation.user.displayName }}</h2>
										<p class="text-sm text-gray-500 dark:text-gray-200">
											@{{ selectedConversation.user.username }}
										</p>
									</div>
								</div>
							</div>

							<!-- Messages -->
							<div class="flex-1 overflow-y-auto p-4 space-y-4">
								<div
									v-for="message in selectedConversation.messages"
									:key="message.id"
									class="flex"
									:class="{ 'justify-end': message.isFromMe }"
								>
									<div
										class="max-w-[70%] rounded-lg px-4 py-2"
										:class="message.isFromMe ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'"
									>
										<p>{{ message.content }}</p>
										<span class="text-xs opacity-75 mt-1 block">
											{{ formatTimeAgo(message.timestamp) }}
										</span>
									</div>
								</div>
							</div>

							<!-- Message Input -->
							<div class="p-4 border-t border-gray-200 dark:border-gray-700">
								<form @submit.prevent="sendMessage" class="flex items-center space-x-2">
									<button type="button" class="text-gray-500 hover:text-gray-700 dark:text-gray-200">
										<Icon name="lucide:image" class="h-6 w-6" />
									</button>

									<input
										v-model="newMessage"
										type="text"
										:placeholder="$t('messages.typeMessage')"
										class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-4 py-2"
									/>

									<button type="submit" class="btn-primary">
										{{ $t('messages.send') }}
									</button>
								</form>
							</div>
						</div>

						<div v-else class="flex-1 flex items-center justify-center">
							<div class="text-center">
								<Icon name="lucide:message-square" class="h-12 w-12 mx-auto text-gray-400" />
								<h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
									{{ $t('messages.noMessages') }}
								</h3>
								<p class="mt-1 text-gray-500 dark:text-gray-200">
									{{ $t('messages.selectConversation') }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import FormInput from '@/components/ui/BaseInput.vue';
import MediaPreviewModal from '@/components/ui/MediaPreviewModal.vue';

const { t } = useI18n();

definePageMeta({
	middleware: ['auth'],
	layout: 'creator',
	meta: {
		requiresAuth: true,
	},
});

interface User {
	name: string
	avatar: string
	isOnline: boolean
}

interface MediaItem {
	type: 'image' | 'video'
	url: string
	preview?: string
	file?: File
	_msgId?: string
}

interface Message {
	id: string
	content: string
	timestamp: Date
	isSelf: boolean
	isRead: boolean
	media?: MediaItem | MediaItem[]
}

interface Chat {
	id: string
	user: User
	lastMessage: {
		content: string
		timestamp: Date
	}
	unreadCount: number
	isTyping: boolean
	messages: Message[]
}

interface MediaModal {
	isOpen: boolean
	mediaItems?: MediaItem[]
	currentIndex?: number
	type?: string | null
	url?: string | null
}

const searchQuery = ref<string>('');
const selectedChat = ref<Chat | null>(null);
const newMessage = ref<string>('');
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const mediaPreview = ref<MediaItem[]>([]);
const mediaModal = ref<MediaModal>({
	isOpen: false,
	type: null,
	url: null,
});

// Mock data for chats
const chats = ref<Chat[]>([
	{
		id: '1',
		user: {
			name: 'Jane Smith',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: true,
		},
		lastMessage: {
			content: 'Thank you for subscribing!',
			timestamp: new Date(Date.now() - 5 * 60 * 1000),
		},
		unreadCount: 2,
		isTyping: false,
		messages: [
			{
				id: '1',
				content: 'Hi there! Thanks for checking out my content',
				timestamp: new Date(Date.now() - 30 * 60 * 1000),
				isSelf: false,
				isRead: true,
			},
			{
				id: '2',
				content: 'Your latest post was amazing!',
				timestamp: new Date(Date.now() - 25 * 60 * 1000),
				isSelf: true,
				isRead: true,
			},
			{
				id: '3',
				content: 'Thank you for subscribing!',
				timestamp: new Date(Date.now() - 5 * 60 * 1000),
				isSelf: false,
				isRead: false,
				media: {
					type: 'image',
					url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
				},
			},
		],
	},
	{
		id: '2',
		user: {
			name: 'Mike Johnson',
			avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: false,
		},
		lastMessage: {
			content: 'Check out my new photo collection!',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
		},
		unreadCount: 0,
		isTyping: false,
		messages: [
			{
				id: '1',
				content: 'Hey! I just posted a new photo collection',
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
				isSelf: false,
				isRead: true,
			},
			{
				id: '2',
				content: 'Check out my new photo collection!',
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
				isSelf: false,
				isRead: true,
				media: {
					type: 'video',
					url: 'https://player.vimeo.com/external/394678700.sd.mp4?s=353646b8d6a0da48b40f6a3fe0e8f09797c1f5dd&profile_id=165&oauth2_token_id=57447761',
				},
			},
		],
	},
]);

// Computed
const filteredChats = computed<Chat[]>(() => {
	if (!searchQuery.value) {
		return chats.value;
	}

	const query = searchQuery.value.toLowerCase();
	return chats.value.filter(
		(chat: Chat) =>
			chat.user.name.toLowerCase().includes(query) || chat.lastMessage.content.toLowerCase().includes(query),
	);
});

const allChatMedia = computed<MediaItem[]>(() => {
	if (!selectedChat.value) {
		return [];
	}
	const mediaList: MediaItem[] = [];
	selectedChat.value.messages.forEach((msg: Message) => {
		if (msg.media) {
			if (Array.isArray(msg.media)) {
				;(msg.media as MediaItem[]).forEach((m: MediaItem) => mediaList.push({ ...m, _msgId: msg.id }));
			} else {
				mediaList.push({ ...(msg.media as MediaItem), _msgId: msg.id });
			}
		}
	});
	return mediaList;
});

// Methods
const formatTimeAgo = (timestamp: Date | string): string => {
	const now = new Date();
	const d = new Date(timestamp);
	const diff = now.getTime() - d.getTime();

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 60) {
		return t('messages.timeAgo.minutesAgo', { minutes });
	} else if (hours < 24) {
		return t('messages.timeAgo.hoursAgo', { hours });
	} else if (days < 7) {
		return t('messages.timeAgo.daysAgo', { days });
	} else {
		return d.toLocaleDateString();
	}
};

function selectChat(chat: Chat): void {
	selectedChat.value = chat;
	// Mark messages as read
	chat.unreadCount = 0;
	chat.messages.forEach((message: Message) => {
		if (!message.isSelf) {
			message.isRead = true;
		}
	});
}

function handleTyping() {
	if (typingTimeout.value) {
		clearTimeout(typingTimeout.value);
	}

	// Emit typing event
	// In a real app, this would be sent to the server

	typingTimeout.value = setTimeout(() => {
		// Stop typing
		// In a real app, this would be sent to the server
	}, 3000);
}

function handleImageUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	const files = Array.from(input.files || []);

	for (const file of files) {
		if (file.type.startsWith('image/')) {
			const preview = URL.createObjectURL(file);
			mediaPreview.value.push({
				file,
				type: 'image',
				preview,
			});
		}
	}
	input.value = '';
}

function handleVideoUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files ? input.files[0] : undefined;

	if (file && file.type.startsWith('video/')) {
		const preview = URL.createObjectURL(file);
		mediaPreview.value.push({
			file,
			type: 'video',
			preview,
		});
	}
	input.value = '';
}

function removeMedia(index: number) {
	const media = mediaPreview.value[index];
	if (media && media.preview) {
		URL.revokeObjectURL(media.preview);
	}
	mediaPreview.value.splice(index, 1);
}

function openMediaPreviewForChat(media: MediaItem, msgId: string) {
	const allMedia = allChatMedia.value;
	let globalIdx = 0;
	let found = false;
	for (let i = 0; i < allMedia.length; i++) {
		if (allMedia[i].url === media.url && allMedia[i].type === media.type && allMedia[i]._msgId === msgId) {
			globalIdx = i;
			found = true;
			break;
		}
	}
	if (!found) {
		globalIdx = 0;
	}
	mediaModal.value = {
		isOpen: true,
		mediaItems: allMedia,
		currentIndex: globalIdx,
	};
}

function closeMediaPreview() {
	mediaModal.value.isOpen = false;
}

function sendMessage() {
	if (!newMessage.value.trim() && mediaPreview.value.length === 0) {
		return;
	}

	try {
		// In a real app, upload media files to server and get URLs
		const mediaUrls = mediaPreview.value.map((media) => ({
			type: media.type,
			url: media.preview, // In real app, this would be the uploaded file URL
		}));

		const message = {
			id: `msg-${Date.now()}`,
			content: newMessage.value,
			timestamp: new Date(),
			isSelf: true,
			isRead: false,
		};

		if (mediaUrls.length > 0) {
			message.media = mediaUrls; // Assign all media
		}

		selectedChat.value.messages.push(message);
		selectedChat.value.lastMessage = {
			content: newMessage.value || 'Sent a media file',
			timestamp: new Date(),
		};

		newMessage.value = '';
		mediaPreview.value = [];

		// Simulate other user typing
		setTimeout(() => {
			selectedChat.value.isTyping = true;

			setTimeout(() => {
				selectedChat.value.isTyping = false;

				// Simulate response
				selectedChat.value.messages.push({
					id: `msg-${Date.now()}`,
					content: 'Thanks for your message!',
					timestamp: new Date(),
					isSelf: false,
					isRead: true,
				});
			}, 3000);
		}, 1000);
	} catch (error) {
		console.error('Failed to send message:', error);
	}
}

// Cleanup
onUnmounted(() => {
	mediaPreview.value.forEach((media) => {
		URL.revokeObjectURL(media.preview);
	});
});
</script>
