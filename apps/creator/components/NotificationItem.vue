<template>
  <div 
    class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-start space-x-3 cursor-pointer"
    :class="{ 'bg-primary-50 dark:bg-primary-900': !notification.isRead }"
    @click="handleClick"
  >
    <div class="avatar h-10 w-10 flex-shrink-0">
      <img 
        v-if="notification.image" 
        :src="notification.image" 
        alt="User" 
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full flex items-center justify-center bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400">
        <Icon :name="getIcon(notification.type)" class="h-5 w-5" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 dark:text-gray-100" :class="{ 'font-semibold': !notification.isRead }">
        {{ notification.content }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-200 mt-1">
        {{ formatTime(notification.createdAt) }}
      </p>
    </div>

    <div v-if="!notification.isRead" class="flex-shrink-0">
      <div class="h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
type NotificationType = 'subscription' | 'tip' | 'message' | 'post_like' | 'post_comment' | 'other'

interface Notification {
  id: string
  type: NotificationType
  content: string
  image?: string
  isRead: boolean
  createdAt: Date | string
  link?: string
}

interface NotificationItemProps {
  notification: Notification
}

interface NotificationItemEmits {
  (e: 'read'): void
}

const props = defineProps<NotificationItemProps>()
const emit = defineEmits<NotificationItemEmits>()

function getIcon(type: NotificationType): string {
  switch (type) {
    case 'subscription':
      return 'lucide:user-plus'
    case 'tip':
      return 'lucide:dollar-sign'
    case 'message':
      return 'lucide:message-circle'
    case 'post_like':
      return 'lucide:heart'
    case 'post_comment':
      return 'lucide:message-square'
    default:
      return 'lucide:bell'
  }
}

function formatTime(date: Date | string): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

function handleClick(): void {
  if (!props.notification.isRead) {
    emit('read')
  }
  // Handle click based on notification type
  // e.g., navigateTo(props.notification.link)
}
</script>