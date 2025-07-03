"use client"

import type React from "react"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  X,
  Home,
  MessageCircle,
  Wallet,
  CreditCard,
  ImageIcon,
  BarChart,
  Users,
  DollarSign,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth/auth-store"
import SidebarNavigationItem from "@/components/sidebar-navigation-item"
import Image from "next/image"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  divider?: boolean
}

interface CreatorSidebarProps {
  isMobileOpen: boolean
  onClose: () => void
}

export default function CreatorSidebar({ isMobileOpen, onClose }: CreatorSidebarProps) {
  const { t } = useTranslation("navigation")
  const { user } = useAuthStore()

  const navigationItems = useMemo(() => {
    const creatorStatus = user?.data?.creatorProfile?.status
    const isApprovedCreator = creatorStatus === "approved"

    // Base navigation items that everyone sees
    const baseItems: NavigationItem[] = [
      { name: t("nav.home"), href: "/", icon: Home },
      { name: t("nav.messages"), href: "/messages", icon: MessageCircle },
      { name: t("nav.wallet"), href: "/wallet", icon: Wallet },
      { name: t("nav.subscriptions"), href: "/subscriptions", icon: CreditCard },
      { name: t("nav.content"), href: "/content", icon: ImageIcon },
    ]

    // Creator-specific navigation items
    const creatorItems: NavigationItem[] = isApprovedCreator
      ? [
          { name: t("nav.analytics"), href: "/creator/analytics", icon: BarChart },
          { name: t("nav.subscribers"), href: "/creator/subscribers", icon: Users },
          { name: t("nav.earnings"), href: "/creator/earnings", icon: DollarSign },
        ]
      : []

    // "Become Creator" button (only shown if not approved)
    const becomeCreatorItem: NavigationItem[] = !isApprovedCreator
      ? [
          {
            name: t("nav.becomeCreator"),
            href: "/apply",
            icon: UserPlus,
            divider: true,
          },
        ]
      : []

    return [...baseItems, ...creatorItems, ...becomeCreatorItem]
  }, [user?.data?.creatorProfile?.status, t])

  return (
    <div>
      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 lg:hidden z-[400]" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col w-full">
              <div className="px-4 py-6 bg-primary-700 dark:bg-primary-900 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src="/logo-white.svg" alt="Logo" width={38} height={38} className="h-8 w-auto mb-2" />
                    <span className="text-xl font-bold text-white dark:text-gray-100">{t("nav.creatorStudio")}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-gray-200 dark:text-gray-100 dark:hover:text-gray-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">{t("common.close")}</span>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                  <SidebarNavigationItem key={item.name} item={item} onClick={onClose} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="sticky bottom-0 top-0 hidden lg:flex lg:flex-shrink-0 bg-white dark:bg-gray-900 dark:bg-gray-800 h-screen">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="px-4 py-6 bg-primary-700 dark:bg-primary-900 flex items-center">
              <div className="flex items-center space-x-2">
                <Image src="/logo-white.svg" alt="Logo" width={38} height={38} />
                <span className="text-xl font-bold text-white dark:text-gray-100">{t("nav.creatorStudio")}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <SidebarNavigationItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
