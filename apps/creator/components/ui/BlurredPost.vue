<template>
  	 	 	
  <div class="relative w-full h-full">
    		<!-- Slot content (image/video) -->
    		<slot />

    		<!-- Blur overlay with centered content -->
    		 		 		
    <div
      class="absolute inset-0 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 flex flex-col items-center justify-center text-center p-6"
    >
      			 			 			
      <div class="max-w-xs mx-auto">
        				 				 				
        <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">					Premium Content 				 				</h3>
        				 				 				
        <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">					Subscribe to unlock this content 				 				</p>
        				<button variant="primary" class="px-4 py-2 text-sm" @click="emit('subscribe')">					Subscribe Now 				 				</button> 			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['subscribe'])
</script>
