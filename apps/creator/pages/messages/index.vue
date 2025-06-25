<template>
  <div class="container mx-auto max-w-6xl">
  			<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
					</div>
  	<div class="grid grid-cols-1 lg:grid-cols-4 flex-1 h-[800px] bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
		<!-- Chat List -->
		<div class="lg:col-span-1 border-r border-gray-200 dark:border-gray-700">
			<!-- Chat List Header -->
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				
				<div class="relative">
					<Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						v-model="searchQuery"
						placeholder="Search conversations..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<!-- Recently Active - Horizontal Scroll -->
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-3">Recently Active</h3>
				<div class="flex space-x-3 overflow-x-auto pb-2" style="scrollbar-width: none; -ms-overflow-style: none;">
					<div 
						v-for="chat in recentChats" 
						:key="chat.id"
						@click="selectChat(chat)"
						class="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer hover:opacity-80"
					>
						<div class="relative">
							<img :src="chat.user.avatar" :alt="chat.user.name" class="w-12 h-12 rounded-full object-cover" />
							<div v-if="chat.user.isOnline" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
						</div>
						<span class="text-xs text-gray-500 dark:text-gray-400 max-w-[60px] truncate">{{ chat.user.name.split(' ')[0] }}</span>
					</div>
				</div>
			</div>

			<!-- Chat List -->
			<div class="flex-1 overflow-y-auto">
				<div
					v-for="chat in filteredChats"
					:key="chat.id"
					@click="selectChat(chat)"
					class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-700"
					:class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedChat?.id === chat.id }"
				>
					<div class="flex items-center space-x-3">
						<div class="relative">
							<img :src="chat.user.avatar" :alt="chat.user.name" class="w-12 h-12 rounded-full object-cover" />
							<div v-if="chat.user.isOnline" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h3 class="font-medium text-xs text-gray-900 dark:text-white truncate">{{ chat.user.name }}</h3>
								<span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(chat.lastMessage.timestamp) }}</span>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-1">
									<Icon v-if="chat.lastMessage.type === 'voice'" name="lucide:mic" class="w-3 h-3 text-gray-400" />
									<Icon v-else-if="chat.lastMessage.type === 'image'" name="lucide:image" class="w-3 h-3 text-gray-400" />
									<Icon v-else-if="chat.lastMessage.type === 'video'" name="lucide:video" class="w-3 h-3 text-gray-400" />
									<p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ getLastMessagePreview(chat.lastMessage) }}</p>
								</div>
								<div class="flex items-center space-x-1">
									<Icon v-if="chat.lastMessage.isSelf && chat.lastMessage.isDelivered" 
										:name="chat.lastMessage.isRead ? 'lucide:check-check' : 'lucide:check'" 
										class="w-3 h-3" 
										:class="chat.lastMessage.isRead ? 'text-blue-500' : 'text-gray-400'" 
									/>
									<div v-if="chat.unreadCount > 0" class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
										{{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Chat Window -->
		<div class="lg:col-span-3 flex flex-col flex-1 overflow-x-hidden overflow-y-hidden" :class="{ 'hidden lg:flex': !selectedChat }">
			<template v-if="selectedChat">
				<!-- Chat Header -->
				<div class="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10">
					<div class="flex items-center space-x-3">
						<!-- Mobile back button -->
						<button class="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" @click="selectedChat = null">
							<Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
						</button>
						<img :src="selectedChat.user.avatar" :alt="selectedChat.user.name" class="w-10 h-10 rounded-full object-cover" />
						<div>
							<h2 class="font-medium text-sm text-gray-900 dark:text-white">{{ selectedChat.user.name }}</h2>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								<span v-if="selectedChat.isTyping">Typing...</span>
								<span v-else-if="selectedChat.user.isOnline">Online</span>
								<span v-else>Last seen {{ formatTime(selectedChat.user.lastSeen) }}</span>
							</p>
						</div>
					</div>
					
					<div class="flex items-center space-x-2">
						<div class="relative" ref="chatMenuRef">
							<button @click="showChatMenu = !showChatMenu" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
								<Icon name="lucide:more-vertical" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
							
							<div v-if="showChatMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
								<div class="py-1">
									<button @click="clearChat" class="block w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
										Clear Chat
									</button>
									<button @click="blockUser" class="block w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
										Block User
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Messages -->
				<div
					ref="messagesContainer"
					class="flex-1 overflow-x-hidden overflow-y-scroll p-4 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg"
				>
					<div
						v-for="message in selectedChat.messages"
						:key="message.id"
						class="flex"
						:class="message.isSelf ? 'justify-end' : 'justify-start'"
					>
						<div class="max-w-[70%] group">
							<!-- Reply indicator -->
							<div v-if="message.replyTo" class="mb-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg border-l-4 border-blue-500">
								<p class="text-xs text-gray-500 dark:text-gray-400">Replying to {{ message.replyTo.senderName }}</p>
								<p class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ message.replyTo.content }}</p>
							</div>

							<div
								class="rounded-md px-4 py-2 relative"
								:class="[
									message.isSelf ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700',
									message.replyTo ? 'rounded-t-none' : ''
								]"
							>
								<!-- Voice message -->
								<div v-if="message.type === 'voice'" class="flex items-center space-x-3 min-w-[200px]">
									<audio
										:ref="el => audioRefs[message.id] = el"
										:src="message.media?.url"
										preload="auto"
										class="hidden"
										@loadedmetadata="updateVoiceDuration(message)"
										@timeupdate="updateVoiceProgress(message)"
										@ended="onVoiceEnded(message)"
									/>
									<button
										@click="toggleVoicePlayback(message)"
										class="p-2 rounded-full flex-shrink-0"
										:class="message.isSelf ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900'"
									>
										<Icon :name="message.isPlaying ? 'lucide:pause' : 'lucide:play'" 
											class="w-4 h-4" 
											:class="message.isSelf ? 'text-white' : 'text-blue-600 dark:text-blue-400'" 
										/>
									</button>
									<div class="flex-1">
										<div class="flex items-center space-x-2">
											<div class="flex-1 h-2 bg-white/30 dark:bg-gray-600 rounded-full overflow-hidden">
												<div
													class="h-full bg-white dark:bg-blue-500 transition-all duration-300"
													:style="{ width: `${message.voiceProgress || 0}%` }"
												></div>
											</div>
											<span class="text-xs opacity-70 min-w-[30px]">{{ message.voiceDuration || '0:00' }}</span>
										</div>
										<div class="mt-1 flex space-x-0.5">
											<div v-for="i in 25" :key="i" class="w-0.5 bg-white/40 dark:bg-gray-500 rounded-full" :style="{ height: `${Math.random() * 16 + 4}px` }"></div>
										</div>
									</div>
								</div>

								<!-- Media preview -->
								<div v-else-if="message.media && message.media.type === 'image'" class="mb-2">
									<img
										:src="message.media.url"
										:alt="message.content"
										class="rounded-lg max-h-64 cursor-pointer"
										@click="openMediaPreview(message.media, message.id)"
									/>
								</div>
								<div v-else-if="message.media && message.media.type === 'video'" class="mb-2 relative">
									<video
										:src="message.media.url"
										class="rounded-lg max-h-64 w-full cursor-pointer"
										@click="openMediaPreview(message.media, message.id)"
									/>
									<div class="absolute inset-0 flex items-center justify-center">
										<div class="bg-black/50 rounded-full p-3">
											<Icon name="lucide:play" class="w-6 h-6 text-white" />
										</div>
									</div>
								</div>

								<!-- Text content -->
								<div v-if="message.content" class="text-sm">
									<span v-html="formatMessageContent(message.content)"></span>
									<span v-if="message.isEdited" class="text-xs opacity-60 ml-2">(edited)</span>
								</div>

								<!-- Message reactions -->
								<div v-if="message.reactions && message.reactions.length > 0" class="mt-2 flex flex-wrap gap-1">
									<button
										v-for="reaction in message.reactions"
										:key="reaction.emoji"
										@click="toggleReaction(message, reaction.emoji)"
										class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-white/20 hover:bg-white/30 transition-colors"
										:class="{ 'ring-1 ring-yellow-400': reaction.users.includes('currentUser') }"
									>
										<span>{{ reaction.emoji }}</span>
										<span>{{ reaction.count }}</span>
									</button>
								</div>

								<!-- Message footer -->
								<div class="flex items-center justify-end mt-1 space-x-1">
									<span class="text-xs opacity-70">{{ formatTime(message.timestamp) }}</span>
									<Icon v-if="message.isSelf" 
										:name="message.isRead ? 'lucide:check-check' : 'lucide:check'" 
										class="w-3 h-3" 
										:class="message.isRead ? 'text-blue-300' : 'opacity-70'" 
									/>
								</div>

								<!-- Message actions -->
								<div class="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex z-10">
									<div class="relative" ref="reactionPickerRef">
										<button
											@click="showReactionPicker = showReactionPicker === message.id ? null : message.id"
											class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
											title="Add reaction"
										>
											<Icon name="lucide:smile" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
										</button>
										
										<div v-if="showReactionPicker === message.id" class="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20">
											<div class="flex items-center space-x-2">
												<button
													v-for="emoji in quickReactions"
													:key="emoji"
													@click="addReaction(message, emoji)"
													class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-xl transition-transform hover:scale-110"
												>
													{{ emoji }}
												</button>
											</div>
										</div>
									</div>
									<button @click="replyToMessage(message)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Reply">
										<Icon name="lucide:reply" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
									</button>
									<button v-if="message.isSelf" @click="editMessage(message)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Edit">
										<Icon name="lucide:edit" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
									</button>
									<button @click="deleteMessage(message)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500" title="Delete">
										<Icon name="lucide:trash-2" class="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Typing indicator -->
					<div v-if="selectedChat.isTyping" class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
						<div class="flex space-x-1">
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s" />
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s" />
						</div>
						<span class="text-sm">{{ selectedChat.user.name }} is typing...</span>
					</div>
				</div>

				<!-- Message Input -->
				<div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
					<!-- Reply preview -->
					<div v-if="replyingTo" class="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 flex items-center justify-between">
						<div>
							<p class="text-xs text-gray-500 dark:text-gray-400">Replying to {{ replyingTo.senderName }}</p>
							<p class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ replyingTo.content }}</p>
						</div>
						<button @click="cancelReply" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
							<Icon name="lucide:x" class="w-4 h-4" />
						</button>
					</div>

					<!-- Media preview -->
					<div v-if="mediaPreview.length > 0" class="mb-3 flex space-x-2 overflow-x-auto pb-2">
						<div v-for="(media, index) in mediaPreview" :key="index" class="relative flex-shrink-0">
							<img v-if="media.type === 'image'" :src="media.preview" class="h-20 w-20 object-cover rounded-lg" />
							<video v-else-if="media.type === 'video'" :src="media.preview" class="h-20 w-20 object-cover rounded-lg" />
							<div v-else-if="media.type === 'voice'" class="h-20 w-32 bg-blue-100 dark:bg-blue-900 rounded-lg flex flex-col items-center justify-center">
								<Icon name="lucide:mic" class="w-6 h-6 mb-1 text-blue-600 dark:text-blue-400" />
								<span class="text-xs text-blue-600 dark:text-blue-400">{{ media.duration }}</span>
							</div>
							<button @click="removeMedia(index)" class="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600">
								<Icon name="lucide:x" class="w-3 h-3" />
							</button>
						</div>
					</div>

					<form @submit.prevent="sendMessage" class="flex items-end space-x-2">
						<div class="flex-1 relative" ref="emojiPickerRef">
							<input
								v-model="newMessage"
								placeholder="Type a message..."
								class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none pr-12"
								@input="handleTyping"
							/>
						</div>
						<!-- Unified media button -->
						<div class="flex space-x-1">
							<input ref="mediaInputRef" type="file" accept="image/*,video/*" multiple class="hidden" @change="handleMediaUpload" />
							<button type="button" @click="$refs.mediaInputRef.click()" class="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
								<Icon name="lucide:image" class="w-5 h-5" />
							</button>
							<button
								type="button"
								@mousedown="startVoiceRecording"
								@mouseup="stopVoiceRecording"
								@mouseleave="stopVoiceRecording"
								:class="[
									'p-3 rounded-full transition-colors',
									isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
								]"
							>
								<Icon name="lucide:mic" class="w-5 h-5" />
							</button>
						</div>
						<button
							type="submit"
							:disabled="!canSendMessage"
							class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Icon name="lucide:send" class="w-5 h-5" />
						</button>
					</form>

					<!-- Recording indicator -->
					<div v-if="isRecording" class="mt-2 flex items-center justify-center space-x-2 text-red-500">
						<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
						<span class="text-sm font-medium">Recording... Release to send</span>
						<span class="text-sm">{{ recordingDuration }}s</span>
					</div>
				</div>
			</template>

			<!-- No chat selected -->
			<div v-else class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div class="text-center">
					<Icon name="lucide:message-square" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
					<h3 class="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No chat selected</h3>
					<p class="text-gray-500 dark:text-gray-400">Choose a conversation to start messaging</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Media Preview Modal -->
	<MediaPreviewModal
		v-if="mediaModal.isOpen" 
		:is-open="mediaModal.isOpen" 
		:media-items="mediaModal.mediaItems"
		:current-index="mediaModal.currentIndex" 
		:messages="allCommentsForModal"
		:current-user="currentUser" 
		@close="closeMediaPreview" 
		@update:current-index="updateMediaIndex"
		@send-message="handleNewComment" 
	/>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import MediaPreviewModal from '~/components/ui/Media/MediaPreviewModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
	middleware: ['auth'],
	layout: 'creator',
});

const selectedChat = ref(null)
const newMessage = ref('')
const searchQuery = ref('')
const mediaPreview = ref([])
const showChatMenu = ref(false)
const showReactionPicker = ref(null)
const replyingTo = ref(null)
const isRecording = ref(false)
const recordingDuration = ref(0)
const recordingInterval = ref(null)
const mediaModal = ref({
	isOpen: false,
	mediaItems: [],
	currentIndex: 0
})

// Add these new reactive variables after the existing ones
const audioRefs = ref({})
const currentUser = ref({ id: 'currentUser', name: 'You' })
const allCommentsForModal = ref([])

// Refs
const chatMenuRef = ref(null)
const reactionPickerRef = ref(null)
const emojiPickerRef = ref(null)

// Quick reactions
const quickReactions = ['👍', '❤️', '😂', '😮', '😢']


// Mock data
const recentChats = ref([
	{
		id: '1',
		user: {
			name: 'Jane Smith',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: true
		}
	},
	{
		id: '2',
		user: {
			name: 'Mike Johnson',
			avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: false
		}
	},
	{
		id: '3',
		user: {
			name: 'Sarah Wilson',
			avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: true
		}
	}
])

const chats = ref([
	{
		id: '1',
		user: {
			name: 'Jane Smith',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: true
		},
		lastMessage: {
			content: 'Thank you for subscribing! 🎉',
			timestamp: new Date(Date.now() - 7 * 60 * 1000),
			type: 'text',
			isSelf: false,
			isRead: false,
			isDelivered: true
		},
		unreadCount: 2,
		isTyping: false,
		messages: [
			{
				id: '1',
				content: 'Your latest post was amazing!',
				timestamp: new Date(Date.now() - 27 * 60 * 1000),
				isSelf: true,
				isRead: true,
				isDelivered: true,
				type: 'text',
				reactions: []
			},
			{
				id: '2',
				content: '',
				timestamp: new Date(Date.now() - 4 * 60 * 1000),
				isSelf: true,
				isRead: true,
				isDelivered: true,
				type: 'voice',
				voiceDuration: '0:00',
				voiceProgress: 0,
				isPlaying: false,
				reactions: []
			},
			{
				id: '3',
				content: 'Thank you for subscribing! 🎉',
				timestamp: new Date(Date.now() - 7 * 60 * 1000),
				isSelf: false,
				isRead: false,
				isDelivered: true,
				type: 'image',
				media: {
					type: 'image',
					url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
				},
				reactions: [
					{ emoji: '❤️', count: 2, users: ['user1', 'currentUser'] },
					{ emoji: '👍', count: 1, users: ['user2'] }
				]
			},
			{
				id: '4',
				content: '',
				timestamp: new Date(Date.now() - 3 * 60 * 1000),
				isSelf: false,
				isRead: false,
				isDelivered: true,
				type: 'video',
				media: {
					type: 'video',
					url: 'https://player.vimeo.com/external/394678700.sd.mp4?s=353646b8d6a0da48b40f6a3fe0e8f09797c1f5dd&profile_id=165&oauth2_token_id=57447761'
				},
				reactions: []
			},
			{
				id: '5',
				content: '😊😊',
				timestamp: new Date(Date.now() - 1 * 60 * 1000),
				isSelf: true,
				isRead: false,
				isDelivered: true,
				type: 'text',
				reactions: []
			}
		]
	},
	{
		id: '2',
		user: {
			name: 'Mike Johnson',
			avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
			isOnline: false,
			lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
		},
		lastMessage: {
			content: 'Voice message',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			type: 'voice',
			isSelf: false,
			isRead: true,
			isDelivered: true
		},
		unreadCount: 0,
		isTyping: false,
		messages: [
			{
				id: '1',
				content: '',
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
				isSelf: false,
				isRead: true,
				isDelivered: true,
				type: 'voice',
				voiceDuration: '0:15',
				voiceProgress: 0,
				isPlaying: false,
				reactions: []
			}
		]
	}
])

// Computed
const filteredChats = computed(() => {
	if (!searchQuery.value) return chats.value
	const query = searchQuery.value.toLowerCase()
	return chats.value.filter(chat => 
		chat.user.name.toLowerCase().includes(query) || 
		chat.lastMessage.content.toLowerCase().includes(query)
	)
})

const canSendMessage = computed(() => {
	return newMessage.value.trim() || mediaPreview.value.length > 0
})

const currentMediaItem = computed(() => {
	if (!mediaModal.value.isOpen || !mediaModal.value.mediaItems.length) return null
	return mediaModal.value.mediaItems[mediaModal.value.currentIndex]
})

const allChatMedia = computed(() => {
	if (!selectedChat.value) return []
	const mediaList = []
	selectedChat.value.messages.forEach(msg => {
		if (msg.media) {
			mediaList.push({ ...msg.media, _msgId: msg.id })
		}
	})
	return mediaList
})

// Methods
function formatTime(date) {
	const now = new Date()
	const d = new Date(date)
	const diff = now.getTime() - d.getTime()
	const minutes = Math.floor(diff / (1000 * 60))
	const hours = Math.floor(diff / (1000 * 60 * 60))
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (minutes < 1) return t('messages.now')
	if (minutes < 60) return `${minutes}m`
	if (hours < 24) return `${hours}h`
	if (days < 7) return `${days}d`
	return d.toLocaleDateString()
}

function formatMessageContent(content) {
	const urlRegex = /(https?:\/\/[^\s]+)/g
	content = content.replace(urlRegex, '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>')
	return content.replace(/\n/g, '<br>')
}

function getLastMessagePreview(lastMessage) {
	if (lastMessage.type === 'voice') return t('messages.voiceMessage')
	if (lastMessage.type === 'image') return t('messages.photo')
	if (lastMessage.type === 'video') return t('messages.video')
	return lastMessage.content
}

function selectChat(chat) {
	const found = chats.value.find(c => c.id === chat.id)
	if (found) {
		selectedChat.value = found
		found.unreadCount = 0
		found.messages.forEach(message => {
			if (!message.isSelf) message.isRead = true
		})
		scrollToBottom()
	}
}

function handleTyping() {
	// Handle typing indicator
}

function handleMediaUpload(event) {
	const files = Array.from(event.target.files || [])
	files.forEach(file => {
		if (file.type.startsWith('image/')) {
			const preview = URL.createObjectURL(file)
			mediaPreview.value.push({ file, type: 'image', preview })
		} else if (file.type.startsWith('video/')) {
			const preview = URL.createObjectURL(file)
			mediaPreview.value.push({ file, type: 'video', preview })
		}
	})
	event.target.value = ''
}

function removeMedia(index) {
	const media = mediaPreview.value[index]
	if (media?.preview) URL.revokeObjectURL(media.preview)
	mediaPreview.value.splice(index, 1)
}

function startVoiceRecording() {
	if (isRecording.value) return
	isRecording.value = true
	recordingDuration.value = 0
	recordingInterval.value = setInterval(() => {
		recordingDuration.value++
	}, 1000)
}

function stopVoiceRecording() {
	if (!isRecording.value) return
	isRecording.value = false
	if (recordingInterval.value) {
		clearInterval(recordingInterval.value)
		recordingInterval.value = null
	}
	
	mediaPreview.value.push({
		type: 'voice',
		duration: `0:${recordingDuration.value.toString().padStart(2, '0')}`
	})
}

function toggleVoicePlayback(message) {
	const audio = audioRefs.value[message.id]
	if (!audio) return
	
	if (message.isPlaying) {
		audio.pause()
		message.isPlaying = false
	} else {
		audio.play()
		message.isPlaying = true
	}
}

function updateVoiceDuration(message) {
	const audio = audioRefs.value[message.id]
	if (audio && audio.duration) {
		const minutes = Math.floor(audio.duration / 60)
		const seconds = Math.floor(audio.duration % 60)
		message.voiceDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
	}
}

function updateVoiceProgress(message) {
	const audio = audioRefs.value[message.id]
	if (audio && audio.duration) {
		message.voiceProgress = (audio.currentTime / audio.duration) * 100
	}
}

function onVoiceEnded(message) {
	message.isPlaying = false
	message.voiceProgress = 0
}
function addReaction(message, emoji) {
	if (!message.reactions) message.reactions = []
	const existingReaction = message.reactions.find(r => r.emoji === emoji)
	
	if (existingReaction) {
		if (existingReaction.users.includes('currentUser')) {
			existingReaction.users = existingReaction.users.filter(u => u !== 'currentUser')
			existingReaction.count--
			if (existingReaction.count === 0) {
				message.reactions = message.reactions.filter(r => r.emoji !== emoji)
			}
		} else {
			existingReaction.users.push('currentUser')
			existingReaction.count++
		}
	} else {
		message.reactions.push({ emoji, count: 1, users: ['currentUser'] })
	}
	showReactionPicker.value = null
}

function toggleReaction(message, emoji) {
	addReaction(message, emoji)
}

function replyToMessage(message) {
	replyingTo.value = {
		messageId: message.id,
		senderName: message.isSelf ? 'You' : selectedChat.value?.user.name,
		content: message.content || 'Media message'
	}
}

function cancelReply() {
	replyingTo.value = null
}

function editMessage(message) {
	const newContent = prompt('Edit message:', message.content)
	if (newContent !== null && newContent !== message.content) {
		message.content = newContent
		message.isEdited = true
	}
}

function deleteMessage(message) {
	if (confirm('Delete this message?')) {
		const index = selectedChat.value?.messages.findIndex(m => m.id === message.id)
		if (index !== -1) selectedChat.value?.messages.splice(index, 1)
	}
}

function clearChat() {
	if (selectedChat.value && confirm('Clear all messages?')) {
		selectedChat.value.messages = []
		showChatMenu.value = false
	}
}

function blockUser() {
	if (confirm('Block this user?')) {
		showChatMenu.value = false
	}
}

function openMediaPreview(media, msgId) {
	const allMedia = allChatMedia.value
	const index = allMedia.findIndex(m => m.url === media.url && m._msgId === msgId)
	
	mediaModal.value = {
		isOpen: true,
		mediaItems: allMedia,
		currentIndex: Math.max(0, index)
	}
}

function closeMediaPreview() {
	mediaModal.value.isOpen = false
}

function previousMedia() {
	if (mediaModal.value.currentIndex > 0) {
		mediaModal.value.currentIndex--
	}
}

function nextMedia() {
	if (mediaModal.value.currentIndex < mediaModal.value.mediaItems.length - 1) {
		mediaModal.value.currentIndex++
	}
}

function updateMediaIndex(index) {
	mediaModal.value.currentIndex = index
}

function handleNewComment(comment) {
	// Optionally handle new comment from media preview modal
}

function sendMessage() {
	if (!canSendMessage.value || !selectedChat.value) return

	const mediaUrls = mediaPreview.value.map(media => ({
		type: media.type,
		url: media.preview,
		duration: media.duration
	}))

	const message = {
		id: `msg-${Date.now()}`,
		content: newMessage.value,
		timestamp: new Date(),
		isSelf: true,
		isRead: false,
		isDelivered: true,
		type: mediaUrls.length > 0 ? mediaUrls[0].type : 'text',
		replyTo: replyingTo.value,
		reactions: []
	}

	if (mediaUrls.length > 0) {
		message.media = mediaUrls[0]
		if (message.type === 'voice') {
			message.voiceDuration = mediaUrls[0].duration
			message.voiceProgress = 0
			message.isPlaying = false
		}
	}

	selectedChat.value.messages.push(message)
	selectedChat.value.lastMessage = {
		content: newMessage.value || getLastMessagePreview({ type: message.type }),
		timestamp: new Date(),
		type: message.type,
		isSelf: true,
		isRead: false,
		isDelivered: true
	}

	// Clear inputs
	newMessage.value = ''
	mediaPreview.value.forEach(media => {
		if (media.preview) URL.revokeObjectURL(media.preview)
	})
	mediaPreview.value = []
	replyingTo.value = null
	scrollToBottom()
}

function scrollToBottom() {
	nextTick(() => {
		if (messagesContainer.value) {
			messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
		}
	})
}

// Click outside handler
function handleClickOutside(event) {
	if (chatMenuRef.value && !chatMenuRef.value.contains(event.target)) {
		showChatMenu.value = false
	}
	if (reactionPickerRef.value && !reactionPickerRef.value.contains(event.target)) {
		showReactionPicker.value = null
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
	mediaPreview.value.forEach(media => {
		if (media.preview) URL.revokeObjectURL(media.preview)
	})
})
</script>

<style scoped>
.animate-bounce {
	animation: bounce 1s infinite;
}

@keyframes bounce {
	0%, 20%, 53%, 80%, 100% {
		transform: translate3d(0,0,0);
	}
	40%, 43% {
		transform: translate3d(0,-30px,0);
	}
	70% {
		transform: translate3d(0,-15px,0);
	}
	90% {
		transform: translate3d(0,-4px,0);
	}
}

/* Hide scrollbar for recently active chats */
.overflow-x-auto::-webkit-scrollbar {
	display: none;
}
::-webkit-scrollbar {
  width: 0px;
}

</style>