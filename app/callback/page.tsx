"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion" // Importante
import { Loader2 } from "lucide-react" // Importante

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
      <div className="min-h-screen bg-[#3B274C] flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center space-y-4">
          <p className="text-xl font-light italic opacity-80">{error}</p>
          <button 
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-white text-[#3B274C] rounded-full font-bold hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Return to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#3B274C] transition-all duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        {/* Logo Footer */}
        <div className="mb-8">
          <img 
            src="/logofooter.svg" 
            alt="Logo" 
            width={200} 
            height={50} 
            className="brightness-0 invert" 
          />
        </div>
        
        {/* Spinner y Texto */}
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-white/80" />
          <motion.h2 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white text-xl font-normal tracking-wide"
          >
            Authenticating...
          </motion.h2>
        </div>
      </motion.div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#3B274C] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white/20" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}