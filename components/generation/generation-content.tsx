"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, ChevronUp, Play, Download, Copy, Check } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/shared/app-header"

interface Section {
  subtitle: string
  description?: string
  items?: string[]
  codeContent?: string
}

interface Deliverable {
  id: string
  title: string
  content?: string
  description?: string
  codeContent?: string
  imagePreview?: boolean
  sections?: Section[]
}

const projectDeliverables = [
  { label: "1 MP4", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "AI Assets", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "4 Keywords", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "1 SEO", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "3 Images", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "16 Link Info", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { label: "7 HTML", color: "bg-blue-100 text-blue-700 border-blue-300" },
]

const deliverables: Deliverable[] = [
  {
    id: "direct-play",
    title: "Direct Play Video URL",
    content: "https://intelligentvideos.ai/play/abc123xyz",
  },
  {
    id: "embed",
    title: "Embed URL",
    content:
      '<iframe src="https://intelligentvideos.ai/embed/abc123xyz" width="640" height="360" frameborder="0" allowfullscreen></iframe>',
  },
  {
    id: "sticky-instructions",
    title: "How to Add Your Sticky Video to Your Website - All Platforms",
    sections: [
      {
        subtitle: "WordPress (43% of websites) - Multiple easy options",
        items: [
          "Custom HTML Block - Direct tag insertion",
          "Wix - Drag-and-drop builder",
          "Squarespace - Design-focused platform",
          "Shopify - E-commerce integration",
          "Custom HTML Sites - Direct file editing",
          "Webflow/WebFlow Apps - Modern interfaces",
          "Other Platforms - Works everywhere",
        ],
      },
      {
        subtitle: "WHAT YOU'LL DO",
        description: "Add your videotag code to any page on your website in just 2 simple steps",
      },
    ],
  },
  {
    id: "sticky-geo",
    title: "Sticky Video with GEO Optimization",
    description: "SEO-optimized sticky video embed script with advanced features and GEO optimization.",
    codeContent: `<div id="sticky-video-container" data-position="bottom-right">
  <div class="sticky-video-wrapper">
    <iframe src="https://intelligentvideos.ai/embed/abc123xyz" 
            width="320" height="180" 
            frameborder="0" 
            allowfullscreen>
    </iframe>
    <button class="close-btn" onclick="closeStickyVideo()">×</button>
  </div>
</div>

<script>
// GEO-location based positioning and optimization
// Automatically adjusts position based on user's location
// Provides enhanced SEO signals for local search
</script>`,
  },
  {
    id: "advantages",
    title: "Sticky Video Advantages Page",
    content: "Congratulations! You Just Made the Smartest Decision for Your Business",
    description:
      "While your competitors are still using basic embed codes, you're now equipped with professional sticky video implementation that delivers higher engagement and better conversion rates.",
    imagePreview: true,
  },
  {
    id: "seo-geo",
    title: "Comprehensive SEO and GEO Optimization",
    sections: [
      {
        subtitle: "PRIMARY META TAGS WITH GEO ENHANCEMENT",
        codeContent: `<1-- PRIMARY META TAGS WITH GEO ENHANCEMENT -->
<title>How Dashboard Navigation</title>
<meta name="title" content="User Productivity -
Global Usability - Modern Interface">
<meta name="description" content="Explore advanced
analytics features">`,
      },
      {
        subtitle: "GEO-Specific Meta Tags",
        codeContent: `<1-- GEO-Specific Meta Tags -->
<meta name="geo.region" content="US-CA">
<meta name="author" content="Sarah Johnson">
<meta name="geo.position" content="37.774;-122.419">`,
      },
    ],
  },
  {
    id: "keyword-research",
    title: "Primary Keyword Research",
    sections: [
      {
        subtitle: "KEYWORD RESEARCH ANALYSIS",
        description: "PRIMARY KEYWORDS (with Search Volume & Competition Analysis)",
        items: [
          "1 Health Benefits of Creative",
          "Search Volume: 9,500/month",
          "Competition: Medium",
          "Search Intent: Informational",
          "Rationale: Primary target keyword matches user search intent, balancing volume with achievable ranking potential while understanding medium-to-competitive advantages beyond basic awareness.",
        ],
      },
    ],
  },
  {
    id: "seo-package",
    title: "SEO Optimization Package",
    sections: [
      {
        subtitle: "1. Core Meta Tags Implementation",
        description:
          "Each meta tag is carefully crafted to enhance your page's visibility in search results. Add these to the <head> section of your webpage. These provide basic information to search engines about your content.",
        codeContent: `<meta name="keywords" content="Keyword1, Keyword2, Term 3">
<meta name="description" content="Performance Benefits">
<meta name="robots" content="index, follow">
<meta http="x-ua-compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,
initial-scale=1.0">
<meta name="format-detection" content="telephone=no">`,
      },
    ],
  },
  {
    id: "sticky-code-geo",
    title: "Sticky Video Code with GEO (Generative Engine Optimization)",
    description:
      "Complete Sticky Video Code with GEO Optimization - This is the complete HTML file including all GEO markup, sticky video embed, and sticky video functionality.",
    codeContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="...">
  <title>...</title>
  <meta name="geo.region" content="US">
  <meta name="geo.position" content="...">
  <meta name="ICBM" content="37.7749, -122.4194">
</head>`,
  },
]

export function GenerationContent() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["direct-play"])
  const [copiedItems, setCopiedItems] = useState<string[]>([])
  const [collapsedMainSections, setCollapsedMainSections] = useState<string[]>([])

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleMainSection = (id: string) => {
    setCollapsedMainSections((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedItems((prev) => [...prev, id])
    setTimeout(() => {
      setCopiedItems((prev) => prev.filter((item) => item !== id))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-2">Dashboard / Video and GEO/SEO Sticky Video Code</div>

        {/* Title and Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-gray-900">Coffee health benefits</h2>
          <Link href="/dashboard">
            <Button variant="outline" className="cursor-pointer gap-2 bg-transparent">
              Go to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 p-6">
            <div className="text-left">
              <div className="font-semibold text-sm">Video Suction</div>
              <div className="text-xs opacity-90">Professional Script Generation</div>
            </div>
          </Button>
          <Button variant="outline" className="p-6 bg-transparent">
            <div className="text-left">
              <div className="font-semibold text-sm">Long-Form Articles</div>
              <div className="text-xs text-gray-600">SEO Optimized Content</div>
            </div>
          </Button>
          <Button variant="outline" className="p-6 bg-transparent">
            <div className="text-left">
              <div className="font-semibold text-sm">Video Landing Page</div>
              <div className="text-xs text-gray-600">Night Streaming Page</div>
            </div>
          </Button>
          <Button variant="outline" className="p-6 bg-transparent">
            <div className="text-left">
              <div className="font-semibold text-sm">Omni-Channel Suite</div>
              <div className="text-xs text-gray-600">Complete Package</div>
            </div>
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-gray-300 rounded-lg aspect-video flex items-center justify-center relative">
              <Button size="lg" className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <Play className="w-8 h-8 fill-white" />
              </Button>
            </div>

            {/* Sticky Video with GEO Optimization */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleMainSection("sticky-geo")}
                className="w-full flex items-start justify-between p-6 text-left cursor-pointer transition-all duration-300 ease-in-out"
              >
                <h3 className="text-lg font-semibold text-gray-900">Sticky Video with GEO Optimization</h3>
                {collapsedMainSections.includes("sticky-geo") ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform duration-300" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform duration-300" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedMainSections.includes("sticky-geo") ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
                }`}
              >
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-sm text-gray-700">
                    SEO-Optimized sticky video implementation designed to increase conversions by letting your custom
                    video
                    <br />
                    <strong className="text-gray-900">
                      automatically play position throughout all confidence in lifting your custom SEO...
                    </strong>
                  </p>
                  <div className="bg-gray-900 text-gray-300 p-4 rounded font-mono text-xs overflow-x-auto">
                    <div>&lt;div id="sticky-video-container"&gt;</div>
                    <div className="ml-4">&lt;script src="sticky-video.js"&gt;&lt;/script&gt;</div>
                    <div className="ml-4">&lt;!--Video positioning throughout all confidence--&gt;</div>
                    <div>&lt;/div&gt;</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advantages Preview */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleMainSection("advantages")}
                className="w-full flex items-start justify-between p-6 text-left cursor-pointer transition-all duration-300 ease-in-out"
              >
                <h3 className="text-lg font-semibold text-gray-900">Sticky Video Advantages Page</h3>
                {collapsedMainSections.includes("advantages") ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform duration-300" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform duration-300" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedMainSections.includes("advantages") ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="bg-gray-200 rounded p-8 text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      Congratulations! You Just Made the Smartest Decision for Your Business
                    </h4>
                    <p className="text-gray-700">
                      While your competitors are still using basic embed codes, you're now equipped with professional
                      sticky video implementation that delivers higher engagement and better conversion rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Deliverables */}
          <div className="space-y-4">
            {/* Project Deliverables Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Project Deliverables</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {projectDeliverables.map((item, index) => (
                  <Badge key={index} variant="outline" className={item.color}>
                    {item.label}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" size="sm" className="cursor-pointer w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            {/* Collapsible Deliverables */}
            <div className="space-y-3">
              {deliverables.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                    {expandedSections.includes(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedSections.includes(item.id) ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {item.content && (
                        <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 break-all">
                          {item.content}
                        </div>
                      )}

                      {item.codeContent && (
                        <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-xs overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{item.codeContent}</pre>
                        </div>
                      )}

                      {item.sections?.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="font-semibold text-xs text-gray-900">{section.subtitle}</h4>
                          {section.description && <p className="text-xs text-gray-600">{section.description}</p>}
                          {section.items && (
                            <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                              {section.items.map((listItem, i) => (
                                <li key={i}>{listItem}</li>
                              ))}
                            </ul>
                          )}
                          {section.codeContent && (
                            <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-xs overflow-x-auto">
                              <pre className="whitespace-pre-wrap">{section.codeContent}</pre>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => handleCopy(item.content || item.codeContent || "", item.id)}
                        >
                          {copiedItems.includes(item.id) ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          <Download className="w-3 h-3 mr-1" />
                          Download 
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
