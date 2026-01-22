"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

import { User, LogOut } from "lucide-react"

import { getAuthToken } from "@/lib/get-auth-token"

interface UserInfo {
  name?: string
  email?: string
  picture?: string
}

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //const accessToken = localStorage.getItem("access_token")
        const token = await getAuthToken()
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Datita : ", data)
          setUser(data)
        } else {
          localStorage.removeItem("access_token")
          localStorage.removeItem("id_token")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /*const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("id_token")

    const logoutUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.location.origin)}`
    window.location.href = logoutUrl
  }*/


  const handleLogout = async () => {
    try {


      setIsLoggingOut(true)
      const response = await fetch("/api/logout", {
        method: "POST",
      })

      if (response.ok) {
        const logoutUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.location.origin)}`
   localStorage.removeItem("access_token")
    localStorage.removeItem("user")
        router.push(logoutUrl)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
   

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-muted rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {user.picture ? (
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={user.name || "User"}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span>{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[16px]">Log In / Sign Up</Button>
              </Link>
             
            </>
          )}
        </div>
     
  )
}
