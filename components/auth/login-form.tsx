"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth0Login = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Construir la URL de autorización de Auth0
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

    // Redirigir a Auth0
    window.location.href = authUrl.toString()
  }

  const handleSocialLogin = (connection: string) => {
    setIsLoading(true)

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
    authUrl.searchParams.append("connection", connection)
    authUrl.searchParams.append("state", Math.random().toString(36).substring(7))

    window.location.href = authUrl.toString()
  }

  return (
    <form onSubmit={handleAuth0Login} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Redirecting..." : "Log in"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" disabled={isLoading} onClick={() => handleSocialLogin("google-oauth2")}>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={() => handleSocialLogin("windowslive")}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
          </svg>
          Microsoft
        </Button>
      </div>
    </form>
  )
}
