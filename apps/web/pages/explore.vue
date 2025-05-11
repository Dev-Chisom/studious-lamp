<template>
  	 	 	
  <div class="py-8 bg-gray-50 min-h-screen">
    		 		 		
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      			 			 			
      <div class="text-center mb-8">
        				 				 				
        <h1 class="text-3xl font-bold text-gray-900">					Explore Creators 				</h1>
        				 				 				
        <p class="mt-2 text-lg text-gray-600">					Discover and follow amazing creators from various categories 				 				</p>
        			 			 			
      </div>

      			<!-- Search and filters -->
      			 			 			
      <div class="mb-8 bg-white rounded-lg shadow-sm p-4 lg:p-6">
        				 				 				
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          					 					 					
          <div class="md:col-span-2">
            						<label for="search" class="sr-only">Search creators</label> 						 						 						
            <div class="relative">
              							 							 							
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                								<Icon name="lucide:search" class="h-5 w-5 text-gray-400" /> 							 							 							
              </div>
              							<input
                id="search"
                v-model="searchQuery"
                type="search"
                class="form-input pl-10"
                placeholder="Search for creators..."
              />
              						 						 						
            </div>
            					 					 					
          </div>
          					 					 					
          <div>
            						<select v-model="selectedCategory" class="form-input">
              							 							 							
              <option value="">								All Categories 							</option>
              							 							 							
              <option v-for="category in categories" :key="category">								{{ category }} 							 							</option>
              						 						 						
            </select>
            					 					 					
          </div>
          				 				 				
        </div>

        				 				 				
        <div class="mt-4 flex flex-wrap gap-2">
          					<button
            v-for="category in popularCategories"
            :key="category"
            class="badge text-sm px-3 py-1 rounded-full"
            :class="
              selectedCategory === category
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            "
            @click="selectedCategory = selectedCategory === category ? '' : category"
          >
            						{{ category }} 					 					 					
          </button>
          				 				 				
        </div>
        			 			 			
      </div>

      			<!-- Featured creators -->
      			 			 			
      <div v-if="!selectedCategory && !searchQuery" class="mb-12">
        				 				 				
        <h2 class="text-2xl font-bold text-gray-900 mb-6">					Featured Creators 				 				</h2>
        				 				 				
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          					 					 					
          <div
            v-for="creator in featuredCreators"
            :key="creator.id"
            class="card transform transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
          >
            						 						 						
            <div class="relative h-32 bg-gray-200">
              							<img v-if="creator.coverImage" :src="creator.coverImage" alt="Cover" class="w-full h-full object-cover" />
              							 							 							
              <div class="absolute -bottom-8 left-4">
                								 								 								
                <div class="avatar h-16 w-16 ring-4 ring-white">
                  									<img :src="creator.profileImage" :alt="creator.displayName" class="h-full w-full object-cover" /> 								 								 								
                </div>
                							 							 							
              </div>
              						 						 						
            </div>

            						 						 						
            <div class="pt-10 px-4 pb-5">
              							 							 							
              <div class="flex items-center">
                								 								 								
                <h3 class="text-lg font-semibold">									{{ creator.displayName }} 								 								</h3>
                								<span v-if="creator.isVerified" class="ml-1 text-primary-500">
                  									<Icon name="lucide:badge-check" class="h-4 w-4" /> 								</span
                >
                							 							 							
              </div>
              							 							 							
              <p class="text-sm text-gray-500 mb-2">								@{{ creator.username }} 							</p>
              							 							 							
              <p class="text-gray-700 mb-4 line-clamp-2">								{{ creator.bio }} 							</p>

              							 							 							
              <div class="flex items-center justify-between mb-4">
                								 								 								
                <div class="text-sm">
                  									<span class="font-semibold">{{ creator.subscriberCount.toLocaleString() }}</span> 									<span
                    class="text-gray-500 ml-1"
                    >subscribers</span
                  >
                  								 								 								
                </div>
                								 								 								
                <div class="flex flex-wrap gap-1">
                  									<span v-for="category in creator.categories" :key="category" class="badge badge-primary">
                    										{{ category }} 									</span
                  >
                  								 								 								
                </div>
                							 							 							
              </div>

              							 							 							
              <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                								 								 								
                <div>
                  									 									 									
                  <p class="text-sm text-gray-500">										From 									</p>
                  									 									 									
                  <p class="font-semibold">										${{ creator.monthlyPrice }}/month 									 									</p>
                  								 								 								
                </div>
                								<NuxtLink :to="`/creators/${creator.username}`" class="btn-primary"> 									View Profile 								</NuxtLink> 							 							 							
              </div>
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>

      			<!-- All creators -->
      			 			 			
      <div>
        				 				 				
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          					{{ selectedCategory ? `${selectedCategory} Creators` : searchQuery ? 'Search Results' : 'All Creators' }} 				 				 				
        </h2>

        				 				 				
        <div v-if="loading" class="py-12 text-center">
          					<Icon name="lucide:loader" class="h-12 w-12 mx-auto animate-spin text-primary-500" /> 					 					 					
          <p class="mt-4 text-gray-600">						Loading creators... 					</p>
          				 				 				
        </div>

        				 				 				
        <div v-else-if="filteredCreators.length === 0" class="py-12 text-center bg-white rounded-lg shadow-sm">
          					<Icon name="lucide:user-x" class="h-16 w-16 mx-auto text-gray-400" /> 					 					 					
          <h3 class="mt-2 text-lg font-medium text-gray-900">						No creators found 					 					</h3>
          					 					 					
          <p class="mt-1 text-gray-500">
            						{{
              searchQuery
                ? `No results for "${searchQuery}"${selectedCategory ? ` in ${selectedCategory}` : ''}.`
                : `No creators found${selectedCategory ? ` in ${selectedCategory}` : ''}.`
            }}
            					 					 					
          </p>
          					<button v-if="searchQuery || selectedCategory" class="mt-4 btn-outline" @click="resetFilters">
            						Clear Filters 					 					 					
          </button>
          				 				 				
        </div>

        				 				 				
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          					 					 					
          <div
            v-for="creator in filteredCreators"
            :key="creator.id"
            class="card transform transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
          >
            						 						 						
            <div class="flex flex-col h-full">
              							 							 							
              <div class="relative p-4">
                								 								 								
                <div class="avatar h-20 w-20 mx-auto">
                  									<img :src="creator.profileImage" :alt="creator.displayName" class="h-full w-full object-cover" /> 								 								 								
                </div>

                								 								 								
                <div class="mt-4 text-center">
                  									 									 									
                  <div class="flex items-center justify-center">
                    										 										 										
                    <h3 class="text-lg font-semibold">											{{ creator.displayName }} 										 										</h3>
                    										<span v-if="creator.isVerified" class="ml-1 text-primary-500">
                      											<Icon name="lucide:badge-check" class="h-4 w-4" /> 										</span
                    >
                    									 									 									
                  </div>
                  									 									 									
                  <p class="text-sm text-gray-500">										@{{ creator.username }} 									</p>
                  								 								 								
                </div>
                							 							 							
              </div>

              							 							 							
              <div class="px-4 py-3 flex-grow">
                								 								 								
                <p class="text-gray-700 text-sm line-clamp-3">									{{ creator.bio }} 								 								</p>

                								 								 								
                <div class="flex flex-wrap gap-1 mt-3">
                  									<span v-for="category in creator.categories" :key="category" class="badge badge-primary text-xs">
                    										{{ category }} 									</span
                  >
                  								 								 								
                </div>
                							 							 							
              </div>

              							 							 							
              <div class="px-4 py-4 border-t border-gray-100 mt-auto">
                								 								 								
                <div class="flex items-center justify-between">
                  									 									 									
                  <div class="text-sm">
                    										<span class="font-semibold">{{ creator.subscriberCount.toLocaleString() }}</span> 										<span
                      class="text-gray-500 ml-1"
                      >fans</span
                    >
                    									 									 									
                  </div>
                  									 									 									
                  <div>
                    										 										 										
                    <p class="text-sm font-semibold">											${{ creator.monthlyPrice }}/mo 										 										</p>
                    									 									 									
                  </div>
                  								 								 								
                </div>
                								 								 								
                <div class="mt-3">
                  									<NuxtLink :to="`/creators/${creator.username}`" class="btn-primary w-full"> 										View Profile 									</NuxtLink> 								 								
                  								
                </div>
                							 							 							
              </div>
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default',
})

const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(false)

// Dummy data for creators
const creators = [
  {
    id: 1,
    displayName: 'Sarah Johnson',
    username: 'sarahj',
    bio: 'Fitness instructor and wellness coach helping people achieve their health goals through personalized training programs.',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 12500,
    categories: ['Fitness', 'Wellness'],
    monthlyPrice: 9.99,
  },
  {
    id: 2,
    displayName: 'David Chen',
    username: 'davidchen',
    bio: 'Digital artist and illustrator sharing my creative process and exclusive artwork with art enthusiasts.',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 8500,
    categories: ['Art', 'Digital'],
    monthlyPrice: 14.99,
  },
  {
    id: 3,
    displayName: 'Michelle Rodriguez',
    username: 'micheller',
    bio: "Travel photographer capturing the world's most beautiful moments and sharing exclusive travel tips.",
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 15600,
    categories: ['Travel', 'Photography'],
    monthlyPrice: 19.99,
  },
  {
    id: 4,
    displayName: 'Alex Thompson',
    username: 'alext',
    bio: 'Professional chef sharing exclusive recipes and cooking techniques with food enthusiasts.',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 9200,
    categories: ['Food', 'Cooking'],
    monthlyPrice: 12.99,
  },
  {
    id: 5,
    displayName: 'Emma Wilson',
    username: 'emmaw',
    bio: 'Yoga instructor and meditation guide helping people find inner peace and physical wellness.',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 7800,
    categories: ['Yoga', 'Meditation'],
    monthlyPrice: 8.99,
  },
  {
    id: 6,
    displayName: 'James Miller',
    username: 'jamesm',
    bio: 'Music producer and composer sharing production tips and exclusive tracks with aspiring musicians.',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 11200,
    categories: ['Music', 'Production'],
    monthlyPrice: 15.99,
  },
]

// Get unique categories from all creators
const categories = computed(() => {
  const allCategories = creators.flatMap((creator) => creator.categories)
  return [...new Set(allCategories)].sort()
})

// Popular categories for quick filtering
const popularCategories = computed(() => {
  return categories.value.slice(0, 6)
})

// Featured creators (top 3 by subscriber count)
const featuredCreators = computed(() => {
  return [...creators].sort((a, b) => b.subscriberCount - a.subscriberCount).slice(0, 3)
})

// Filtered creators based on search and category
const filteredCreators = computed(() => {
  let result = [...creators]

  // Filter by category if selected
  if (selectedCategory.value) {
    result = result.filter((creator) => creator.categories.includes(selectedCategory.value))
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (creator) =>
        creator.displayName.toLowerCase().includes(query) ||
        creator.username.toLowerCase().includes(query) ||
        creator.bio.toLowerCase().includes(query) ||
        creator.categories.some((category) => category.toLowerCase().includes(query)),
    )
  }

  // Exclude featured creators if no filters are applied
  if (!selectedCategory.value && !searchQuery.value) {
    const featuredIds = featuredCreators.value.map((creator) => creator.id)
    result = result.filter((creator) => !featuredIds.includes(creator.id))
  }

  return result
})

// Reset all filters
function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
}
</script>
