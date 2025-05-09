<template>
  <div>
    <!-- Hero section -->
    <section class="relative bg-gradient-to-b from-primary-700 to-primary-900 text-white">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/70"></div>
        <img 
          src="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          alt="Hero background" 
          class="w-full h-full object-cover"
        />
      </div>
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Connect with exclusive content creators
          </h1>
          <p class="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl">
            Subscribe to your favorite creators, access exclusive content, and support their work directly.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/explore" class="btn-secondary">
              Explore Creators
            </NuxtLink>
            <a href="http://localhost:3001/auth/register" target="_blank" class="btn-outline border-white text-black hover:bg-white/10">
              Become a Creator
            </a>
            <!-- <NuxtLink v-else-if="!authStore.isCreator" to="/creator/onboarding" class="btn-outline border-white text-white hover:bg-white/10">
              Become a Creator
            </NuxtLink> -->
          </div>
        </div>
      </div>
    </section>

    <!-- Featured creators section -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Featured Creators</h2>
          <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover popular creators from different categories and explore their exclusive content.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="creator in featuredCreators" :key="creator.id" class="card">
            <div class="h-32 bg-gray-200 relative">
              <img 
                v-if="creator.coverImage" 
                :src="creator.coverImage" 
                alt="Cover" 
                class="w-full h-full object-cover"
              />
              <div class="absolute -bottom-8 left-4">
                <div class="avatar h-16 w-16 ring-4 ring-white">
                  <img 
                    :src="creator.profileImage" 
                    :alt="creator.displayName" 
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-10 px-4 pb-5">
              <div class="flex items-center">
                <h3 class="text-lg font-semibold">{{ creator.displayName }}</h3>
                <span v-if="creator.isVerified" class="ml-1 text-primary-500">
                  <Icon name="lucide:badge-check" class="h-4 w-4" />
                </span>
              </div>
              <p class="text-sm text-gray-500 mb-2">@{{ creator.username }}</p>
              <p class="text-gray-700 mb-4 line-clamp-2">{{ creator.bio }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="text-sm">
                  <span class="font-semibold">{{ creator.subscriberCount.toLocaleString() }}</span>
                  <span class="text-gray-500 ml-1">subscribers</span>
                </div>
                <div class="flex space-x-1">
                  <span v-for="category in creator.categories" :key="category" class="badge badge-primary">
                    {{ category }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <p class="text-sm text-gray-500">From</p>
                  <p class="font-semibold">${{ creator.monthlyPrice }}/month</p>
                </div>
                <NuxtLink :to="`/creators/${creator.username}`" class="btn-primary">
                  View Profile
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-10">
          <NuxtLink to="/explore" class="btn-outline">
            View All Creators
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How it works section -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">How Whispers Works</h2>
          <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Join our platform in three simple steps and start enjoying exclusive content.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:user-plus" class="h-8 w-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Create an Account</h3>
            <p class="text-gray-600">
              Sign up for free and create your personal account to get started.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:search" class="h-8 w-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Discover Creators</h3>
            <p class="text-gray-600">
              Browse and follow your favorite creators from various categories.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:unlock" class="h-8 w-8" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Subscribe & Enjoy</h3>
            <p class="text-gray-600">
              Subscribe to unlock exclusive content and support your favorite creators.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA section -->
    <section class="py-12 sm:py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:flex lg:items-center lg:justify-between">
          <div class="lg:max-w-xl">
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Ready to start creating?</h2>
            <p class="mt-3 text-lg text-white/80 max-w-2xl">
              Join thousands of creators who are earning directly from their fans. Start sharing your content and building your community today.
            </p>
          </div>
          <div class="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/creators/apply" class="btn bg-white text-secondary-600 hover:bg-gray-100 focus:ring-white">
                Become a Creator
              </NuxtLink>
              <NuxtLink to="/how-it-works" class="btn-outline border-white text-black hover:bg-white/10">
                Learn More
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials section -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">What Creators Are Saying</h2>
          <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from creators who have transformed their passion into income with Whispers.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="card p-6">
            <div class="flex items-center mb-4">
              <div class="avatar h-12 w-12 mr-4">
                <img :src="testimonial.image" :alt="testimonial.name" class="h-full w-full object-cover" />
              </div>
              <div>
                <h3 class="font-semibold">{{ testimonial.name }}</h3>
                <p class="text-sm text-gray-500">{{ testimonial.occupation }}</p>
              </div>
            </div>
            <div class="text-gray-700">
              <p class="mb-2">"{{ testimonial.quote }}"</p>
              <div class="flex text-yellow-400 mt-2">
                <Icon v-for="i in 5" :key="i" name="lucide:star" class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const testimonials = [
  {
    name: 'Sarah Johnson',
    occupation: 'Fitness Instructor',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'Whispers has completely changed my business. I can now share workout routines and nutrition plans directly with my subscribers and earn from my expertise.'
  },
  {
    name: 'David Chen',
    occupation: 'Digital Artist',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'As an artist, I was struggling to monetize my work. With Whispers, I can share my process, tutorials, and exclusive artwork with fans who truly value my creativity.'
  },
  {
    name: 'Michelle Rodriguez',
    occupation: 'Travel Photographer',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'I love that I can share my travel photography and behind-the-scenes content with my community. The subscription model gives me stable income while I pursue my passion.'
  }
];

// Page setup
const featuredCreators = [
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
    monthlyPrice: 9.99
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
    monthlyPrice: 14.99
  },
  {
    id: 3,
    displayName: 'Michelle Rodriguez',
    username: 'micheller',
    bio: 'Travel photographer capturing the world\'s most beautiful moments and sharing exclusive travel tips.',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isVerified: true,
    subscriberCount: 15600,
    categories: ['Travel', 'Photography'],
    monthlyPrice: 19.99
  }
];
</script>