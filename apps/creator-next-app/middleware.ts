import { type NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"
import { getRouteConfig } from "./lib/route-config"

interface JWTPayload {
  userId: string
  email: string
  isCreator?: boolean
  creatorProfile?: {
    status: string
  }
  exp: number
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value

  // Skip API routes and static files
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Skip locale files and static assets
  if (pathname.startsWith("/locales/") || pathname.startsWith("/favicon")) {
    return NextResponse.next()
  }

  // Get route configuration
  const routeConfig = getRouteConfig(pathname)

  console.log(`🛡️ Middleware checking: ${pathname}`, {
    requiresAuth: routeConfig?.requiresAuth,
    requiresCreator: routeConfig?.requiresCreator,
    hasToken: !!accessToken,
  })

  const requiresAuth = routeConfig?.requiresAuth ?? true
  const requiresCreator = routeConfig?.requiresCreator ?? false

  if (!requiresAuth) {
    if (accessToken && pathname === "/auth") {
      console.log(`✅ Authenticated user accessing auth page, redirecting to /`)
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Route requires auth but no token - redirect to auth
  if (!accessToken) {
    console.log(`🚫 No token for protected route, redirecting to /auth`)
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  // Check creator requirements
  if (requiresCreator) {
    try {
      const decoded = jwtDecode<JWTPayload>(accessToken)

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log(`⏰ Token expired, redirecting to /auth`)
        const url = request.nextUrl.clone()
        url.pathname = "/auth"
        return NextResponse.redirect(url)
      }

      // Check creator status
      const isApprovedCreator = decoded.creatorProfile?.status === "approved"

      if (!isApprovedCreator) {
        console.log(`👨‍🎨 Not approved creator, redirecting to /apply`)
        const url = request.nextUrl.clone()
        url.pathname = "/apply"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.log(`🔥 Invalid token, redirecting to /auth`)
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
}
