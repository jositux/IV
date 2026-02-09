"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, LogOut, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Importamos el hook que centraliza Auth0 + Backend Credits
import { useUserProfile } from "@/hooks/use-user-profile"

export function ProfileMenu() {
  const { user, isLoading, isError, mutate } = useUserProfile()
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // Limpieza de seguridad al salir
  const clearSessionData = useCallback(() => {
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    };
    
    // Borramos cookies de identidad y token
    deleteCookie("user_id");
    deleteCookie("access_token");
    deleteCookie("id_token");

    // Limpiamos localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");

    // Informamos a SWR que el usuario ya no existe para limpiar la UI al instante
    mutate(null, false);
  }, [mutate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch("/api/logout", { method: "POST" })

      if (response.ok) {
        const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
        const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
        const returnTo = encodeURIComponent(window.location.origin)
        
        clearSessionData()
        
        // Redirección dura para limpiar estados de memoria
        window.location.href = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // 1. Estado de carga inicial (esqueleto)
  if (isLoading) {
    return <div className="h-10 w-24 animate-pulse bg-white/10 rounded-lg" />
  }

  // 2. Si NO hay usuario (o hay error de token/sesión), mostramos LOGIN
  if (!user || isError) {
    return (
      <Link href="/login">
        <Button 
          variant="ghost" 
          className="text-[16px] text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Log In / Sign Up
        </Button>
      </Link>
    )
  }

  // 3. Si hay usuario, mostramos el MENÚ DE PERFIL
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              {user.picture ? (
                <img src={user.picture} alt={user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
            </div>
            <span className="hidden md:inline-block max-w-[120px] truncate">
              {user.name || user.email}
            </span>
            {open ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2 bg-white rounded-xl shadow-2xl border-none">
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
              <span className="text-xs text-slate-500 truncate font-normal">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-slate-100" />
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
              Dashboard
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-100" />
          
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg focus:bg-red-50 focus:text-red-600 transition-colors"
          >
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            <span>{isLoggingOut ? "Cerrando..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}