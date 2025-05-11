<template>
	<div>
		<!-- Cover image -->

		<div class="h-64 bg-gray-200 relative">
			<img v-if="creator.coverImage" :src="creator.coverImage" alt="Cover" class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
		</div>

		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Profile header -->

			<div class="relative -mt-24 mb-8 flex flex-col items-center">
				<div class="avatar h-32 w-32 ring-4 ring-white">
					<img :src="creator.profileImage" :alt="creator.displayName" class="h-full w-full object-cover" />
				</div>

				<div class="mt-4 text-center">
					<div class="flex items-center justify-center">
						<h1 class="text-2xl font-bold">{{ creator.displayName }}</h1>
						<span v-if="creator.isVerified" class="ml-2 text-primary-500">
							<Icon name="lucide:badge-check" class="h-5 w-5" />
						</span>
					</div>

					<p class="text-gray-500">@{{ creator.username }}</p>

					<div class="mt-4 flex items-center justify-center space-x-4">
						<div class="text-center">
							<p class="text-2xl font-bold">{{ creator.subscriberCount.toLocaleString() }}</p>

							<p class="text-sm text-gray-500">Subscribers</p>
						</div>

						<div class="text-center">
							<p class="text-2xl font-bold">{{ creator.postCount.toLocaleString() }}</p>

							<p class="text-sm text-gray-500">Posts</p>
						</div>
					</div>

					<p class="mt-4 max-w-2xl text-gray-600">{{ creator.bio }}</p>

					<div class="mt-4 flex flex-wrap justify-center gap-2">
						<span v-for="category in creator.categories" :key="category" class="badge badge-primary">
							{{ category }}
						</span>
					</div>
				</div>
			</div>

			<!-- Subscription plans -->

			<div class="max-w-4xl mx-auto mb-12">
				<div class="bg-white rounded-xl shadow-sm overflow-hidden">
					<div class="p-6 sm:p-8">
						<h2 class="text-xl font-bold mb-6">Subscribe to {{ creator.displayName }}</h2>

						<div class="grid gap-8 md:grid-cols-2">
							<!-- Monthly plan -->

							<div class="border rounded-lg p-6">
								<h3 class="text-lg font-semibold mb-2">Monthly</h3>

								<p class="text-3xl font-bold mb-4">
									${{ creator.monthlyPrice }} <span class="text-base font-normal text-gray-500">/month</span>
								</p>

								<ul class="space-y-3 mb-6">
									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> Access to all exclusive content
									</li>

									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> Direct messaging
									</li>

									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> Cancel anytime
									</li>
								</ul>

								<button class="btn-primary w-full" @click="subscribe('monthly')">Subscribe Monthly</button>
							</div>

							<!-- Yearly plan -->

							<div v-if="creator.yearlyPrice" class="border rounded-lg p-6 relative overflow-hidden">
								<div
									class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-secondary-500 text-white text-xs font-bold py-1 px-3 rounded-full transform rotate-45"
								>
									Best Value
								</div>

								<h3 class="text-lg font-semibold mb-2">Yearly</h3>

								<p class="text-3xl font-bold mb-4">
									${{ creator.yearlyPrice }} <span class="text-base font-normal text-gray-500">/year</span>
								</p>

								<div class="mb-4">
									<span class="text-sm bg-success-100 text-success-800 px-2 py-1 rounded">
										Save {{ calculateYearlySavings }}%
									</span>
								</div>

								<ul class="space-y-3 mb-6">
									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> All monthly benefits
									</li>

									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> 2 months free
									</li>

									<li class="flex items-center text-sm">
										<Icon name="lucide:check" class="h-5 w-5 text-success-500 mr-2" /> Exclusive yearly subscriber perks
									</li>
								</ul>

								<button class="btn-primary w-full" @click="subscribe('yearly')">Subscribe Yearly</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Content preview -->

			<div class="max-w-4xl mx-auto">
				<h2 class="text-xl font-bold mb-6">Recent Posts</h2>

				<div class="grid gap-6 md:grid-cols-2">
					<div v-for="post in previewPosts" :key="post.id" class="card">
						<div class="relative aspect-video bg-gray-100">
							<img
								v-if="post.mediaUrls && post.mediaUrls[0]"
								:src="post.mediaUrls[0]"
								alt="Post preview"
								class="w-full h-full object-cover"
							/>

							<div
								v-if="post.visibility !== 'public'"
								class="absolute inset-0 bg-black/50 flex items-center justify-center"
							>
								<div class="text-center text-white">
									<Icon name="lucide:lock" class="h-8 w-8 mx-auto mb-2" />
									<p class="font-medium">Subscribers Only</p>
								</div>
							</div>
						</div>

						<div class="p-4">
							<h3 class="font-medium mb-2">{{ post.title }}</h3>

							<p class="text-sm text-gray-500 line-clamp-2">{{ post.content }}</p>

							<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
								<span>{{ formatDate(post.createdAt) }}</span>
								<div class="flex items-center space-x-4">
									<span class="flex items-center">
										<Icon name="lucide:heart" class="h-4 w-4 mr-1" /> {{ post.likes }}
									</span>
									<span class="flex items-center">
										<Icon name="lucide:message-square" class="h-4 w-4 mr-1" /> {{ post.comments }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="my-8 text-center">
					<p class="text-gray-500 mb-4">Subscribe to see {{ creator.postCount - previewPosts.length }} more posts</p>
					<button class="btn-primary">Subscribe Now</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useSubscriptionStore } from '~/stores/subscription';
import { useContentStore } from '~/stores/content';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const subscriptionStore = useSubscriptionStore();
const contentStore = useContentStore();
const authStore = useAuthStore();

// Fetch creator data
onMounted(async () => {
	try {
		await subscriptionStore.fetchCreators();
		await contentStore.fetchPosts({ creatorId: creator.value?.id });
	} catch (error) {
		console.error('Failed to fetch creator data:', error);
	}
});

// Get creator by username from route params
const creator = computed(() => {
	return (
		subscriptionStore.creators.find((c) => c.username === route.params.username) || {
			id: '404',
			displayName: 'Creator not found',
			username: route.params.username,
			bio: 'This creator does not exist or has been removed.',
			profileImage:
				'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200',
			subscriberCount: 0,
			postCount: 0,
			monthlyPrice: 0,
			categories: [],
		}
	);
});

// Calculate yearly savings percentage
const calculateYearlySavings = computed(() => {
	if (!creator.value.yearlyPrice || !creator.value.monthlyPrice) {
		return 0;
	}
	const monthlyTotal = creator.value.monthlyPrice * 12;
	const yearlyTotal = creator.value.yearlyPrice;
	return Math.round((1 - yearlyTotal / monthlyTotal) * 100);
});

// Get preview posts (public only)
const previewPosts = computed(() => {
	return contentStore.posts
		.filter((post) => post.creatorId === creator.value.id && post.visibility === 'public')
		.slice(0, 4);
});

function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

async function subscribe(plan) {
	if (!authStore.isAuthenticated) {
		navigateTo('https://studious-lamp-creator.vercel.app/auth/login');
		return;
	}

	try {
		await subscriptionStore.subscribe(authStore.user.id, creator.value.id, plan);
		toast.success(`Successfully subscribed to ${creator.value.displayName}`);
	} catch (error) {
		toast.error('Failed to process subscription');
	}
}
</script>
