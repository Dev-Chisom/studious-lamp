<template>
	<div>
		<!-- Hero section -->

		<section class="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center">
					<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">How Whispers Works</h1>

					<p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						Connect with creators, access exclusive content, and support your favorites through our simple and secure
						platform.
					</p>
				</div>
			</div>
		</section>

		<!-- For subscribers -->

		<section class="py-16 sm:py-24">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl font-bold">For Subscribers</h2>

					<p class="mt-4 text-lg text-gray-600">
						Follow these simple steps to start enjoying exclusive content from your favorite creators.
					</p>
				</div>

				<div class="grid gap-8 md:grid-cols-3">
					<div class="text-center">
						<div
							class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:user-plus" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Create an Account</h3>

						<p class="text-gray-600">Sign up for free and create your personal profile to get started.</p>
					</div>

					<div class="text-center">
						<div
							class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:search" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Discover Creators</h3>

						<p class="text-gray-600">Browse creators by category and find content that interests you.</p>
					</div>

					<div class="text-center">
						<div
							class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:unlock" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Subscribe & Enjoy</h3>

						<p class="text-gray-600">Choose a subscription plan and get instant access to exclusive content.</p>
					</div>
				</div>

				<div class="mt-12 text-center"><NuxtLink to="/explore" class="btn-primary"> Start Exploring </NuxtLink></div>
			</div>
		</section>

		<!-- For creators -->

		<section class="py-16 sm:py-24 bg-gray-50">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl font-bold">For Creators</h2>

					<p class="mt-4 text-lg text-gray-600">
						Turn your passion into income by sharing exclusive content with your subscribers.
					</p>
				</div>

				<div class="grid gap-8 md:grid-cols-4">
					<div class="text-center">
						<div
							class="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:clipboard" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Apply</h3>

						<p class="text-gray-600">Submit your application to become a verified creator.</p>
					</div>

					<div class="text-center">
						<div
							class="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:settings" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Set Up</h3>

						<p class="text-gray-600">Customize your profile and subscription tiers.</p>
					</div>

					<div class="text-center">
						<div
							class="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:upload" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Create</h3>

						<p class="text-gray-600">Share photos, videos, and updates with your subscribers.</p>
					</div>

					<div class="text-center">
						<div
							class="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Icon name="lucide:dollar-sign" class="h-8 w-8" />
						</div>

						<h3 class="text-xl font-semibold mb-2">Earn</h3>

						<p class="text-gray-600">Get paid monthly for your content and tips.</p>
					</div>
				</div>

				<div class="mt-12 text-center">
					<NuxtLink to="/creators/apply" class="btn-primary"> Become a Creator </NuxtLink>
				</div>
			</div>
		</section>

		<!-- Features -->

		<section class="py-16 sm:py-24">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl font-bold">Platform Features</h2>

					<p class="mt-4 text-lg text-gray-600">Everything you need to create, share, and monetize your content.</p>
				</div>

				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:shield" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Secure Content</h3>
						</div>

						<p class="text-gray-600">Your content is protected with industry-standard security measures.</p>
					</div>

					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:credit-card" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Easy Payments</h3>
						</div>

						<p class="text-gray-600">Secure payment processing and automatic subscription management.</p>
					</div>

					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:message-circle" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Direct Messaging</h3>
						</div>

						<p class="text-gray-600">Connect with your subscribers through private messages.</p>
					</div>

					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:bar-chart" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Analytics</h3>
						</div>

						<p class="text-gray-600">Track your growth with detailed performance metrics.</p>
					</div>

					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:calendar" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Scheduled Posts</h3>
						</div>

						<p class="text-gray-600">Plan and schedule your content in advance.</p>
					</div>

					<div class="card p-6">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
								<Icon name="lucide:gift" class="h-6 w-6" />
							</div>

							<h3 class="text-lg font-semibold ml-4">Tips & Rewards</h3>
						</div>

						<p class="text-gray-600">Receive tips from subscribers and offer special rewards.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- FAQ -->

		<section class="py-16 sm:py-24 bg-gray-50">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl font-bold">Frequently Asked Questions</h2>

					<p class="mt-4 text-lg text-gray-600">Find answers to common questions about Whispers.</p>
				</div>

				<div class="max-w-3xl mx-auto space-y-6">
					<div v-for="(faq, index) in faqs" :key="index" class="card p-6">
						<button class="w-full flex items-center justify-between text-left" @click="faq.isOpen = !faq.isOpen">
							<h3 class="text-lg font-medium">{{ faq.question }}</h3>
							<Icon :name="faq.isOpen ? 'lucide:minus' : 'lucide:plus'" class="h-5 w-5 text-gray-500" />
						</button>

						<div v-show="faq.isOpen" class="mt-4">
							<p class="text-gray-600">{{ faq.answer }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->

		<section class="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="text-3xl font-bold">Ready to Get Started?</h2>

					<p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
						Join thousands of creators and subscribers on Whispers today.
					</p>

					<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
						<NuxtLink to="/explore" class="btn bg-white text-primary-600 hover:bg-gray-100">
							Explore Creators
						</NuxtLink>
						<NuxtLink
							to="/creators/apply"
							class="btn bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-400 dark:text-gray-900 dark:hover:bg-primary-500"
						>
							Become a Creator
						</NuxtLink>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
	layout: 'default',
})

const faqs = ref([
	{
		question: 'What is Whispers?',
		answer:
			'Whispers is a platform where creators can share exclusive content with their subscribers. Creators can monetize their content while subscribers get access to unique and exclusive material.',
		isOpen: true,
	},
	{
		question: 'How do subscriptions work?',
		answer:
			'Subscribers can choose between monthly or yearly plans set by each creator. Once subscribed, you get immediate access to all exclusive content and can interact directly with the creator.',
		isOpen: false,
	},
	{
		question: 'How do creators get paid?',
		answer:
			'Creators receive monthly payments for their subscription revenue and tips. Payments are processed securely and automatically deposited to their connected bank account.',
		isOpen: false,
	},
	{
		question: 'What type of content is allowed?',
		answer:
			'Whispers welcomes a wide variety of content that complies with our community guidelines. This includes art, music, photography, educational content, and more.',
		isOpen: false,
	},
	{
		question: 'Is my content secure?',
		answer:
			'Yes, we implement industry-standard security measures to protect your content. Creators can control who has access to their content through subscription tiers.',
		isOpen: false,
	},
	{
		question: 'Can I cancel my subscription?',
		answer:
			"Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
		isOpen: false,
	},
])
</script>
