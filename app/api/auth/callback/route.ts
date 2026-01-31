import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    const auth0Domain = process.env.AUTH0_DOMAIN!
    const clientId = process.env.AUTH0_CLIENT_ID!
    const clientSecret = process.env.AUTH0_CLIENT_SECRET!
    const redirectUri = process.env.AUTH0_REDIRECT_URI || `${request.nextUrl.origin}/callback`

    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error("Token exchange failed:", error)
      return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 })
    }

    const tokens = await tokenResponse.json()

    const response = NextResponse.json({
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      expires_in: tokens.expires_in,
    })

    const maxAge = tokens.expires_in || 86400
    const cookieOptions = `Path=/; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    response.headers.append("Set-Cookie", `auth_token=${tokens.access_token}; HttpOnly; ${cookieOptions}`)

    return response
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
