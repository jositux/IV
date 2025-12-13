"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Plus, X, FileText, Globe, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/shared/app-header"


const avatars = [
  { name: "Gloria" },
  { name: "Brandie" },
  { name: "Colleen" },
  { name: "Connie" },
  { name: "Arlene" },
  { name: "Dianne" },
  { name: "Bessie" },
]

const videoLengths = ["30s", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m"]

const languages = [
  { code: "en", label: "US English" },
  { code: "es", label: "Es Spanish" },
  { code: "fr", label: "Fr French" },
  { code: "ch", label: "Ch Chinese" },
  { code: "de", label: "De German" },
]

const additionalProducts = [
  {
    title: "Long-Form Article",
    credits: 15,
    description:
      "Transform your video content into comprehensive written articles with GEO optimization for AI search engines, embedded video, and AI-generated images.",
    features: [
      "GEO Optimized for AI Search (ChatGPT, Perplexity, Claude, Gemini)",
      "Auto-Generated Images",
      "SEO & Schema Markup",
    ],
  },
  {
    title: "Video Landing Page",
    credits: 8,
    description:
      "Professional landing page with GEO optimization for AI discovery. Maximize engagement with optimal above-the-fold placement, enhanced typography, and strategic content organization.",
    features: ["GEO Optimized for AI Search Engines", "341% Higher Conversion", "SEO Schema Markup & Mobile Optimized"],
  },
  {
    title: "Omni-Channel Communication Suite",
    credits: 10,
    description:
      "Complete communication package with video-enhanced content across all channels. Includes PowerPoint, LinkedIn/X posts, and email templates.",
    features: ["PowerPoint Presentation", "LinkedIn & X Posts", "Multi-Platform Emails"],
  },
]

export function InputsContent() {
  const [text, setText] = useState("")
  const [keywords, setKeywords] = useState("Coffee, Health, Health benefits of coffee")
  const [targetAudience, setTargetAudience] = useState("Marketing specialists / Business executives")
  const [files, setFiles] = useState<string[]>([
    "Analysis Data April.ppt",
    "Sequence Data.doc",
    "DNA Sequence.xls",
    "Electrometer Data.jpg",
  ])
  const [urls, setUrls] = useState<string[]>(["www.espn.com", "www.britannica.com", "www.reddit.co/hubermann"])
  const [newUrl, setNewUrl] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("Gloria")
  const [videoLength, setVideoLength] = useState("2m")
  const [language, setLanguage] = useState("en")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [videoPosition, setVideoPosition] = useState("standard")
  const [videoSize, setVideoSize] = useState("standard")

  const maxWords = 20000
  const wordsUsed = 2621
  const wordsRemaining = maxWords - wordsUsed

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls((prev) => [...prev, newUrl])
      setNewUrl("")
    }
  }

  const removeUrl = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleProduct = (title: string) => {
    setSelectedProducts((prev) => (prev.includes(title) ? prev.filter((p) => p !== title) : [...prev, title]))
  }

  const calculateTotalCredits = () => {
    const baseCredits = 4
    const productCredits = selectedProducts.reduce((sum, title) => {
      const product = additionalProducts.find((p) => p.title === title)
      return sum + (product?.credits || 0)
    }, 0)
    return baseCredits + productCredits
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
       <AppHeader/>

      <div className="max-w-7xl mx-auto px-6 py-12">
       
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Inputs, Extraordinary Results</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AGI-powered platform needs minimal input to generate results that are more human than human
          </p>
        </div>

        {/* Section 1: Text Input */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Choose any one input method below or combine multiple to better align with your specific vision.
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Enter Topic or Text</Label>
                <span className="text-sm text-gray-600">
                  Maximum Words allowed <span className="font-semibold">{maxWords.toLocaleString()}</span>
                </span>
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter Topic, Upload PDFs, Word Docs, Images, Enter Web URLs"
                className="min-h-[120px] resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  Words used <span className="font-semibold">{wordsUsed.toLocaleString()}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Words remaining <span className="font-semibold">{wordsRemaining.toLocaleString()}</span>
                </span>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-2 block">Keywords / Keyword Phrases</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Coffee, Health, Health benefits of coffee"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-2 block">Target Audience (Optional)</Label>
              <Input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Marketing specialists / Business executives"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Upload Documents */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Documents and Web Urls</h2>
              <p className="text-gray-600">Up to 20,000 words</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">PDF, PowerPoint, JPEG, XLSX, Word</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Drag & drop files here or click to browse</p>
                <p className="text-sm text-gray-500">Supports: PDF, PPT, JPEG, XLSX, Word</p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mb-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2">
                <Checkbox id="files-primary" />
                <div>
                  <label htmlFor="files-primary" className="text-sm font-medium cursor-pointer">
                    Set these files as Primary Focus
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Example: If the PDF(s) you enter is about training, you may want to select Primary Focus to ensure
                    the training closely follows the PDF(s)
                  </p>
                </div>
              </div>
            </div>

            {/* URL Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Web URLs</Label>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="www.anyurl.com"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addUrl()
                    }
                  }}
                />
                <Button onClick={addUrl} type="button" className="flex-shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {urls.length > 0 && (
                <div className="space-y-2 mb-4">
                  {urls.map((url, index) => (
                    <div key={`url-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{url}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeUrl(index)} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2">
                <Checkbox id="urls-primary" />
                <div>
                  <label htmlFor="urls-primary" className="text-sm font-medium cursor-pointer">
                    Set these files as Primary Focus
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Example: If you want to add video to a web page, you may want to Select Primary Focus for Web URLs
                    to ensure the video closely follows the existing web page content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Choose Avatar */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Studio-Grade Avatar</h2>
              <p className="text-gray-600 mb-4">
                Pick the digital avatar who will deliver your content. Each has different voice, tone, and language.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.name}
                onClick={() => setSelectedAvatar(avatar.name)}
                className={`cursor-pointer text-center transition-all ${
                  selectedAvatar === avatar.name
                    ? "ring-4 ring-blue-600 rounded-lg"
                    : "hover:ring-2 hover:ring-gray-300 rounded-lg"
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">{avatar.name[0]}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{avatar.name}</p>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Authentic Digital Human Technology.</strong> While typical AI avatars only animate the lower face,
              our advanced 3D rendering captures every subtle movement that creates genuine human presence with
              pixel-perfect lip synchronization and consistent identity preservation that crosses the threshold from
              AI-generated to indistinguishable from human video.
            </p>
          </div>
        </Card>

        {/* Section 4: Video Options */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Choose Your Output Format</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Video Length */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Video Length</Label>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {videoLengths.map((length) => (
                  <Button
                    key={length}
                    variant={videoLength === length ? "default" : "outline"}
                    onClick={() => setVideoLength(length)}
                    className="h-10"
                  >
                    {length}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-600">30s and 1m are 4 credits, each additional minute is 3 credits</p>
            </div>

            {/* Language */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Language</Label>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    onClick={() => setLanguage(lang.code)}
                    className="w-full justify-start"
                  >
                    {lang.label}
                  </Button>
                ))}
                <Button variant="outline" className="w-full justify-start text-blue-600 bg-transparent">
                  More languages
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Position of Sticky Video</Label>
              <div className="space-y-2">
                <Button
                  variant={videoPosition === "standard" ? "default" : "outline"}
                  onClick={() => setVideoPosition("standard")}
                  className="w-full justify-start"
                >
                  Standard 400x225px - Recommended (default)
                </Button>
                <Button
                  variant={videoPosition === "compact" ? "default" : "outline"}
                  onClick={() => setVideoPosition("compact")}
                  className="w-full justify-start"
                >
                  Compact 280×158px - Minimal footprint
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Size of video</Label>
              <div className="space-y-2">
                <Button
                  variant={videoSize === "standard" ? "default" : "outline"}
                  onClick={() => setVideoSize("standard")}
                  className="w-full justify-start"
                >
                  Standard 400x225px - Recommended (default)
                </Button>
                <Button
                  variant={videoSize === "compact" ? "default" : "outline"}
                  onClick={() => setVideoSize("compact")}
                  className="w-full justify-start"
                >
                  Compact 280×158px - Minimal footprint
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 5: Additional Products */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              5
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Select Additional Products to Maximize Your Content Creation
              </h2>
              <p className="text-gray-600">
                Extend your video reach with these complementary content packages. Each product uses your video content
                to create additional marketing assets—all generated from the same inputs you have already provided.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalProducts.map((product) => (
              <Card
                key={product.title}
                className={`p-6 cursor-pointer transition-all ${
                  selectedProducts.includes(product.title) ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-lg"
                }`}
                onClick={() => toggleProduct(product.title)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                    <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                      +{product.credits} Credits
                    </Badge>
                  </div>
                  {selectedProducts.includes(product.title) && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </div>

                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                <ul className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full bg-transparent">
                  Preview
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total Credits: <span className="font-bold text-gray-900">12</span>
              </span>
              <span className="text-sm text-gray-600">
                Estimated Cost: <span className="font-bold text-gray-900">{calculateTotalCredits()} Credits</span>
              </span>
            </div>
            <Link href="/generation" className="cursor-pointer">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-12">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
