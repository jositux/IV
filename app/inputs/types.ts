import type { Replica } from "@/services/video/video-replicas"

export interface VideoCreatorState {
  replicas: Replica[]
  loadingReplicas: boolean
  files: File[]
  urls: string[]
  newUrl: string
  selectedReplica: string
  videoLength: string
  language: string
  selectedProducts: string[]
  videoPosition: string
  videoSize: string
  primaryFocus: "files" | "urls"
  topic: string
  keywords: string
  targetAudience: string
  generating: boolean
  prompting: boolean
  error: string
  success: string
  previewVideo: string | null
  previewReplicaName: string
  generatedScript: string
  scriptId: string
  projectName: string
  projectId: string
  projectError: string
  checkingProject: boolean
  trainingType: string
  customAudience: string
  customAudienceOptions: string[]
}

export const VIDEO_LENGTHS = [
  "30s",
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",
  "7m",
  "8m",
  "9m",
  "10m",
]

export const LANGUAGES = [
  { code: "english", label: "US English" },
  { code: "spanish", label: "Es Spanish" },
  { code: "french", label: "Fr French" },
  { code: "chinese", label: "Ch Chinese" },
  { code: "german", label: "De German" },
]

export const ADDITIONAL_PRODUCTS = [
  {
    title: "Long-Form Article",
    credits: 15,
    description:
      "Transform your video content into comprehensive written articles.",
    features: ["GEO Optimized", "Auto-Generated Images", "SEO & Schema Markup"],
  },
  {
    title: "Video Landing Page",
    credits: 8,
    description: "Professional landing page with GEO optimization.",
    features: ["GEO Optimized", "341% Higher Conversion", "Mobile Optimized"],
  },
  {
    title: "Omni-Channel Suite",
    credits: 10,
    description: "Complete communication package across all channels.",
    features: ["PowerPoint", "LinkedIn & X Posts", "Email Templates"],
  },
]

export const AUDIENCE_OPTIONS = [
  "Compliance & Safety",
  "Sales Enablement",
  "Employee Orientation",
  "Marketing & Product",
  "Learning & Development",
  "Internal Communications",
  "Customer Service",
]

export const MAX_WORDS = 20000
