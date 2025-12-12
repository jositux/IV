import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">i</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">IntelligentVideos.ai</h1>
            <p className="text-xs text-gray-600">Artificial General Intelligence Reasoning Model</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            My Projects
          </Link>
          <span className="text-sm font-medium text-gray-700">Credits: 12</span>
          <Link href="/help" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Help
          </Link>
          <Button variant="ghost" size="sm" className="gap-2">
            Anna Stuart
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </Button>
        </nav>
      </div>
    </header>
  )
}
