<template>
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">My Collections</h1>
        <Button @click="showNewCollectionModal = true" variant="primary">
          New Collection
        </Button>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="collection in collections" :key="collection.id" class="hover:shadow-hover transition-shadow">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ collection.name }}</h3>
            <p class="text-gray-500">{{ collection.posts.length }} posts</p>
            
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(post, index) in collection.posts.slice(0, 4)" :key="index" class="aspect-square">
                <img 
                  :src="post.image" 
                  :alt="post.title"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
  
            <Button @click="viewCollection(collection)" variant="outline" class="w-full">
              View Collection
            </Button>
          </div>
        </Card>
      </div>
  
      <!-- New Collection Modal -->
      <Modal v-if="showNewCollectionModal" @close="showNewCollectionModal = false">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Create New Collection</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
              <input 
                v-model="newCollectionName"
                type="text"
                class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                placeholder="My Favorite Posts"
              />
            </div>
            
            <Button 
              @click="createNewCollection"
              :loading="isCreating"
              variant="primary"
              class="w-full"
            >
              Create Collection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useUserStore } from '~/stores/user'
  import { toast } from 'vue3-toastify'
  import Button from '~/components/ui/Button.vue'
  
  const userStore = useUserStore()
  const collections = ref(userStore.getCollections)
  
  const showNewCollectionModal = ref(false)
  const newCollectionName = ref('')
  const isCreating = ref(false)
  
  const createNewCollection = async () => {
    if (!newCollectionName.value.trim()) return
  
    isCreating.value = true
    try {
      await userStore.createCollection(newCollectionName.value)
      collections.value = userStore.getCollections
      showNewCollectionModal.value = false
      newCollectionName.value = ''
      toast.success('Collection created successfully!')
    } catch (error) {
      toast.error('Failed to create collection')
    } finally {
      isCreating.value = false
    }
  }
  
  const viewCollection = (collection: any) => {
    // Navigate to collection detail view
    navigateTo(`/collections/${collection.id}`)
  }
  </script>