export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: "month" | "year"
  stripePriceId: string
  features: string[]
}

// Define your subscription plans here
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "quarterly",
    name: "Plan Trimestral",
    description: "Ideal para comenzar",
    priceInCents: 4000, // $40.00
    interval: "month",
    stripePriceId: "price_1R7ctQGDJ9gekygzhq6qw9Eo", // Your Stripe Price ID
    features: [
      "Aparición prioritaria en búsquedas",
      "Visible en todas las habitaciones relacionadas",
      "Pacientes ilimitados",
      "Herramientas avanzadas de seguimiento",
    ],
  },
  {
    id: "annual",
    name: "Plan Anual",
    description: "Máxima visibilidad y herramientas",
    priceInCents: 10000, // $100.00
    interval: "year",
    stripePriceId: "price_1R7cqLGDJ9gekygzcT6RrHD8", // Your Stripe Price ID
    features: [
      "Aparición prioritaria en búsquedas",
      "Visible en todas las habitaciones relacionadas",
      "Pacientes ilimitados",
      "Herramientas avanzadas de seguimiento",
      "Ahorra 2 meses al año",
    ],
  },
]
