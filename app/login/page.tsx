"use client"

import { useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Link from "next/link"

export default function LoginAuthPage() {
  const { isLoading, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!
      const redirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || `${window.location.origin}/callback`
      const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!

      const authUrl = new URL(`https://${auth0Domain}/authorize`)
      authUrl.searchParams.append("response_type", "code")
      authUrl.searchParams.append("client_id", clientId)
      authUrl.searchParams.append("redirect_uri", redirectUri)
      authUrl.searchParams.append("scope", "openid profile email")
      authUrl.searchParams.append("audience", audience)
      authUrl.searchParams.append("state", Math.random().toString(36).substring(7))

      // --- CAMBIO CLAVE AQUÍ ---
      // replace() sustituye la URL actual en el historial. 
      // Al volver atrás, esta página ya no existirá en la pila.
      window.location.replace(authUrl.toString())
    }

    if (isAuthenticated) {
      // También aquí, para que no puedan volver al "Redirecting..." desde el Dashboard
      window.location.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded" />
          <span className="font-semibold text-lg">IntelligentVideos</span>
        </Link>

        <div className="mt-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-lg text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    </div>
  )
}