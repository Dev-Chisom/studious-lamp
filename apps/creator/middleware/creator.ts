import { useAuthStore } from "../store/auth";
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.meta.requiresCreator) return;
  
  const authStore = useAuthStore();
  
  // Ensure user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
  
  // Check creator status
  const isApprovedCreator = authStore.profile?.data?.creatorProfile?.status === 'approved';
  
  if (!isApprovedCreator) {
    return navigateTo('/apply');
  }
});