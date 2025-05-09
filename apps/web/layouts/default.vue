<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';

// Make toast available globally
provide('toast', useToast());
</script>