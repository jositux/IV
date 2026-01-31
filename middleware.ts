import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader
      .split("; ")
      .filter(Boolean)
      .map((c) => {
        const [key, ...values] = c.split("=")
        return [key, values.join("=")]
      }),
  )

  const token = cookies.auth_token

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/inputs", "/pricing", "/generation", "/create-video"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Si intenta acceder a login/signup con token, redirigir a dashboard
  if (request.nextUrl.pathname.startsWith("/login") ) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/video-inputs/:path*",
    "/pricing",
    "/generation/:path*",
    "/create-video",
    "/login",
  ],
}
