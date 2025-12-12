"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, Loader2 } from "lucide-react"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      alert("Please agree to the Terms and Conditions")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Signup attempt:", { email })
    setIsLoading(false)
  }

  const handleSocialSignup = (provider: string) => {
    console.log("[v0] Social signup:", provider)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">Create an account</h1>
        <Link href="/login" className="text-lg font-medium text-primary hover:underline">
          Login
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 pl-14 text-lg bg-muted/50 border-0 rounded-2xl"
              />
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-16 pl-14 text-lg bg-muted/50 border-0 rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-base text-muted-foreground leading-relaxed cursor-pointer">
            By creating an account, you agree to the{" "}
            <Link href="/terms" className="text-foreground hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-foreground hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create an account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignup("google")}
          className="h-16 w-16 rounded-full border-2 hover:bg-muted/50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="sr-only">Sign up with Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignup("apple")}
          className="h-16 w-16 rounded-full border-2 hover:bg-muted/50"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="sr-only">Sign up with Apple</span>
        </Button>
      </div>
    </div>
  )
}
