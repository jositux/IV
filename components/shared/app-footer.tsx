"use client"

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function AppFooter() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-[#080936] text-white py-16 rounded-[20px] mt-4">
      <div className="container mx-auto px-4">
        {/* Sección Superior: Logo y Descripción Centrada */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logofooter.svg" alt="Logo" width={200} height={50} />
            </Link>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Step into the future of AGI content creation Broadcast-ready videos, GEO-Optimized articles, social media posts, emails & PPTs Experience writing that transcends human limitations
          </p>
        </div>

        {/* Línea Divisora Fina */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Sección Inferior: Copyright, Links y Redes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright y Links Legales */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-400">
            <p>© {currentYear} Intelligent Videos. All rights reserved.</p>
            
            <div className="flex gap-6">
              <Link href="/legal" className="hover:text-white transition-colors">
                Legal Notice
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
            </div>
          </div>

          {/* Iconos de Redes Sociales */}
          <div className="flex items-center gap-5 text-gray-400">
            <Link href="https://facebook.com" className="hover:text-white transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="https://twitter.com" className="hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="https://instagram.com" className="hover:text-white transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="https://youtube.com" className="hover:text-white transition-colors">
              <Youtube size={20} />
            </Link>
            <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center cursor-pointer hover:text-white transition-colors">
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}