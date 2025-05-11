<template>
	<header class="bg-white shadow-sm">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->

				<div class="flex items-center flex-shrink-0">
					<NuxtLink to="/" class="flex items-center">
						<!-- <img
              class="h-8 w-auto sm:h-10"
              src="/logo.svg"
              alt="Whispers"
            /> -->
						<span class="ml-2 text-xl font-bold text-primary-600 hidden sm:block">Whispers</span>
					</NuxtLink>
				</div>

				<!-- Desktop navigation -->

				<nav class="hidden md:flex items-center space-x-4">
					<NuxtLink
						v-for="item in navItems"
						:key="item.name"
						:to="item.href"
						:class="[
							'px-3 py-2 rounded-md text-sm font-medium',
							$route.path === item.href
								? 'text-primary-700 bg-primary-50'
								: 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
						]"
					>
						{{ item.name }}
					</NuxtLink>
				</nav>

				<!-- Right section -->

				<div class="flex items-center space-x-3">
					<a
						href="https://studious-lamp-creator.vercel.app/auth/login"
						target="_blank"
						class="hidden sm:inline-flex btn-outline"
					>
						Sign in
					</a>
					<a href="/https://studious-lamp-creator.vercel.app/auth/register" target="_blank" class="btn-primary">
						Sign up
					</a>
				</div>
			</div>
		</div>

		<!-- Mobile navigation menu -->

		<div v-if="mobileMenuOpen" class="md:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<NuxtLink
					v-for="item in navItems"
					:key="item.name"
					:to="item.href"
					:class="[
						'block px-3 py-2 rounded-md text-base font-medium',
						$route.path === item.href
							? 'text-primary-700 bg-primary-50'
							: 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
					]"
					@click="mobileMenuOpen = false"
				>
					{{ item.name }}
				</NuxtLink>
			</div>
		</div>
	</header>
</template>

<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const navItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Explore', href: '/explore' },
	// { name: 'Creators', href: '/creators' },
];

function openSearch() {
	// Implementation for search functionality
	console.log('Search opened');
}
</script>
