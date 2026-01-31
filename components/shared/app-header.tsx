"use client"
import Link from "next/link"
import Image from "next/image"
import { useUserProfile } from "@/hooks/use-user-profile"
import { ProfileMenu } from "@/components/shared/profile-menu"

export function AppHeader() {
  const { user } = useUserProfile();

  return (
    <header className="bg-[#3B274C] text-white px-6 py-4 rounded-[20px] shadow-lg">
      <div className="mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logofooter.svg" alt="Logo" width={200} height={50} priority />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-white hover:opacity-80 transition-opacity">
            My Projects
          </Link>
          <Link href="/pricing" className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
            <span className="text-sm font-medium">
              Credits: <strong className="text-[#2EADF9]">{user?.currentCreditBalance ?? 0}</strong>
            </span>
          </Link>
          <Link href="/help" className="text-sm font-medium text-white hover:opacity-80 transition-opacity">
            Help
          </Link>
          <ProfileMenu />
        </nav>
      </div>
    </header>
  )
}