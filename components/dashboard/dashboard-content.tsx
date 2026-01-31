"use client"
import { useState, useEffect } from "react" // Añadimos useEffect
import { useRouter } from "next/navigation"
import { Video, FileText, FileCheck, Monitor, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useAuth0 } from "@auth0/auth0-react"
import { useBackendAuth } from "@/hooks/use-backend-auth"
import { AppHeader } from "@/components/shared/app-header"
// Importamos el servicio y el tipo
import { fetchUserProfile, type UserProfile } from "@/services/user-full-service"

const stats = [
  { label: "Total videos", value: 0, icon: Video },
  { label: "Total deliverables", value: 0, icon: FileCheck },
  { label: "long form articles", value: 0, icon: FileText },
  { label: "Landing pages", value: 0, icon: Monitor },
]

const filters = ["All videos", "Videos only", "Articles", "Landing pages", "Ommny channel", "Documents"]

export function DashboardContent() {
  const [activeFilter, setActiveFilter] = useState("All videos")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Estado para los datos detallados del servicio nuevo
  const [fullUserData, setFullUserData] = useState<UserProfile | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { user: auth0User, isLoading: auth0Loading } = useAuth0()
  const { backendUser, loading: backendLoading, error: backendError } = useBackendAuth()

  // Efecto para cargar los detalles una vez tengamos el ID del backend
  useEffect(() => {
    if (backendUser?.id) {
      const loadFullProfile = async () => {
        setDetailsLoading(true)
        try {
          const data = await fetchUserProfile(backendUser.id)
          setFullUserData(data)
          localStorage.setItem('user', backendUser.id);
        } catch (err) {
          console.error("Error fetching full profile:", err)
        } finally {
          setDetailsLoading(false)
        }
      }
      loadFullProfile()
    }
  }, [backendUser?.id])

  const isLoading = auth0Loading || backendLoading

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-8 text-5xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card: Perfil Auth0 */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-lg">Auth0 Profile</h3>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-base">{auth0User?.email}</div>
              </div>
              {auth0User?.picture && (
                <img src={auth0User.picture} alt="Profile" className="w-12 h-12 rounded-full" />
              )}
            </CardContent>
          </Card>

          {/* Card: Datos Sincronizados del Backend (Service) */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-lg">Account Details</h3>
              {isLoading || detailsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                   Cargando información de cuenta...
                </div>
              ) : backendError ? (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                  Error: {backendError}
                </div>
              ) : fullUserData ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">User ID</div>
                    <div className="text-xs font-mono bg-gray-100 p-1 rounded">{fullUserData.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Available Credits</div>
                    <div className="text-2xl font-bold text-pink-600">
                      {fullUserData.currentCreditBalance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Subscription</div>
                    <div className="text-base capitalize">
                      {fullUserData.subscriptionType || "Free Plan"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No details found.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <stat.icon className="h-5 w-5 text-gray-900" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Projects Section */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">View projects</h2>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}

            <div className="relative ml-auto w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border-gray-300 bg-white pl-10 pr-4"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-gray-200 bg-white">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <p className="mb-6 text-lg text-gray-600">No videos yet</p>
            <h2 className="mb-4 text-5xl font-bold text-gray-900">Create My First Video</h2>
            <Link href="/inputs">
              <Button size="lg" className="rounded-full bg-pink-500 px-8 py-6 text-lg font-semibold text-white hover:bg-pink-600">
                <ArrowRight className="mr-2 h-5 w-5" />
                Go to create
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}