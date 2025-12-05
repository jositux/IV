"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  getCustomerSubscriptions,
  cancelSubscription,
  updateSubscription,
  createCustomerPortalSession,
} from "@/app/actions/stripe-subscription"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import type Stripe from "stripe"

export default function ManageSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([])
  const [customer, setCustomer] = useState<Stripe.Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // TODO: Replace with actual user email from your auth system
  const userEmail = "user@example.com"

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await getCustomerSubscriptions(userEmail)
      setSubscriptions(data.subscriptions)
      setCustomer(data.customer)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las suscripciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return

    try {
      setActionLoading(true)
      await cancelSubscription(selectedSubscription)

      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción se ha cancelado exitosamente",
      })

      await loadSubscriptions()
      setCancelDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la suscripción",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
      setSelectedSubscription(null)
    }
  }

  const handleChangePlan = async (subscriptionId: string, newPlanId: string) => {
    try {
      setActionLoading(true)
      await updateSubscription(subscriptionId, newPlanId)

      toast({
        title: "Plan actualizado",
        description: "Tu plan se ha actualizado exitosamente",
      })

      await loadSubscriptions()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el plan",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenCustomerPortal = async () => {
    if (!customer) return

    try {
      setActionLoading(true)
      const portalUrl = await createCustomerPortalSession(customer.id)
      window.open(portalUrl, "_blank")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo abrir el portal de cliente",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activa", variant: "default" as const, icon: CheckCircle },
      canceled: { label: "Cancelada", variant: "destructive" as const, icon: XCircle },
      past_due: { label: "Pago vencido", variant: "destructive" as const, icon: AlertCircle },
      incomplete: { label: "Incompleta", variant: "secondary" as const, icon: AlertCircle },
      trialing: { label: "En prueba", variant: "secondary" as const, icon: RefreshCw },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.incomplete
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getCurrentPlanId = (subscription: Stripe.Subscription) => {
    return subscription.metadata?.planId || "unknown"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando suscripciones...</p>
        </div>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No tienes suscripciones activas</CardTitle>
            <CardDescription>Comienza seleccionando un plan de suscripción</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/subscription/plans">Ver planes disponibles</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gestionar Suscripción</h1>
          <p className="text-muted-foreground">Administra tus planes, métodos de pago y configuración de facturación</p>
        </div>

        {customer && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Información de cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {customer.email}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={handleOpenCustomerPortal}
                disabled={actionLoading}
                className="gap-2 bg-transparent"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Portal de Cliente
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-6">
          {subscriptions.map((subscription) => {
            const currentPlanId = getCurrentPlanId(subscription)
            const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentPlanId)
            const isActive = subscription.status === "active"

            return (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{currentPlan?.name || "Plan desconocido"}</CardTitle>
                      <CardDescription>{currentPlan?.description}</CardDescription>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Período actual</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(subscription.current_period_start * 1000), "PPP", { locale: es })}
                          {" - "}
                          {format(new Date(subscription.current_period_end * 1000), "PPP", { locale: es })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Próximo pago</p>
                        <p className="text-sm text-muted-foreground">
                          ${(subscription.items.data[0].price.unit_amount! / 100).toFixed(2)} el{" "}
                          {format(new Date(subscription.current_period_end * 1000), "PPP", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium mb-2 block">Cambiar plan</label>
                      <div className="flex gap-3">
                        <Select
                          defaultValue={currentPlanId}
                          onValueChange={(value) => handleChangePlan(subscription.id, value)}
                          disabled={actionLoading}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBSCRIPTION_PLANS.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - ${(plan.priceInCents / 100).toFixed(2)}/
                                {plan.interval === "month" ? "trimestre" : "año"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Los cambios se prorratearán automáticamente</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-3">
                  {isActive && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedSubscription(subscription.id)
                        setCancelDialogOpen(true)
                      }}
                      disabled={actionLoading}
                    >
                      Cancelar suscripción
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cancelará tu suscripción inmediatamente. Perderás acceso a todas las características
                premium.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading}>No, mantener suscripción</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {actionLoading ? "Cancelando..." : "Sí, cancelar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
