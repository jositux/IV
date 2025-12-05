import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge"

export default withMiddlewareAuthRequired()

export const config = {
  matcher: ["/dashboard/:path*", "/subscription/manage/:path*", "/settings/:path*"],
}
