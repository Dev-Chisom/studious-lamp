"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { PostForm } from "@/components/content/post-form"
import { useCreateContent } from "@/lib/content/content-hooks"
import { useAuthStore } from "@/lib/auth-store"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewContentPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const createMutation = useCreateContent()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to create content
          </h2>
          <Button onClick={() => (window.location.href = "/auth")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  const initialValues = {
    title: "",
    content: "",
    visibility: "public" as const,
    price: 4.99,
    mediaUrls: [],
  }

  const minScheduleDate = new Date()
  minScheduleDate.setMinutes(minScheduleDate.getMinutes() + 10)

  const handleSubmit = async (formData: any) => {
    createMutation.mutate(
      {
        title: formData.title,
        body: formData.body || formData.content,
        mediaFiles: formData.mediaFiles || [],
        visibility: formData.visibility,
        price: formData.visibility === "pay-to-view" ? formData.price : undefined,
        scheduledDate: formData.isScheduled ? formData.scheduledDate : undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("notifications.contentCreated"))
          router.push("/content")
        },
        onError: () => {
          toast.error(t("notifications.contentCreateFailed"))
        },
      },
    )
  }

  const handleDraft = async (formData: any) => {
    createMutation.mutate(
      {
        title: formData.title || t("content.untitledDraft"),
        body: formData.body || formData.content || "",
        mediaFiles: formData.mediaFiles || [],
        visibility: formData.visibility || "public",
        price: formData.visibility === "pay-to-view" ? formData.price : undefined,
        isDraft: true,
      },
      {
        onSuccess: () => {
          toast.success(t("notifications.draftSaved"))
          router.push("/content")
        },
        onError: () => {
          toast.error(t("notifications.draftSaveFailed"))
        },
      },
    )
  }

  const handleCancel = () => {
    router.push("/content")
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/content" className="mr-2 text-gray-500 dark:text-gray-200 hover:text-gray-700">
            <Icons.arrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("content.new.title")}</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">{t("content.new.description")}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
        <PostForm
          initialValues={initialValues}
          loading={createMutation.isPending}
          minScheduleDate={minScheduleDate.toISOString().slice(0, 16)}
          onSubmit={handleSubmit}
          onDraft={handleDraft}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
