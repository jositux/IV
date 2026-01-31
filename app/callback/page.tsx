"use client"

import { useEffect, useState, Suspense } from "react" // Importar Suspense
import { useRouter, useSearchParams } from "next/navigation"

// 1. Creamos un componente interno que usa los hooks
function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const errorParam = searchParams.get("error")
      const errorDescription = searchParams.get("error_description")

      if (errorParam) {
        setError(errorDescription || "An error occurred during authentication")
        return
      }

      if (!code) {
        setError("No authorization code received")
        return
      }

      try {
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })

        if (!response.ok) throw new Error("Failed to exchange code for tokens")
        
        router.push("/dashboard")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed")
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Tu UI de error actual */}
        <button onClick={() => router.push("/login")}>Return to login</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
      </div>
    </div>
  )
}

// 2. Exportamos la página envuelta en Suspense
export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading authentication...</div>}>
      <CallbackContent />
    </Suspense>
  )
}