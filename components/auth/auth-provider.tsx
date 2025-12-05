"use client"

import type React from "react"

import { UserProvider } from "@auth0/nextjs-auth0/client"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}
