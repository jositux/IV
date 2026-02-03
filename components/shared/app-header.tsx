"use client"
import Link from "next/link"
import Image from "next/image"
import { useUserProfile } from "@/hooks/use-user-profile"
import { ProfileMenu } from "@/components/shared/profile-menu"
import { RefreshCw } from "lucide-react" // Opcional: para un icono de carga

export function AppHeader() {
  // Extraemos realBalance que es el valor sin restas del localStorage
  const { realBalance, projectedBalance, isLoading } = useUserProfile();

  return (
    <header className="bg-[#3B274C] text-white px-6 py-4 rounded-[20px]">
      <div className="mx-auto flex items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image src="/logofooter.svg" alt="Logo" width={200} height={50} priority />
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            My Projects
          </Link>

          {/* CRÉDITOS: Usando el Real Balance */}
          <Link href="/pricing" className="group">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-all">
              <span className="text-sm font-medium text-white/80 flex items-center gap-1">
                Credits:{" "}
                <strong className="text-[#2EADF9]">
                  {isLoading ? "..." : projectedBalance}
                </strong>
                {/* Opcional: un pequeño indicador si se está validando en el servidor
                {isValidating && (
                  <RefreshCw className="w-3 h-3 animate-spin opacity-50 ml-1" />
                )} */}
              </span>
            </div>
          </Link>

          <Link 
            href="/help" 
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Help
          </Link>

          {/* MENÚ DE PERFIL */}
          <div className="pl-2 border-l border-white/10">
            <ProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}