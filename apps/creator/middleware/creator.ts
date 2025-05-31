import { useAuthStore } from "../store/auth";
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (!to.meta.requiresCreator) return;
  
  const authStore = useAuthStore();
  const isApprovedCreator = authStore.profile?.data?.creatorProfile?.status === 'approved';
  
  if (!isApprovedCreator) {
    return navigateTo('/apply');
  }
});