"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreatorSidebar from "@/components/CreatorSidebar"
import NotificationBell from "@/components/NotificationBell"
import UserDropdown from "@/components/UserDropdown"
import LanguageSwitcher from "@/components/LanguageSwitcher"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar (sticky) */}
      <div className="fixed left-0 top-0 bg-white dark:bg-gray-900 shadow-sm z-50 w-full" style={{ height: "64px" }}>
        <div className="flex items-center justify-between lg:justify-end px-4 py-3 sm:px-6 lg:px-8 container max-w-[1200px] mx-auto">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden -ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 dark:text-gray-200 hover:text-gray-900"
            onClick={() => setIsMobileOpen(true)}
          >
            <span className="sr-only">{t("common.openSidebar")}</span>
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center justify-end">
            <div className="flex items-center lg:ml-auto space-x-4">
              <div className="relative">
                <NotificationBell />
              </div>
              <UserDropdown />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileOpen(false)} />

          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
            <CreatorSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area with Sidebar and Content */}
      <div className="flex justify-center w-full">
        <div className="flex max-w-[1400px] w-full mx-auto">
          {/* Desktop Sidebar (fixed) */}
          <div
            className="hidden lg:block lg:w-64 bg-gray-200 dark:bg-gray-700 fixed"
            style={{ top: "64px", height: "calc(100vh - 64px)" }}
          >
            <CreatorSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
          </div>

          {/* Spacer for fixed sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0" />

          {/* Main Content */}
          <div className="flex-1 flex flex-col" style={{ marginBlockStart: "64px", minHeight: "calc(100vh - 64px)" }}>
            <main className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 lg:p-6">
              <div className="max-w-[1200px] mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
