"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface ContentPost {
  id: string
  title: string
  thumbnail: string
  likes: number
  comments: number
  views: number
  date: Date
}

interface ContentPerformanceProps {
  posts: ContentPost[]
}

export function ContentPerformance({ posts }: ContentPerformanceProps) {
  const { t } = useTranslation()

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-gray-50 dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {t("contentPerformance")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <li key={post.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</p>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views} {t("views")}
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes} {t("likes")}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments} {t("comments")}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">{t("analytics.no_content_yet")}</li>
          )}
        </ul>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
          <Link href="/content" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            {t("analytics.view_all_content")} <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
