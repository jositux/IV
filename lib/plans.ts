export interface SubscriptionPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
  popular?: boolean
}

// Source of truth for all subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    priceMonthly: 999, // $9.99
    priceYearly: 9900, // $99.00 (save ~17%)
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    priceMonthly: 2999, // $29.99
    priceYearly: 29900, // $299.00 (save ~17%)
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 9999, // $99.99
    priceYearly: 99900, // $999.00 (save ~17%)
    popular: false,
  },
]

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}
