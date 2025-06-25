import Link from "next/link"
import { Eye, Heart, MessageCircle } from "lucide-react"

interface ContentPost {
  id: string
  title: string
  thumbnail: string
  likes: number
  comments: number
  views: number
  date: Date | string
}

interface ContentPerformanceProps {
  posts: ContentPost[]
  t?: (key: string) => string
}

const defaultT = (key: string) => key.split(".").pop()?.replace(/_/g, " ") || key

const formatDate = (dateInput: Date | string): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ContentPerformance({ posts, t = defaultT }: ContentPerformanceProps) {
  return (
    <div className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{t("contentPerformance")}</h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <li
            key={post.id}
            className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-16 w-16">
                <img
                  src={post.thumbnail || "/placeholder.svg?width=64&height=64&text=No+Image"}
                  alt={post.title}
                  className="h-16 w-16 object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg?width=64&height=64&text=Error")}
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
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(post.date)}</div>
            </div>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">{t("analytics.no_content_yet")}</li>
        )}
      </ul>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
        <Link
          href="/content" // Changed from `to` to `href`
          className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {t("analytics.view_all_content")} <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  )
}
