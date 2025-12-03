import { NextRequest, NextResponse } from "next/server"

// Routes that require admin authentication
const adminRoutes = [
  "/admin",
]

// Routes that require user/customer authentication
const userProtectedRoutes = [
  "/account",
  "/account/orders",
  "/account/addresses",
  "/account/notifications",
  "/account/settings",
  "/account/wishlist",
  "/account/wallet",
  "/checkout",
  "/orders",
  "/profile",
  "/wishlist",
  "/compare",
]

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/auth/callback"]

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/products",
  "/categories",
  "/brands",
  "/terms",
  "/privacy-policy",
  "/shipping-info",
  "/return-policy",
  "/faq",
  "/faqs",
  "/contact",
  "/contact-us",
  "/about",
  "/track-order",
  "/warranty",
  "/returns-refunds",
]

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route))
}

function isUserProtectedRoute(pathname: string): boolean {
  return userProtectedRoutes.some((route) => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route))
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }

  // Check cookies
  const token = request.cookies.get("access_token")?.value || request.cookies.get("auth_token")?.value

  return token || null
}

/**
 * Decode JWT token locally (without verification)
 * Used as fallback if backend endpoint is unavailable
 */
function decodeTokenLocally(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Validate token using backend endpoint (POST /auth/decode/{token})
 * Falls back to local decoding if backend is unavailable
 */
async function validateTokenWithBackend(token: string): Promise<Record<string, unknown> | null> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    const response = await fetch(`${apiBaseUrl}/auth/decode/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      return await response.json()
    }

    // Fallback to local decoding if backend validation fails
    return decodeTokenLocally(token)
  } catch (error) {
    // If backend is unavailable, fall back to local decoding
    console.warn("Backend token validation failed, using local decoding:", error)
    return decodeTokenLocally(token)
  }
}

/**
 * Check if token is expired
 */
async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const payload = await validateTokenWithBackend(token)
    if (!payload || !payload.exp) return true

    const expirationTime = (payload.exp as number) * 1000
    return Date.now() >= expirationTime
  } catch (error) {
    return true
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = getTokenFromRequest(request)

  // Skip middleware for static assets and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/)) {
    return NextResponse.next()
  }

  const isAdmin = isAdminRoute(pathname)
  const isUserProtected = isUserProtectedRoute(pathname)
  const isAuth = isAuthRoute(pathname)
  const isPublic = isPublicRoute(pathname)

  // If token exists, validate it (check expiry via backend)
  if (token && await isTokenExpired(token)) {
    // Token is expired, clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("access_token")
    response.cookies.delete("auth_token")
    response.cookies.delete("refresh_token")
    return response
  }

  // If route is protected (either admin or user) and user is not authenticated
  if ((isAdmin || isUserProtected) && !token) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and tries to access auth routes, redirect to home
  if (isAuth && token && !pathname.startsWith("/auth/callback")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow public routes
  if (isPublic) {
    return NextResponse.next()
  }

  // Allow other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
