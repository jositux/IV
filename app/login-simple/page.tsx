"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { LoginSimpleForm } from "@/components/auth/login-simple-form"
import Image from "next/image";
function WelcomeMessage() {
  const searchParams = useSearchParams()
  const newUserName = searchParams.get("new")

  if (!newUserName) return null

  return (
    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
      <p className="text-sm font-medium text-primary">Bienvenido {newUserName}</p>
      <p className="text-xs text-muted-foreground mt-1">Your account has been created successfully. Please log in.</p>
    </div>
  )
}

function PageHeading() {
  const searchParams = useSearchParams()
  const newUserName = searchParams.get("new")

  if (newUserName) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-2">Welcome, {newUserName}</h1>
        <p className="text-muted-foreground">Log in to your new account</p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-muted-foreground">Log in with your credentials</p>
    </>
  )
}

export default function LoginSimplePage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Image
                src="/logofooter.svg"
                alt="Logo"
                layout="responsive"
                width={4}
                height={3}
              />
          </Link>

          <div className="mb-8">
            <Suspense
              fallback={
                <>
                  <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                  <p className="text-muted-foreground">Log in with your credentials</p>
                </>
              }
            >
              <PageHeading />
            </Suspense>
          </div>

          <LoginSimpleForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup-simple" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Visual
      <div className="hidden lg:flex flex-1 bg-accent items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-block p-6 bg-background rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Intelligent Video Analytics</h2>
          <p className="text-muted-foreground">
            Access powerful AI-driven insights and analytics for your video content
          </p>
        </div>
      </div> */}
    </div>
  )
}
