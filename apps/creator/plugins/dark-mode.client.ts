import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const html = document.documentElement;

    if (saved === 'dark' || (!saved && prefersDark)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}); 