"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ProfileMenu } from "@/components/shared/profile-menu"
import { fetchUserProfile, type UserProfile } from "@/services/user-full-service"

export function AppHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [fullUserData, setFullUserData] = useState<UserProfile | null>(null)

  useEffect(() => {
    // 1. Obtenemos el valor directamente del localStorage
    const userData = localStorage.getItem("user");
  
    // 2. Si existe el valor, lo usamos directamente como ID
    if (userData) {
      const loadFullProfile = async () => {
        try {
          // En este caso, userData ya es el ID (ej: "550e8400-e2...")
          const data = await fetchUserProfile(userData);
          setFullUserData(data);
        } catch (err) {
          console.error("Error fetching full profile:", err);
        }
      };
      loadFullProfile();
    }
  }, []); // Se ejecuta una sola vez al cargar el componente


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-[#3B274C] text-white px-6 py-4 rounded-[20px]">
      <div className="mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logofooter.svg" alt="Logo" width={200} height={50} />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-white hover:text-gray-200">
            My Projects
          </Link>
          <Link href="/pricing"><span className="text-sm font-medium">Credits: <strong className="text-[#2EADF9]">{fullUserData?.currentCreditBalance}</strong></span></Link>
          <Link href="/help" className="text-sm font-medium text-white hover:text-gray-200">
            Help
          </Link>

          <ProfileMenu />

        </nav>
      </div>
    </header>
  )
}
