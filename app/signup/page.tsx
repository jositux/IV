import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Visual 
      <div className="hidden lg:flex flex-1 bg-accent items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-block p-6 bg-background rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Secure & Enterprise-Ready</h2>
          <p className="text-muted-foreground">
            Join thousands of teams building the future of video intelligence with our secure platform
          </p>
        </div>
      </div>*/}

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded" />
            <span className="font-semibold text-lg">IntelligentVideos</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Get started with your free account today</p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
