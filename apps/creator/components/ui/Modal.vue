<template>
  	 	 	
  <div class="fixed inset-0 overflow-y-auto" style="z-index: 800" @click.self="emit('close')">
    		 		 		
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      			 			 			
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />

      			 			 			
      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
      >
        				 				 				
        <div class="absolute right-0 top-0 pr-4 pt-4">
          					<button
            type="button"
            class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            @click="emit('close')"
          >
            						<span class="sr-only">Close</span> 						<Icon name="lucide:x" class="h-6 w-6" /> 					 					 					
          </button>
          				 				 				
        </div>

        				<slot /> 			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup lang="ts">
interface ModalEmits {
  (e: 'close'): void
}

const emit = defineEmits<ModalEmits>()
</script>
