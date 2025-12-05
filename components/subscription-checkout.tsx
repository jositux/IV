"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { createSubscriptionCheckout } from "@/app/actions/stripe-subscription"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionCheckoutProps {
  planId: string
  customerEmail?: string
}

export default function SubscriptionCheckout({ planId, customerEmail }: SubscriptionCheckoutProps) {
  const fetchClientSecret = useCallback(
    () => createSubscriptionCheckout(planId, customerEmail),
    [planId, customerEmail],
  )

  return (
    <div id="subscription-checkout" className="w-full max-w-2xl mx-auto">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
