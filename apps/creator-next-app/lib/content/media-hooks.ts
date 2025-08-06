"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../auth/auth-store"
import { creatorApi } from "../creator/creator-api"
import { useVideoUpload } from "../api-video/hooks"

// Media query keys
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...mediaKeys.lists(), { filters }] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (id: string) => [...mediaKeys.details(), id] as const,
}

// Transform API response to match MediaItem interface
const transformMediaFile = (apiFile: any) => ({
  id: apiFile._id,
  url: apiFile.url,
  thumbnailUrl: apiFile.type === 'video' ? apiFile.coverUrl : apiFile.thumbnailUrl || apiFile.url,
  name: apiFile.url.split('/').pop() || 'media',
  type: apiFile.type,
  size: apiFile.size,
  duration: apiFile.duration,
})

// Get media files with proper caching
export function useMediaFiles(params?: {
  page?: number
  limit?: number
  type?: 'image' | 'video'
  status?: 'active' | 'inactive'
  uploadStatus?: 'pending' | 'uploaded' | 'failed'
  search?: string
}) {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: mediaKeys.list(params || {}),
    queryFn: async () => {
      const response = await creatorApi.getMediaFiles(params)
      console.log('Media files API response:', response)
      
      // Handle both wrapped and unwrapped responses
      const responseData = response.data || response
      const mediaFiles = (responseData.mediaFiles || []).map(transformMediaFile)
      
      return {
        mediaFiles,
        pagination: responseData.pagination || { page: 1, limit: 12, total: 0, pages: 1 }
      }
    },
    enabled: isAuthenticated && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 (auth errors)
      if (error?.status === 401 || error?.status === 403) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    throwOnError: false,
  })
}

// Upload media files mutation
export function useUploadMediaFiles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { files: Array<{ uuid: string; fileName: string; fileType: string; size: number; coverName?: string }> }) => {
      const response = await creatorApi.uploadMediaFile(payload)
      return response.data || response
    },
    onSuccess: () => {
      // Invalidate all media queries to refetch
      queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    },
    onError: (error: any) => {
      console.error("Upload media error:", error)
    },
  })
}

// Delete media file mutation
export function useDeleteMediaFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await creatorApi.deleteMedia(id)
      if (response.success) {
        return { success: true }
      }
      throw new Error(response.message || "Failed to delete media file")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    },
    onError: (error: any) => {
      console.error("Delete media error:", error)
    },
  })
}

// Upload video with api.video integration
export function useUploadVideoWithApiVideo() {
  const queryClient = useQueryClient()
  const { uploadVideo, isCreating, isUploading, error } = useVideoUpload()

  const uploadVideoWithApiVideo = useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      tags,
      metadata,
      onProgress,
    }: {
      file: File
      title?: string
      description?: string
      tags?: string[]
      metadata?: Record<string, any>
      onProgress?: (progress: number) => void
    }) => {
      const videoId = await uploadVideo(
        file,
        {
          title: title || file.name,
          description,
          tags,
          metadata,
          public: true,
        },
        onProgress
      )

      // Return the video ID and api.video URLs
      return {
        videoId,
        url: `https://player.api.video/player/${videoId}`,
        thumbnailUrl: `https://image.api.video/thumbnail/${videoId}?width=320&height=180`,
        posterUrl: `https://image.api.video/poster/${videoId}`,
        type: 'video',
        name: file.name,
        size: file.size,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    },
    onError: (error: any) => {
      console.error("Upload video with api.video error:", error)
    },
  })

  return {
    uploadVideoWithApiVideo: uploadVideoWithApiVideo.mutateAsync,
    isUploading: uploadVideoWithApiVideo.isPending || isCreating || isUploading,
    error: uploadVideoWithApiVideo.error || error,
  }
} 