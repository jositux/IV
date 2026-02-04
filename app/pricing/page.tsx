"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { addCreditToUser } from "@/services/add-credit-to-user"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AppHeader } from "@/components/shared/app-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAuthToken } from "@/lib/get-auth-token"

/**
 * Lee el ID de usuario desde la cookie.
 * Fuente única de verdad sincronizada con el backend.
 */
function getUserIdFromCookie() {
  if (typeof window === "undefined") return null
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_id=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    planName: string
    credits: number
    description: string
  }>({
    open: false,
    planName: "",
    credits: 0,
    description: "",
  })

  const handlePurchaseClick = (planName: string, credits: number, description: string) => {
    setConfirmDialog({
      open: true,
      planName,
      credits,
      description,
    })
  }

  const handleConfirmPurchase = async () => {
    // CAMBIO: Ahora usamos la cookie segura en lugar de localStorage
    const userId = getUserIdFromCookie()
    const token = await getAuthToken()

    if (!userId || !token) {
      setErrorMessage("Please log in to purchase credits")
      setConfirmDialog({ open: false, planName: "", credits: 0, description: "" })
      return
    }

    setLoadingPlan(confirmDialog.planName)
    setSuccessMessage(null)
    setErrorMessage(null)
    setConfirmDialog({ open: false, planName: "", credits: 0, description: "" })

    try {
      // Usamos el ID de la cookie para la transacción
      const response = await addCreditToUser(token, userId, {
        amount: confirmDialog.credits,
        description: confirmDialog.description,
      })

      if (response.success) {
        setSuccessMessage(`Successfully added ${confirmDialog.credits} credits!`)
        // Redirigimos al dashboard para que el hook useUserProfile detecte el cambio
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add credits")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <AppHeader />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-medium mb-4 text-white">Simple. Transparent pricing</h1>
          <p className="text-lg text-gray-300">
            All plans include access to our platform and all features.
          </p>
        </div>

        {/* Mensajes de Feedback */}
        {(successMessage || errorMessage) && (
          <div className="max-w-3xl mx-auto mb-6">
            {successMessage && (
              <Alert className="bg-green-900/40 border-green-500 text-white">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert className="bg-red-900/40 border-red-500 text-white">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Grid de Planes */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Creator Plan */}
          <Card className="bg-purple-900/40 backdrop-blur border-cyan-400 text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-medium mb-2">Creator</CardTitle>
              <CardDescription className="text-purple-200 text-sm">
                Perfect for individuals getting started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-5xl font-medium">$50</span>
                <span className="text-purple-200 text-lg">/month</span>
              </div>
              <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                <div className="text-3xl font-medium mb-2">60</div>
                <div className="text-sm text-gray-300">Credits per month</div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                onClick={() => handlePurchaseClick("Creator", 60, "Creator Plan")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Creator" ? <Loader2 className="animate-spin" /> : "Select Plan"}
              </Button>
            </CardContent>
          </Card>

          {/* Studio Plan */}
          <Card className="border-cyan-400 text-white relative bg-purple-900/60 backdrop-blur">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 px-6 py-2 rounded-sm text-sm">
              Most Popular
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-medium mb-2">Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4"><span className="text-5xl font-medium">$116</span></div>
              <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                <div className="text-3xl font-medium mb-2">150</div>
                <div className="text-sm text-gray-300">Credits per month</div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                onClick={() => handlePurchaseClick("Studio", 150, "Studio Plan")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Studio" ? <Loader2 className="animate-spin" /> : "Select Plan"}
              </Button>
            </CardContent>
          </Card>

          {/* Boost Plan */}
          <Card className="bg-purple-900/40 backdrop-blur border-cyan-400 text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-medium mb-2">Studio Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-blue-600 rounded-lg p-6 mb-6">
                <div className="text-5xl font-medium mb-2">$499</div>
                <div className="text-xl">600 Credits</div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                onClick={() => handlePurchaseClick("Studio Boost", 600, "Studio Boost Pack")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Studio Boost" ? <Loader2 className="animate-spin" /> : "Purchase Boost"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="bg-gray-900 border-cyan-400 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add {confirmDialog.credits} credits to your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} className="text-black">
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} className="bg-blue-600">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}