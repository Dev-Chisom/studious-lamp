"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../auth/auth-store"
import { useTranslation } from "react-i18next"
import {
  createContentApi,
  type Content,
  type ContentListParams,
  type CreateContentRequest,
  type UpdateContentRequest,
} from "./content-api"

// Content query keys
export const contentKeys = {
  all: ["content"] as const,
  lists: () => [...contentKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...contentKeys.lists(), { filters }] as const,
  details: () => [...contentKeys.all, "detail"] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
}

// Create API instance
const contentApi = createContentApi()

// Transform API response to match existing interface
const transformContent = (apiContent: Content): Content & { id: string } => ({
  ...apiContent,
  id: apiContent._id,
  status: apiContent.status as "published" | "draft" | "scheduled",
  visibility: apiContent.visibility,
})

// Get all content
export function useContent(params?: ContentListParams) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: contentKeys.list(params || {}),
    queryFn: async (): Promise<(Content & { id: string })[]> => {
      const response = await contentApi.getAllPosts(params)
      if (response.success) {
        return response.data.posts.map(transformContent)
      }
      throw new Error(response.message || "Failed to fetch content")
    },
    enabled: isAuthenticated && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
  })
}

// Get content by ID
export function useContentById(id: string) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: async (): Promise<(Content & { id: string }) | null> => {
      if (!id) return null

      const response = await contentApi.getPostById(id)
      if (response.success) {
        return transformContent(response.data.post)
      }
      throw new Error(response.message || "Failed to fetch content")
    },
    enabled: isAuthenticated && typeof window !== "undefined" && !!id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  })
}

// Create content mutation
export function useCreateContent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      body: string
      mediaFiles?: string[]
      visibility: "public" | "subscribers" | "pay-to-view"
      price?: number
      scheduledDate?: string
      tags?: string[]
      categories?: string[]
      isDraft?: boolean
    }) => {
      // Transform visibility back to API format
      const apiVisibility =
        data.visibility === "pay-to-view" ? "premium" : data.visibility === "subscribers" ? "private" : "public"

      const createData: CreateContentRequest = {
        title: data.title,
        description: data.description,
        body: data.body,
        mediaFiles: data.mediaFiles,
        visibility: apiVisibility as "public" | "private" | "premium",
        price: data.price,
        scheduledDate: data.scheduledDate,
        tags: data.tags,
        categories: data.categories,
        isDraft: data.isDraft,
      }

      const response = await contentApi.createPost(createData)
      if (response.success) {
        return transformContent(response.data.post)
      }
      throw new Error(response.message || "Failed to create content")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
    onError: (error: any) => {
      console.error("Create content error:", error)
    },
  })
}

// Update content mutation
export function useUpdateContent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        title?: string
        description?: string
        body?: string
        mediaFiles?: string[]
        visibility?: "public" | "subscribers" | "pay-to-view"
        price?: number
        scheduledDate?: string
        tags?: string[]
        categories?: string[]
      }
    }) => {
      // Transform visibility back to API format
      const apiVisibility =
        data.visibility === "pay-to-view"
          ? "premium"
          : data.visibility === "subscribers"
            ? "private"
            : data.visibility === "public"
              ? "public"
              : undefined

      const updateData: UpdateContentRequest = {
        title: data.title,
        description: data.description,
        body: data.body,
        mediaFiles: data.mediaFiles,
        visibility: apiVisibility,
        price: data.price,
        scheduledDate: data.scheduledDate,
        tags: data.tags,
        categories: data.categories,
      }

      const response = await contentApi.updatePost(id, updateData)
      if (response.success) {
        return transformContent(response.data.post)
      }
      throw new Error(response.message || "Failed to update content")
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      console.error("Update content error:", error)
    },
  })
}

// Delete content mutation
export function useDeleteContent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await contentApi.deletePost(id)
      if (response.success) {
        return { success: true }
      }
      throw new Error(response.message || "Failed to delete content")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
    onError: (error: any) => {
      console.error("Delete content error:", error)
    },
  })
}

// Get content statistics
export function useContentStats() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ["content", "stats"],
    queryFn: async () => {
      const response = await contentApi.getContentStats()
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || "Failed to fetch content stats")
    },
    enabled: isAuthenticated && typeof window !== "undefined",
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Publish content mutation
export function usePublishContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await contentApi.publishPost(id)
      if (response.success) {
        return transformContent(response.data.post)
      }
      throw new Error(response.message || "Failed to publish content")
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(id) })
    },
  })
}

// Schedule content mutation
export function useScheduleContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, scheduledDate }: { id: string; scheduledDate: string }) => {
      const response = await contentApi.schedulePost(id, scheduledDate)
      if (response.success) {
        return transformContent(response.data.post)
      }
      throw new Error(response.message || "Failed to schedule content")
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) })
    },
  })
}
