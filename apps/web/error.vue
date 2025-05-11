<template>
  	 	 	
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    		 		 		
    <div class="w-full max-w-md space-y-8 text-center">
      			 			 			
      <div>
        				<!-- <img
          class="mx-auto h-16 w-auto"
          src="/logo.svg"
          alt="Whispers"
        /> -->
        				 				 				
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          					{{ error.statusCode === 404 ? 'Page not found' : 'An error occurred' }} 				 				 				
        </h2>
        				 				 				
        <p class="mt-2 text-gray-600">
          					{{
            error.statusCode === 404
              ? "We couldn't find the page you're looking for."
              : "We're sorry, but something went wrong."
          }}
          				 				 				
        </p>
        			 			 			
      </div>
      			 			 			
      <div class="mt-8">
        				<button class="btn-primary w-full" @click="handleError">
          					{{ error.statusCode === 404 ? 'Go back home' : 'Try again' }} 				 				 				
        </button>
        			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup>
defineProps({
  error: Object,
})

function handleError() {
  if (error.value?.statusCode === 404) {
    return navigateTo('/')
  }
  clearError({ redirect: '/' })
}
</script>
