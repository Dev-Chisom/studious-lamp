"use client"

import type React from "react"
import { AuthGuard } from "@/lib/auth/auth-guard"

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Additional creator-specific protection
    <AuthGuard requiresAuth={true} requiresCreator={true}>
      <div className="creator-specific-layout">
        <div className="creator-header">
          <h1>Creator Dashboard</h1>
        </div>
        {children}
      </div>
    </AuthGuard>
  )
}
