"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import SubscriptionCheckout from "@/components/subscription-checkout"

export default function SubscriptionPlansPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // TODO: Replace with actual user email from your auth system
  const userEmail = "user@example.com"

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId)
    setIsCheckoutOpen(true)
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Elija su Plan de Suscripción</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ofrezca sus servicios de recuperación a más pacientes. Nuestras suscripciones le brindan visibilidad y las
          herramientas necesarias para conectar con pacientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow pb-6">
              <div className="mb-6">
                <p className="text-4xl font-bold">
                  {formatPrice(plan.priceInCents)}
                  <span className="text-lg font-normal text-muted-foreground">
                    {plan.interval === "month" ? " / cada 3 meses" : " / año"}
                  </span>
                </p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-green-500 flex-shrink-0 w-5 h-5 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button onClick={() => handleSelectPlan(plan.id)} className="w-full text-base py-6" size="lg">
                Comenzar {plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar Suscripción</DialogTitle>
            <DialogDescription>Complete los datos de pago para activar su suscripción</DialogDescription>
          </DialogHeader>

          {selectedPlanId && <SubscriptionCheckout planId={selectedPlanId} customerEmail={userEmail} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
