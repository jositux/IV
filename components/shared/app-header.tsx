import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Image from "next/image";


export function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
        <Image
                src="/logofooter.svg"
                alt="Logo"
                width={200}
                height={50}
              />
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
