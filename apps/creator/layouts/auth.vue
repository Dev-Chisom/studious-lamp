<template>
  <div class="min-h-screen flex flex-col">
    <div class="py-6 flex justify-center">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <!-- <img src="/logo.svg" alt="Whispers" class="h-10 w-auto" /> -->
        <span class="text-2xl font-bold text-primary-600">Whispers</span>
      </NuxtLink>
    </div>
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>
    <footer class="py-4 text-center text-sm text-gray-500 dark:text-gray-200">
      <p>© {{ new Date().getFullYear() }} Whispers. All rights reserved.</p>
    </footer>
  </div>
</template>