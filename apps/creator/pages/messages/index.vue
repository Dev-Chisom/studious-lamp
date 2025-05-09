<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Messages</h1>
      
      <div class="bg-white rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3">
          <!-- Conversations list -->
          <div class="border-r border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <FormInput
                v-model="searchQuery"
                placeholder="Search messages..."
                icon="lucide:search"
              />
            </div>
            
            <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              <div
                v-for="chat in filteredChats"
                :key="chat.id"
                class="p-4 hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-primary-50': selectedChat?.id === chat.id }"
                @click="selectChat(chat)"
              >
                <div class="flex items-center space-x-3">
                  <div class="avatar h-10 w-10">
                    <img
                      :src="chat.user.avatar"
                      :alt="chat.user.name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ chat.user.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatTime(chat.lastMessage.timestamp) }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-500 truncate">
                      {{ chat.lastMessage.content }}
                    </p>
                  </div>
                </div>
                <div v-if="chat.unreadCount > 0" class="mt-1 flex items-center justify-end">
                  <span class="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {{ chat.unreadCount }}
                  </span>
                </div>
              </div>
              
              <div v-if="filteredChats.length === 0" class="p-8 text-center text-gray-500">
                No messages found
              </div>
            </div>
          </div>

          <!-- Chat window -->
          <div class="col-span-2 flex flex-col h-[600px]">
            <template v-if="selectedChat">
              <!-- Chat header -->
              <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="avatar h-10 w-10">
                    <img
                      :src="selectedChat.user.avatar"
                      :alt="selectedChat.user.name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 class="text-lg font-medium">{{ selectedChat.user.name }}</h2>
                    <p class="text-sm text-gray-500">
                      {{ selectedChat.user.isOnline ? 'Online' : 'Offline' }}
                    </p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <Icon name="lucide:more-vertical" class="h-5 w-5" />
                </button>
              </div>

              <!-- Messages -->
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div
                  v-for="message in selectedChat.messages"
                  :key="message.id"
                  class="flex"
                  :class="message.isSelf ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[70%] rounded-lg px-4 py-2"
                    :class="message.isSelf ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-900'"
                  >
                    <!-- Media preview -->
                    <div v-if="message.media" class="mb-2">
                      <!-- Image -->
                      <img
                        v-if="message.media.type === 'image'"
                        :src="message.media.url"
                        :alt="message.content"
                        class="rounded-lg max-h-48 cursor-pointer"
                        @click="openMediaPreview(message.media)"
                      />
                      
                      <!-- Video -->
                      <video
                        v-else-if="message.media.type === 'video'"
                        :src="message.media.url"
                        controls
                        controlsList="nodownload"
                        class="rounded-lg max-h-48 w-full"
                      ></video>
                    </div>
                    
                    <p class="text-sm">{{ message.content }}</p>
                    <div class="flex items-center justify-end mt-1 space-x-1">
                      <p class="text-xs opacity-70">
                        {{ formatTime(message.timestamp) }}
                      </p>
                      <!-- Read receipt -->
                      <Icon
                        v-if="message.isSelf"
                        :name="message.isRead ? 'lucide:check-check' : 'lucide:check'"
                        class="h-4 w-4"
                        :class="message.isRead ? 'text-accent-500' : 'opacity-70'"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Typing indicator -->
                <div
                  v-if="selectedChat.isTyping"
                  class="flex items-center space-x-2 text-gray-500"
                >
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                  </div>
                  <span class="text-sm">{{ selectedChat.user.name }} is typing...</span>
                </div>
              </div>

              <!-- Message input -->
              <div class="p-4 border-t border-gray-200">
                <form @submit.prevent="sendMessage" class="space-y-4">
                  <!-- Media preview -->
                  <div v-if="mediaPreview.length > 0" class="flex space-x-2 overflow-x-auto pb-2">
                    <div
                      v-for="(media, index) in mediaPreview"
                      :key="index"
                      class="relative flex-shrink-0"
                    >
                      <img
                        v-if="media.type === 'image'"
                        :src="media.preview"
                        class="h-20 w-20 object-cover rounded-lg"
                      />
                      <video
                        v-else-if="media.type === 'video'"
                        :src="media.preview"
                        controlsList="nodownload"
                        class="h-20 w-20 object-cover rounded-lg"
                      ></video>
                      <button
                        @click="removeMedia(index)"
                        class="absolute -top-2 -right-2 bg-error-100 rounded-full p-1 text-error-600 hover:bg-error-200"
                      >
                        <Icon name="lucide:x" class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <FormInput
                      v-model="newMessage"
                      placeholder="Type a message..."
                      class="flex-1"
                      @input="handleTyping"
                    />
                    
                    <!-- Media upload buttons -->
                    <div class="flex space-x-2">
                      <input
                        ref="imageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        class="hidden"
                        @change="handleImageUpload"
                      />
                      <input
                        ref="videoInput"
                        type="file"
                        accept="video/*"
                        class="hidden"
                        @change="handleVideoUpload"
                      />
                      
                      <button
                        type="button"
                        class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full"
                        @click="$refs.imageInput.click()"
                      >
                        <Icon name="lucide:image" class="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full"
                        @click="$refs.videoInput.click()"
                      >
                        <Icon name="lucide:video" class="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                      <Icon name="lucide:send" class="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </template>

            <div v-else class="flex-1 flex items-center justify-center text-gray-500">
              <div class="text-center">
                <Icon name="lucide:message-square" class="h-12 w-12 mx-auto mb-2" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media preview modal -->
    <div
      v-if="mediaModal.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click="closeMediaPreview"
    >
      <div class="max-w-4xl max-h-[90vh] p-4">
        <img
          v-if="mediaModal.type === 'image'"
          :src="mediaModal.url"
          class="max-w-full max-h-full rounded-lg"
          @click.stop
        />
        <video
          v-else-if="mediaModal.type === 'video'"
          :src="mediaModal.url"
          controls
          controlsList="nodownload"
          class="max-w-full max-h-full rounded-lg"
          @click.stop
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import FormInput from '@/components/ui/FormInput.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'creator',
  meta: {
    requiresAuth: true
  }
});

// State
const searchQuery = ref('');
const selectedChat = ref(null);
const newMessage = ref('');
const typingTimeout = ref(null);
const mediaPreview = ref([]);
const mediaModal = ref({
  isOpen: false,
  type: null,
  url: null
});

// Mock data for chats
const chats = ref([
  {
    id: '1',
    user: {
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      isOnline: true
    },
    lastMessage: {
      content: 'Thank you for subscribing!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    unreadCount: 2,
    isTyping: false,
    messages: [
      {
        id: '1',
        content: 'Hi there! Thanks for checking out my content',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isSelf: false,
        isRead: true
      },
      {
        id: '2',
        content: 'Your latest post was amazing!',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isSelf: true,
        isRead: true
      },
      {
        id: '3',
        content: 'Thank you for subscribing!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isSelf: false,
        isRead: false,
        media: {
          type: 'image',
          url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      }
    ]
  },
  {
    id: '2',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      isOnline: false
    },
    lastMessage: {
      content: 'Check out my new photo collection!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    unreadCount: 0,
    isTyping: false,
    messages: [
      {
        id: '1',
        content: 'Hey! I just posted a new photo collection',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isSelf: false,
        isRead: true
      },
      {
        id: '2',
        content: 'Check out my new photo collection!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isSelf: false,
        isRead: true,
        media: {
          type: 'video',
          url: 'https://player.vimeo.com/external/394678700.sd.mp4?s=353646b8d6a0da48b40f6a3fe0e8f09797c1f5dd&profile_id=165&oauth2_token_id=57447761'
        }
      }
    ]
  }
]);

// Computed
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value;
  
  const query = searchQuery.value.toLowerCase();
  return chats.value.filter(chat => 
    chat.user.name.toLowerCase().includes(query) ||
    chat.lastMessage.content.toLowerCase().includes(query)
  );
});

// Methods
function formatTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}

function selectChat(chat) {
  selectedChat.value = chat;
  // Mark messages as read
  chat.unreadCount = 0;
  chat.messages.forEach(message => {
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

async function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      mediaPreview.value.push({
        file,
        type: 'image',
        preview
      });
    }
  }
  
  event.target.value = '';
}

async function handleVideoUpload(event) {
  const file = event.target.files[0];
  
  if (file && file.type.startsWith('video/')) {
    const preview = URL.createObjectURL(file);
    mediaPreview.value.push({
      file,
      type: 'video',
      preview
    });
  }
  
  event.target.value = '';
}

function removeMedia(index) {
  const media = mediaPreview.value[index];
  URL.revokeObjectURL(media.preview);
  mediaPreview.value.splice(index, 1);
}

function openMediaPreview(media) {
  mediaModal.value = {
    isOpen: true,
    type: media.type,
    url: media.url
  };
}

function closeMediaPreview() {
  mediaModal.value.isOpen = false;
}

async function sendMessage() {
  if (!newMessage.value.trim() && mediaPreview.value.length === 0) return;
  
  try {
    // In a real app, upload media files to server and get URLs
    const mediaUrls = mediaPreview.value.map(media => ({
      type: media.type,
      url: media.preview // In real app, this would be the uploaded file URL
    }));
    
    const message = {
      id: `msg-${Date.now()}`,
      content: newMessage.value,
      timestamp: new Date(),
      isSelf: true,
      isRead: false
    };
    
    if (mediaUrls.length > 0) {
      message.media = mediaUrls[0]; // For now, just use the first media item
    }
    
    selectedChat.value.messages.push(message);
    selectedChat.value.lastMessage = {
      content: newMessage.value || 'Sent a media file',
      timestamp: new Date()
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
          isRead: true
        });
      }, 3000);
    }, 1000);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// Cleanup
onUnmounted(() => {
  mediaPreview.value.forEach(media => {
    URL.revokeObjectURL(media.preview);
  });
});
</script>