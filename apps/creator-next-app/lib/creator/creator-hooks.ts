import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { creatorApi } from "./creator-api"
import { toast } from "sonner"
import type { Creator, CreatorPreferences, CreatorApplication } from "./../api-types"

// Query keys
export const creatorKeys = {
  all: ["creators"] as const,
  lists: () => [...creatorKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...creatorKeys.lists(), { filters }] as const,
  details: () => [...creatorKeys.all, "detail"] as const,
  detail: (id: string) => [...creatorKeys.details(), id] as const,
  preferences: (id?: string) => [...creatorKeys.all, "preferences", id] as const,
  media: (id: string) => [...creatorKeys.all, "media", id] as const,
  stats: (id: string) => [...creatorKeys.all, "stats", id] as const,
}

// Creator queries
export const useCreators = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: creatorKeys.list(params || {}),
    queryFn: () => creatorApi.getCreators(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreator = (id: string) => {
  return useQuery({
    queryKey: creatorKeys.detail(id),
    queryFn: () => creatorApi.getCreator(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreatorPreferences = (creatorId?: string) => {
  return useQuery({
    queryKey: creatorKeys.preferences(creatorId),
    queryFn: () => creatorApi.getCreatorPreferences(creatorId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreatorMedia = (creatorId: string, params?: { page?: number; limit?: number; type?: string }) => {
  return useQuery({
    queryKey: creatorKeys.media(creatorId),
    queryFn: () => creatorApi.getCreatorMedia(creatorId, params),
    enabled: !!creatorId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreatorStats = (creatorId: string) => {
  return useQuery({
    queryKey: creatorKeys.stats(creatorId),
    queryFn: () => creatorApi.getCreatorStats(creatorId),
    enabled: !!creatorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Creator mutations
export const useUpdateCreator = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Creator> }) => creatorApi.updateCreator(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() })
      toast.success("Creator updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update creator")
      console.error("Update creator error:", error)
    },
  })
}

export const useUpdateCreatorPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreatorPreferences>) => creatorApi.updateCreatorPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.preferences() })
      toast.success("Preferences updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update preferences")
      console.error("Update preferences error:", error)
    },
  })
}

export const useSubmitApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatorApplication) => creatorApi.submitApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.all })
      toast.success("Application submitted successfully!")
    },
    onError: (error) => {
      toast.error("Failed to submit application")
      console.error("Submit application error:", error)
    },
  })
}

export const useUploadMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: creatorApi.uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...creatorKeys.all, "media"] })
      toast.success("Media uploaded successfully")
    },
    onError: (error) => {
      toast.error("Failed to upload media")
      console.error("Upload media error:", error)
    },
  })
}

export const useDeleteCreator = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => creatorApi.deleteCreator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() })
      toast.success("Creator deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete creator")
      console.error("Delete creator error:", error)
    },
  })
}

export const useCreateCreator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Creator>) => creatorApi.createCreator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() });
      toast.success("Creator created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create creator");
      console.error("Create creator error:", error);
    },
  });
};
