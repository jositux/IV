"use client"

import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface StickyFooterProps {
  totalCredits: number
  availableCredits: number
  generating: boolean
  canGenerate: boolean
  hasEnoughCredits: boolean
  onGenerate: () => void
  statusMessage?: string | null
}

export function StickyFooter({
  totalCredits,
  availableCredits,
  generating,
  canGenerate,
  hasEnoughCredits,
  onGenerate,
  statusMessage,
}: StickyFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto px-4">
        
        {/* Lado Izquierdo: Resumen de Créditos */}
        <div className="flex items-center gap-8">
          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Required</p>
            <p className="text-2xl font-semibold text-[#080936]">{totalCredits} <span className="text-sm font-normal text-gray-400">credits</span></p>
          </div>
          
          <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />

          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Your Balance</p>
            <p className={`text-2xl font-semibold ${hasEnoughCredits ? 'text-green-600' : 'text-amber-500'}`}>
              {availableCredits} <span className="text-sm font-normal text-gray-400">available</span>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Acciones y Alertas */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          
          {/* Mensaje de error sutil */}
          {!hasEnoughCredits && !generating && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-right-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Insufficient balance for this duration</span>
            </div>
          )}

          {generating && statusMessage && (
            <div className="flex items-center gap-2 text-blue-600 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{statusMessage}</span>
            </div>
          )}

          <div className="flex gap-3 w-full sm:w-auto">
            {!hasEnoughCredits ? (
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  className="w-full sm:w-48 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 font-semibold flex gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Credits
                </Button>
              </Link>
            ) : (
              <Button
                onClick={onGenerate}
                disabled={generating || !canGenerate}
                size="lg"
                className="w-full sm:w-64 bg-[#080936] hover:bg-[#12145e] text-white py-6 text-lg font-semibold transition-all shadow-lg shadow-blue-900/10"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Video"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}