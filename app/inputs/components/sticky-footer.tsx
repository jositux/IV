"use client"

import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, ShoppingCart, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface StickyFooterProps {
  totalCredits: number
  availableCredits: number | null
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
  
  // Determinamos si el balance ya terminó de cargar desde la API
  const isReady = availableCredits !== null;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50 min-h-[85px]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto px-4">
        
        {/* IZQUIERDA: RESUMEN DE CRÉDITOS */}
        <div className="flex items-center gap-8 min-w-[280px]">
          <div className="w-24">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Required</p>
            <p className="text-2xl font-semibold text-[#080936]">
              {totalCredits} 
              <span className="text-xs font-normal text-gray-400 ml-1">credits</span>
            </p>
          </div>
          
          <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />

          <div className="w-32">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Your Balance</p>
            <motion.p 
              animate={{ color: isReady ? (hasEnoughCredits ? '#16a34a' : '#f59e0b') : '#9ca3af' }}
              className="text-2xl font-semibold"
            >
              {isReady ? availableCredits : "—"} 
              <span className="text-xs font-normal text-gray-400 ml-1">credits</span>
            </motion.p>
          </div>
        </div>

        {/* DERECHA: ACCIONES */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center justify-end min-w-[180px]">
            <AnimatePresence>
              {isReady && !hasEnoughCredits && !generating && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="flex items-center gap-2 text-amber-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Insufficient balance</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative w-full sm:w-64 h-[56px]">
            <AnimatePresence mode="wait">
              {!isReady ? (
                // Mientras carga el balance, mostramos un estado neutro
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-200" />
                </motion.div>
              ) : !hasEnoughCredits ? (
                // Solo mostramos COMPRA si isReady es true y NO alcanzan los créditos
                <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full h-full border-[#6D58BB] text-[#6D58BB] hover:bg-indigo-50 font-bold text-base border-2 rounded-xl cursor-pointer">
                      <ShoppingCart className="w-5 h-5 mr-2" /> Buy Credits
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                // Solo mostramos GENERAR si isReady es true y SÍ alcanzan los créditos
                <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <Button 
                    onClick={onGenerate} 
                    disabled={generating || !canGenerate} 
                    className="w-full rounded-xl bg-[#6D58BB] px-8 py-7 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer"
                  >
                    {generating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Project</>}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}