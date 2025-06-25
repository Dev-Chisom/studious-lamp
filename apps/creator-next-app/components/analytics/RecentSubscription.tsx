import Link from "next/link" // Changed from @remix-run/react
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Subscription {
  id: string
  userName: string
  userAvatar: string
  plan: string
  amount: string | number
  date: Date | string
}

interface RecentSubscriptionsProps {
  subscriptions: Subscription[]
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

export default function RecentSubscriptions({ subscriptions, t = defaultT }: RecentSubscriptionsProps) {
  return (
    <div className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{t("recentSubscriptions")}</h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {subscriptions.map((subscription) => (
          <li
            key={subscription.id}
            className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={subscription.userAvatar || "/placeholder.svg?width=40&height=40&text=Avatar"}
                  alt={subscription.userName}
                />
                <AvatarFallback>
                  {subscription.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{subscription.userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subscription.plan} plan &middot; ${subscription.amount}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(subscription.date)}
              </div>
            </div>
          </li>
        ))}
        {subscriptions.length === 0 && (
          <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            {t("analytics.no_recent_subscriptions")}
          </li>
        )}
      </ul>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
        <Link
          href="/creator/subscribers" // Changed from `to` to `href`
          className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {t("analytics.view_all_subscribers")} <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  )
}
