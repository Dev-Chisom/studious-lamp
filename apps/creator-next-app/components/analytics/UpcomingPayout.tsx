"use client" 
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Payout {
  amount: number
  date: Date | string
  subscriptionRevenue: number
  tips: number
  ppv: number
  platformFee: number
}

interface UpcomingPayoutProps {
  payout: Payout
  onRequestEarlyPayout: () => void
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

export default function UpcomingPayout({ payout, onRequestEarlyPayout, t = defaultT }: UpcomingPayoutProps) {
  return (
    <div className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{t("upcomingPayout")}</h3>
        <Link
          href="/creator/earnings" // Changed from `to` to `href`
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          {t("analytics.view_earnings_details")}
        </Link>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">${payout.amount.toFixed(2)}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("analytics.next_payout_on")} {formatDate(payout.date)}
            </p>
          </div>
          <Button onClick={onRequestEarlyPayout} className="mt-4 md:mt-0">
            {t("analytics.request_early_payout")}
          </Button>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("analytics.payout_breakdown")}</h4>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("analytics.subscription_revenue")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                ${payout.subscriptionRevenue.toFixed(2)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("analytics.tips")}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">${payout.tips.toFixed(2)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("analytics.pay_per_view")}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">${payout.ppv.toFixed(2)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("analytics.platform_fee")}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">-${payout.platformFee.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
