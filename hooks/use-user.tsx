"use client"

// Mock implementation of useUser for v0 compatibility
// The @auth0/nextjs-auth0/client is not compatible with v0 environment

export interface User {
  sub?: string
  name?: string
  email?: string
  picture?: string
  [key: string]: any
}

export function useUser() {
  return {
    user: undefined as User | undefined,
    error: undefined,
    isLoading: false,
  }
}
