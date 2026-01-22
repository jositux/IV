"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/shared/header"
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

          <Header />

{/*≈
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 px-4 py-2 bg-[#4A3359] rounded-lg hover:bg-[#5A4369] transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#4A3359]" />
              </div>
              <span className="text-white font-medium">John Smith</span>
              {isDropdownOpen ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    console.log("Logout clicked")
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
                */}
        </nav>
      </div>
    </header>
  )
}
