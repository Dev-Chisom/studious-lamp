<template>
  	 	 	
  <footer class="bg-white border-t border-gray-200">
    		 		 		
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      			 			 			
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        				<!-- Logo and description -->
        				 				 				
        <div class="md:col-span-1">
          					<NuxtLink to="/" class="flex items-center">
            						<!-- <img
              class="h-8 w-auto"
              src="/logo.svg"
              alt="Whispers"
            /> -->
            						<span class="ml-2 text-xl font-bold text-primary-600">Whispers</span> 					</NuxtLink
          >
          					 					 					
          <p class="mt-4 text-sm text-gray-600">
            						Connect with creators, access exclusive content, and support your 						favorites. 					 					 					
          </p>
          				 				 				
        </div>

        				<!-- Footer links -->
        				 				 				
        <div>
          					 					 					
          <h3 class="text-sm font-medium text-gray-900">						Platform 					</h3>
          					 					 					
          <ul class="mt-4 space-y-2">
            						 						 						
            <li v-for="item in platformLinks" :key="item.name">
              							<NuxtLink :to="item.href" class="text-sm text-gray-600 hover:text-primary-600">
                								{{ item.name }} 							</NuxtLink
              >
              						 						 						
            </li>
            					 					 					
          </ul>
          				 				 				
        </div>
        				<!-- <div>
          <h3 class="text-sm font-medium text-gray-900">For Creators</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="item in creatorLinks" :key="item.name">
              <NuxtLink :to="item.href" class="text-sm text-gray-600 hover:text-primary-600">
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div> -->
        				 				 				
        <div>
          					 					 					
          <h3 class="text-sm font-medium text-gray-900">						Legal 					</h3>
          					 					 					
          <ul class="mt-4 space-y-2">
            						 						 						
            <li v-for="item in legalLinks" :key="item.name">
              							<NuxtLink :to="item.href" class="text-sm text-gray-600 hover:text-primary-600">
                								{{ item.name }} 							</NuxtLink
              >
              						 						 						
            </li>
            					 					 					
          </ul>
          				 				 				
        </div>
        			 			 			
      </div>

      			<!-- Bottom section -->
      			 			 			
      <div class="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
        				 				 				
        <p class="text-sm text-gray-500">					&copy; {{ new Date().getFullYear() }} Whispers. All rights reserved. 				 				</p>
        				 				 				
        <div class="mt-4 md:mt-0 flex space-x-6">
          					<a v-for="item in socialLinks" :key="item.name" :href="item.href" class="text-gray-400 hover:text-gray-500">
            						<span class="sr-only">{{ item.name }}</span> 						<Icon :name="item.icon" class="h-5 w-5" /> 					</a
          >
          				 				 				
        </div>
        			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </footer>
</template>

<script setup>
const platformLinks = [
  { name: 'Explore', href: '/explore' },
  { name: 'How It Works', href: '/how-it-works' },
  // { name: 'Pricing', href: '/pricing' },
  // { name: 'FAQ', href: '/faq' },
]

// const creatorLinks = [
//   { name: 'Become a Creator', href: '/creators/apply' },
//   { name: 'Creator Guidelines', href: '/creators/guidelines' },
//   { name: 'Resources', href: '/creators/resources' },
//   { name: 'Success Stories', href: '/creators/success-stories' },
// ];

const legalLinks = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  // { name: 'Cookie Policy', href: '/cookies' },
  // { name: 'Content Policy', href: '/content-policy' },
]

const socialLinks = [
  { name: 'Twitter', href: '#', icon: 'lucide:twitter' },
  { name: 'Instagram', href: '#', icon: 'lucide:instagram' },
  { name: 'Facebook', href: '#', icon: 'lucide:facebook' },
  { name: 'TikTok', href: '#', icon: 'lucide:music' },
]
</script>
