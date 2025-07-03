import { type NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"
import { getRouteConfig } from "./lib/route-config"

interface JWTPayload {
  userId: string
  iat: number
  exp: number
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const userProfile = request.cookies.get("userProfile")?.value

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
    hasUserProfile: !!userProfile,
  })

  const requiresAuth = routeConfig?.requiresAuth ?? true
  const requiresCreator = routeConfig?.requiresCreator ?? false

  // Handle public routes
  if (!requiresAuth) {
    // If user is authenticated and trying to access auth page, redirect to home
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
    // Store the intended destination for post-auth redirect
    if (pathname !== "/") {
      url.searchParams.set("returnTo", pathname)
    }
    return NextResponse.redirect(url)
  }

  // Validate token
  try {
    const decoded = jwtDecode<JWTPayload>(accessToken)

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.log(`⏰ Token expired, redirecting to /auth`)
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      return NextResponse.redirect(url)
    }

    console.log(`🔍 Token decoded:`, {
      userId: decoded.userId,
      exp: decoded.exp,
      isValid: decoded.exp * 1000 > Date.now(),
    })

    // Check creator requirements using userProfile cookie
    if (requiresCreator) {
      if (!userProfile) {
        console.log(`👨‍🎨 Creator route requires user profile, but no profile cookie found, redirecting to /apply`)
        const url = request.nextUrl.clone()
        url.pathname = "/apply"
        return NextResponse.redirect(url)
      }

      try {
        const user = JSON.parse(decodeURIComponent(userProfile))
        const isApprovedCreator = user?.data?.creatorProfile?.status === "approved"

        console.log(`🔍 Creator profile check:`, {
          hasUserData: !!user?.data,
          hasCreatorProfile: !!user?.data?.creatorProfile,
          creatorStatus: user?.data?.creatorProfile?.status,
          isApprovedCreator,
        })

        if (!isApprovedCreator) {
          console.log(
            `👨‍🎨 Not approved creator (status: ${user?.data?.creatorProfile?.status}), redirecting to /apply`,
          )
          const url = request.nextUrl.clone()
          url.pathname = "/apply"
          return NextResponse.redirect(url)
        }

        console.log(`✅ Approved creator accessing: ${pathname}`)
      } catch (error) {
        console.log(`❌ Failed to parse user profile cookie, redirecting to /apply`, error)
        const url = request.nextUrl.clone()
        url.pathname = "/apply"
        return NextResponse.redirect(url)
      }
    }
  } catch (error) {
    console.log(`🔥 Invalid token, redirecting to /auth`, error)
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  console.log(`✅ Middleware passed for ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)"],
}
