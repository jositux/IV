"use client"

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

function getUserData() {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("user")
  if (!userData) return null
  try {
    return userData
  } catch {
    return null
  }
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
    const user = getUserData()
    const token = await getAuthToken()

    if (!user || !token) {
      setErrorMessage("Please log in to purchase credits")
      setConfirmDialog({ open: false, planName: "", credits: 0, description: "" })
      return
    }

    setLoadingPlan(confirmDialog.planName)
    setSuccessMessage(null)
    setErrorMessage(null)
    setConfirmDialog({ open: false, planName: "", credits: 0, description: "" })

    try {
      const response = await addCreditToUser(token, user, {
        amount: confirmDialog.credits,
        description: confirmDialog.description,
      })

      if (response.success) {
        setSuccessMessage(`Successfully added ${confirmDialog.credits} credits! New balance: ${response.newBalance}`)
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
            All plans include access to our AGI-powered platform and all features.
          </p>
        </div>

        {successMessage && (
          <Alert className="mb-6 bg-green-900/40 border-green-500 text-white max-w-3xl mx-auto">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 bg-red-900/40 border-red-500 text-white max-w-3xl mx-auto">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Creator Plan */}
          <Card className="bg-purple-900/40 backdrop-blur border-cyan-400 text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-medium mb-2">Creator</CardTitle>
              <CardDescription className="text-purple-200 text-sm leading-relaxed">
                Perfect for individuals and small businesses getting started with professional video content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-gray-400 line-through text-xl mr-2">$59</span>
                <span className="text-5xl font-medium">$50</span>
                <span className="text-purple-200 text-lg">/month</span>
              </div>
              <p className="text-sm text-purple-200 mb-6">Billed annually at $600/year</p>

              <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                <div className="text-3xl font-medium mb-2">60</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Credits per month</div>
              </div>

              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">All platform features included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Professional avatars in 30+ languages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">AGI-powered Video Script generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Video Landing Pages & Long-form Articles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">GEO Optimization for AI search</span>
                </li>
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
                onClick={() => handlePurchaseClick("Creator", 60, "Creator Plan - Monthly credits")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Creator" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Select Plan"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Studio Plan */}
          <Card className="border-cyan-400 text-white relative bg-purple-900/60 backdrop-blur">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-sm text-sm font-medium">
              Most Popular
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-medium mb-2">Studio</CardTitle>
              <CardDescription className="text-purple-200 text-sm leading-relaxed">
                For growing businesses and teams that need more content and personalization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-gray-400 line-through text-xl mr-2">$129</span>
                <span className="text-5xl font-medium">$116</span>
                <span className="text-purple-200 text-lg">/month</span>
              </div>
              <p className="text-sm text-purple-200 mb-6">Billed annually at $1,393/year</p>

              <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                <div className="text-3xl font-medium mb-2">150</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Credits per month</div>
              </div>

              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Everything in Creator, plus:</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">1 Personal Custom Avatar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Priority processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Access to Studio Boost</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
                onClick={() => handlePurchaseClick("Studio", 150, "Studio Plan - Monthly credits")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Studio" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Select Plan"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Studio Boost */}
          <Card className="bg-purple-900/40 backdrop-blur border-cyan-400 text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-medium mb-2">Studio Members Only / Studio Boost</CardTitle>
              <CardDescription className="text-purple-200 text-sm leading-relaxed">
                Need more credits? Purchase our Studio Boost pack anytime to supercharge your content production. Only
                available to Studio plan members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span>600 credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span>2 Additional Personal Avatars</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Never expires</span>
                </li>
              </ul>

              <div className="border-2 border-blue-600 rounded-lg p-6 mb-6">
                <div className="text-5xl font-medium mb-4">$499</div>
                <div className="text-3xl font-medium mb-4">600 Credits</div>
                <p className="text-sm text-purple-200">One-time purchase - Requires Studio plan</p>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
                onClick={() => handlePurchaseClick("Studio Boost", 600, "Studio Boost - One-time purchase")}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === "Studio Boost" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Purchase Boost"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="bg-gray-900 border-cyan-400 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Credit Purchase</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to add {confirmDialog.credits} credits to your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, planName: "", credits: 0, description: "" })}
              className="border-gray-600 text-black hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase} className="bg-blue-600 hover:bg-blue-700 text-white">
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
