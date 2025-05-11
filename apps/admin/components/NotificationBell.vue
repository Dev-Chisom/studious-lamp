<template>
  	 	 	
  <div class="relative">
    		<button
      class="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
      @click="isOpen = !isOpen"
    >
      			<Icon name="lucide:bell" class="w-5 h-5" /> 			<span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-secondary-500 text-white text-xs flex items-center justify-center transform -translate-y-1/4 translate-x-1/4"
      >
        				{{ unreadCount > 9 ? '9+' : unreadCount }} 			</span
      >
      		 		 		
    </button>

    		 		 		
    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
    >
      			 			 			
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        				 				 				
        <h3 class="text-sm font-semibold text-gray-900">					Notifications 				</h3>
        				<button
          v-if="notifications.length > 0"
          class="text-xs text-primary-600 hover:text-primary-800"
          @click="markAllAsRead"
        >
          					Mark all as read 				 				 				
        </button>
        			 			 			
      </div>

      			 			 			
      <div class="max-h-96 overflow-y-auto">
        				 				 				
        <div v-if="notifications.length === 0" class="py-6 text-center">
          					<Icon name="lucide:bell-off" class="mx-auto h-8 w-8 text-gray-400" /> 					 					 					
          <p class="mt-2 text-sm text-gray-500">						No notifications yet 					</p>
          				 				 				
        </div>

        				 				 				
        <div v-else>
          					<NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @read="markAsRead(notification.id)"
          />
          				 				 				
        </div>
        			 			 			
      </div>

      			 			 			
      <div class="px-4 py-2 border-t border-gray-100 text-center">
        				<NuxtLink to="/notifications" class="text-xs text-primary-600 hover:text-primary-800" @click="isOpen = false">
          					View all notifications 				</NuxtLink
        >
        			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'subscription',
    content: 'John Doe subscribed to your profile',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    type: 'tip',
    content: 'You received a $10 tip from Jane Smith',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 3,
    type: 'post_like',
    content: 'Your post received 10 new likes',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    image: '',
  },
])

const unreadCount = computed(() => {
  return notifications.value.filter((notification) => !notification.isRead).length
})

function markAsRead(id) {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.isRead = true
  }
}

function markAllAsRead() {
  notifications.value.forEach((notification) => {
    notification.isRead = true
  })
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
