"use client"

import { useState } from "react"
import { Video, FileText, FileCheck, Monitor, Search, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <span className="text-2xl font-bold text-white">i</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IntelligentVideos.ai</h1>
              <p className="text-xs text-gray-600">Artificial General Intelligence Reasoning Model</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/dashboard/projects" className="text-sm font-medium text-gray-900 hover:text-gray-600">
              My Projects
            </Link>
            <span className="text-sm font-medium text-gray-900">Credits: 12</span>
            <Link href="/help" className="text-sm font-medium text-gray-900 hover:text-gray-600">
              Help
            </Link>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600">
              Anna Stuart
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <User className="h-4 w-4" />
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard Title */}
        <h1 className="mb-8 text-5xl font-bold text-gray-900">Dashboard</h1>

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

          {/* Filters and Search */}
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

            {/* Search Input */}
            <div className="relative ml-auto w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by video name, topic, keyword"
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
            <p className="mb-6 text-lg text-gray-600">Not videos yet</p>

            <h2 className="mb-4 text-5xl font-bold text-gray-900">Create My First Video</h2>

            <p className="mb-8 text-gray-600">PDFs, Word docs, and Web pages are ≈ 400 words each</p>

            <Button
              size="lg"
              className="rounded-full bg-pink-500 px-8 py-6 text-lg font-semibold text-white hover:bg-pink-600"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Go to create
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
