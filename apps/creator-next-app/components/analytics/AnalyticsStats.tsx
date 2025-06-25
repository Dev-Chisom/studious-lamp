import { TrendingUp, TrendingDown } from "lucide-react"
import * as Icons from "lucide-react"

interface StatCard {
  name: string
  value: string
  icon: string // e.g., "Users", "DollarSign" (PascalCase for Lucide)
  color: string // e.g., "blue", "green"
  trend: number
}

interface StatsCardsProps {
  stats: StatCard[]
  t?: (key: string) => string // Translation function
}

const defaultT = (key: string) => key.split(".").pop()?.replace(/_/g, " ") || key

export default function StatsCards({ stats, t = defaultT }: StatsCardsProps) {
  const getIcon = (iconName: string) => {
    const cleanName = iconName.replace("lucide:", "")
    const pascalCase = cleanName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
    // @ts-ignore - Dynamic icon access
    const IconComponent = Icons[pascalCase] || Icons.HelpCircle
    return IconComponent
  }

  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-100 dark:bg-${color}-900`, // Added dark variants
    text: `text-${color}-600 dark:text-${color}-400`, // Added dark variants
  })

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const IconComponent = getIcon(stat.icon)
        const TrendIcon = stat.trend > 0 ? TrendingUp : TrendingDown
        const colorClasses = getColorClasses(stat.color)

        return (
          <div key={index} className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`${colorClasses.bg} rounded-md p-3`}>
                  <IconComponent className={`h-6 w-6 ${colorClasses.text}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{t(stat.name)}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendIcon
                    className={`flex-shrink-0 mr-1.5 h-5 w-5 ${
                      stat.trend > 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    }`}
                  />
                  <div
                    className={stat.trend > 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}
                  >
                    {Math.abs(stat.trend)}%
                  </div>
                  <div className="ml-1 text-gray-500 dark:text-gray-400">{t("analytics.from_last_month")}</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
