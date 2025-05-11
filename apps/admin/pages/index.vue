<template>
  	 	 	
  <div>
    		<!-- Stats overview -->
    		 		 		
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      			 			 			
      <div v-for="stat in stats" :key="stat.name" class="bg-white overflow-hidden shadow-sm rounded-lg">
        				 				 				
        <div class="p-5">
          					 					 					
          <div class="flex items-center">
            						 						 						
            <div class="flex-shrink-0">
              							<Icon :name="stat.icon" :class="`h-6 w-6 text-${stat.color}-600`" aria-hidden="true" /> 						 						 						
            </div>
            						 						 						
            <div class="ml-5 w-0 flex-1">
              							 							 							
              <dl>
                								 								 								
                <dt class="text-sm font-medium text-gray-500 truncate">									{{ stat.name }} 								 								</dt>
                								 								 								
                <dd class="flex items-baseline">
                  									 									 									
                  <div class="text-2xl font-semibold text-gray-900">										{{ stat.value }} 									 									</div>
                  									 									 									
                  <div
                    :class="[
                      stat.change >= 0 ? 'text-success-600' : 'text-error-600',
                      'ml-2 flex items-baseline text-sm font-semibold',
                    ]"
                  >
                    										<Icon
                      :name="stat.change >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                      class="h-4 w-4 flex-shrink-0 self-center"
                      aria-hidden="true"
                    />
                    										<span class="ml-1">{{ Math.abs(stat.change) }}%</span> 									 									 									
                  </div>
                  								 								 								
                </dd>
                							 							 							
              </dl>
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>
      		 		 		
    </div>

    		<!-- Recent activity -->
    		 		 		
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      			<!-- Top creators -->
      			 			 			
      <div class="bg-white shadow-sm rounded-lg">
        				 				 				
        <div class="p-6">
          					 					 					
          <h3 class="text-lg font-medium text-gray-900">						Top Creators 					</h3>
          					 					 					
          <div class="mt-4">
            						 						 						
            <div class="flow-root">
              							 							 							
              <ul class="-my-5 divide-y divide-gray-200">
                								 								 								
                <li v-for="creator in topCreators" :key="creator.id" class="py-4">
                  									 									 									
                  <div class="flex items-center space-x-4">
                    										 										 										
                    <div class="avatar h-10 w-10">
                      											<img :src="creator.avatar" :alt="creator.name" class="h-full w-full object-cover rounded-full" /> 										
                      										 										
                    </div>
                    										 										 										
                    <div class="flex-1 min-w-0">
                      											 											 											
                      <p class="text-sm font-medium text-gray-900 truncate">												{{ creator.name }} 											 											</p>
                      											 											 											
                      <p class="text-sm text-gray-500">												{{ creator.subscribers }} subscribers 											 											</p>
                      										 										 										
                    </div>
                    										 										 										
                    <div class="text-sm font-medium text-success-600">											${{ creator.earnings }} 										 										</div>
                    									 									 									
                  </div>
                  								 								 								
                </li>
                							 							 							
              </ul>
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>

      			<!-- Recent reports -->
      			 			 			
      <div class="bg-white shadow-sm rounded-lg">
        				 				 				
        <div class="p-6">
          					 					 					
          <h3 class="text-lg font-medium text-gray-900">						Recent Reports 					</h3>
          					 					 					
          <div class="mt-4">
            						 						 						
            <div class="flow-root">
              							 							 							
              <ul class="-my-5 divide-y divide-gray-200">
                								 								 								
                <li v-for="report in recentReports" :key="report.id" class="py-4">
                  									 									 									
                  <div class="flex items-center space-x-4">
                    										 										 										
                    <div :class="[report.type === 'content' ? 'bg-warning-100' : 'bg-error-100', 'rounded-full p-2']">
                      											<Icon
                        :name="report.type === 'content' ? 'lucide:file' : 'lucide:user'"
                        :class="[report.type === 'content' ? 'text-warning-600' : 'text-error-600', 'h-5 w-5']"
                      />
                      										 										 										
                    </div>
                    										 										 										
                    <div class="flex-1 min-w-0">
                      											 											 											
                      <p class="text-sm font-medium text-gray-900">												{{ report.title }} 											 											</p>
                      											 											 											
                      <p class="text-sm text-gray-500">												{{ report.description }} 											 											</p>
                      										 										 										
                    </div>
                    										 										 										
                    <div class="text-sm text-gray-500">											{{ formatTime(report.time) }} 										 										</div>
                    									 									 									
                  </div>
                  								 								 								
                </li>
                							 							 							
              </ul>
              						 						 						
            </div>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>
      		 		 		
    </div>

    		<!-- Pending actions -->
    		 		 		
    <div class="mt-8 bg-white shadow-sm rounded-lg">
      			 			 			
      <div class="p-6">
        				 				 				
        <h3 class="text-lg font-medium text-gray-900">					Pending Actions 				</h3>
        				 				 				
        <div class="mt-4">
          					 					 					
          <div class="overflow-x-auto">
            						 						 						
            <table class="min-w-full divide-y divide-gray-200">
              							 							 							
              <thead>
                								 								 								
                <tr>
                  									 									 									
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    										Type 									 									 									
                  </th>
                  									 									 									
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    										Description 									 									 									
                  </th>
                  									 									 									
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    										Status 									 									 									
                  </th>
                  									 									 									
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    										Time 									 									 									
                  </th>
                  									 									 									
                  <th scope="col" class="relative px-6 py-3">										<span class="sr-only">Actions</span> 									 									</th>
                  								 								 								
                </tr>
                							 							 							
              </thead>
              							 							 							
              <tbody class="bg-white divide-y divide-gray-200">
                								 								 								
                <tr v-for="action in pendingActions" :key="action.id">
                  									 									 									
                  <td class="px-6 py-4 whitespace-nowrap">
                    										 										 										
                    <div class="flex items-center">
                      											<Icon :name="action.icon" :class="`h-5 w-5 text-${action.color}-600 mr-2`" /> 											<span
                        class="text-sm font-medium text-gray-900"
                      >
                        												{{ action.type }} 											</span
                      >
                      										 										 										
                    </div>
                    									 									 									
                  </td>
                  									 									 									
                  <td class="px-6 py-4 whitespace-nowrap">
                    										 										 										
                    <div class="text-sm text-gray-900">											{{ action.description }} 										 										</div>
                    									 									 									
                  </td>
                  									 									 									
                  <td class="px-6 py-4 whitespace-nowrap">
                    										<span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-warning-100 text-warning-800': action.status === 'pending',
                        'bg-success-100 text-success-800': action.status === 'approved',
                        'bg-error-100 text-error-800': action.status === 'rejected',
                      }"
                    >
                      											{{ action.status }} 										</span
                    >
                    									 									 									
                  </td>
                  									 									 									
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">										{{ formatTime(action.time) }} 									 									</td>
                  									 									 									
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    										<button class="text-primary-600 hover:text-primary-900 mr-3" @click="approveAction(action)">
                      											Approve 										 										 										
                    </button>
                    										<button class="text-error-600 hover:text-error-900" @click="rejectAction(action)">											Reject 										 										</button> 									
                    									 									
                  </td>
                  								 								 								
                </tr>
                							 							 							
              </tbody>
              						 						 						
            </table>
            					 					 					
          </div>
          				 				 				
        </div>
        			 			 			
      </div>
      		 		 		
    </div>
    	 	 	
  </div>
</template>

<script setup>
const stats = [
  {
    name: 'Total Users',
    value: '24,583',
    change: 12,
    icon: 'lucide:users',
    color: 'primary',
  },
  {
    name: 'Monthly Revenue',
    value: '$45,234',
    change: 8.2,
    icon: 'lucide:dollar-sign',
    color: 'success',
  },
  {
    name: 'Active Creators',
    value: '1,234',
    change: -2.3,
    icon: 'lucide:video',
    color: 'secondary',
  },
]

const topCreators = [
  {
    id: 1,
    name: 'Jane Smith',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    subscribers: 15234,
    earnings: '12,345',
  },
  {
    id: 2,
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    subscribers: 12456,
    earnings: '10,234',
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    subscribers: 9876,
    earnings: '8,765',
  },
]

const recentReports = [
  {
    id: 1,
    type: 'content',
    title: 'Inappropriate Content',
    description: 'Content reported for violating guidelines',
    time: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 2,
    type: 'user',
    title: 'User Harassment',
    description: 'Multiple reports of harassment in comments',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: 'content',
    title: 'Copyright Violation',
    description: 'Content reported for copyright infringement',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
]

const pendingActions = [
  {
    id: 1,
    type: 'Creator Application',
    description: 'New creator application from John Smith',
    status: 'pending',
    time: new Date(Date.now() - 45 * 60 * 1000),
    icon: 'lucide:user-plus',
    color: 'primary',
  },
  {
    id: 2,
    type: 'Payout Request',
    description: '$1,234 payout request from Jane Doe',
    status: 'pending',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: 'lucide:credit-card',
    color: 'success',
  },
  {
    id: 3,
    type: 'Content Appeal',
    description: 'Appeal for removed content #12345',
    status: 'pending',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: 'lucide:file-question',
    color: 'warning',
  },
]

function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)

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

function approveAction(action) {
  // Implement approval logic
  console.log('Approving action:', action)
}

function rejectAction(action) {
  // Implement rejection logic
  console.log('Rejecting action:', action)
}
</script>
