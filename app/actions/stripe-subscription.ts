"use server"

import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function createSubscriptionCheckout(planId: string, customerEmail?: string) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
  if (!plan) {
    throw new Error(`Plan with id "${planId}" not found`)
  }

  // Create or retrieve customer
  let customerId: string | undefined

  if (customerEmail) {
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
      })
      customerId = customer.id
    }
  }

  // Create Checkout Session for subscription
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: {
      metadata: {
        planId: plan.id,
      },
    },
  })

  return session.client_secret
}

export async function getCustomerSubscriptions(customerEmail: string) {
  try {
    // Find customer by email
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return { subscriptions: [], customer: null }
    }

    const customer = customers.data[0]

    // Get all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      expand: ["data.default_payment_method"],
    })

    return {
      customer,
      subscriptions: subscriptions.data,
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return { success: true, subscription }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}

export async function updateSubscription(subscriptionId: string, newPlanId: string) {
  try {
    const newPlan = SUBSCRIPTION_PLANS.find((p) => p.id === newPlanId)
    if (!newPlan) {
      throw new Error(`Plan with id "${newPlanId}" not found`)
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update the subscription with the new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPlan.stripePriceId,
        },
      ],
      proration_behavior: "create_prorations",
      metadata: {
        planId: newPlan.id,
      },
    })

    return { success: true, subscription: updatedSubscription }
  } catch (error) {
    console.error("Error updating subscription:", error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription/manage`,
    })

    return session.url
  } catch (error) {
    console.error("Error creating portal session:", error)
    throw error
  }
}
