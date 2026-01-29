"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Play, 
  FileCode, 
  Sparkles, 
  BookOpen, 
  MonitorPlay, 
  Wrench, 
  Search, 
  ArrowLeft, 
  Loader2, 
  Target, 
  Link as LinkIcon, 
  Code,
  ArrowUp,
  Files,
  Layout,
  MousePointer2
} from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthToken } from "@/lib/get-auth-token";
import { getProjectById } from "@/services/get-project-by-id";
import { getProjectDeliverables } from "@/services/deliverables/get-deliverables-by-project-id";
import { DeliverableCard } from "./components/deliverable-card";

export default function GenerationPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [projectData, setProjectData] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("video-preview");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    document.querySelectorAll("section[id], .deliverable-card-container").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAuthToken();
        const [pRes, dRes] = await Promise.all([
          getProjectById(token!, projectId),
          getProjectDeliverables(token!, projectId)
        ]);
        if (pRes.success) { 
          setProjectData(pRes.data); 
          setVideoData(pRes.data?.videos?.[0]); 
        }
        if (dRes.success) setDeliverables(dRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  const getDeliverableContent = (type: string) => {
    const item = deliverables.find(d => d.artifactType === type);
    return item?.contentBody?.replace(/<[^>]+_(BEGIN|END)>/g, "").trim() || null;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-400 font-medium italic">Preparing your assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white">
      <AppHeader />
      
      <div className="py-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR NAVEGACIÓN (Diseño según imagen) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 space-y-4">
              <div className="mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                  <span className="font-semibold text-sm">Dashboard</span>
                </Link>
                <h1 className="text-[36px] font-bold text-[#1e2a4a] leading-tight mb-4">Your Complete Project Deliverables</h1>
                <p className="text-gray-600 text-[18px] leading-snug">
                  Everything you need to deploy and optimize your video for maximum AI search visibility
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "video-preview", icon: Play, label: "Your Video", desc: "" },
                  { id: "urls-script", icon: Files, label: "Video URLs, Embed Codes, Video Script Copy", desc: "Instant access to your video files, universal embed codes, and complete transcript for seamless deployment" },
                  { id: "geo-analysis", icon: Sparkles, label: "How Your Video Content Is Engineered for AI Search Dominance", desc: "Personalized GEO analysis of YOUR video's dominance across ChatGPT, Perplexity, Claude, Gemini & Google AI - complete breakdown of how you achieve all 8 advanced GEO optimizations" },
                  { id: "add-website", icon: BookOpen, label: "How to Add Your Sticky Video to Your Website - All Platforms", desc: "Works on WordPress, Shopify, Wix, Squarespace, Webflow, React/Vue, Custom HTML & all platforms" },
                  { id: "sticky-action", icon: MonitorPlay, label: "See Your Sticky Video in Action", desc: "" },
                  { id: "copy-sticky", icon: MousePointer2, label: "Copy your sticky video to place on your website", desc: "" },
                  { id: "seo-package", icon: Wrench, label: "GEO & SEO Optimization Package", desc: "Schema markup, meta tags & technical code to maximize AI search visibility" },
                  { id: "keyword-analysis", icon: Search, label: "Keyword Research & Content Gap Analysis", desc: "" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-xl transition-all duration-200 text-left border ${
                      activeSection === item.id 
                        ? "bg-white border-indigo-400 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <item.icon className="w-6 h-6 shrink-0 text-black mt-1" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[17px] font-semibold text-[#5c5fb1] leading-tight">{item.label}</span>
                      {item.desc && <span className="text-[14px] text-gray-500 leading-tight">{item.desc}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL (8 columnas) */}
          <main className="lg:col-span-8 space-y-12">
            
            <section id="video-preview" className="scroll-mt-10">
              <h1 className="text-2xl font-bold text-[#080936] mb-6 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                {projectData?.projectName}
              </h1>
              <div className="w-full aspect-video rounded-[32px] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div 
                  className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full border-none" 
                  dangerouslySetInnerHTML={{ __html: videoData?.metaData?.embed || "" }} 
                />
              </div>
            </section>

            <div id="urls-script" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="Direct Links & Scripts" 
                icon={FileCode} 
                links={[
                  { label: "Direct Playback URL", value: videoData?.metaData?.directPlay || "", icon: LinkIcon },
                  { label: "Embed HTML Code", value: videoData?.metaData?.embed || "", icon: Code }
                ]}
              />
            </div>

            <div id="geo-analysis" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="GEO Optimization Strategy" 
                icon={Sparkles} 
                defaultExpanded={true} 
                html={getDeliverableContent("GEO_OPTIMIZATION_REPORT_HTML")} 
              />
            </div>

            <div id="add-website" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="Customer Implementation Guide" 
                icon={BookOpen} 
                defaultExpanded={true} 
                html={getDeliverableContent("CUSTOMER_INSTRUCTIONS_HTML")} 
              />
            </div>

            <div id="sticky-action" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="Sticky Player Implementation" 
                icon={MonitorPlay} 
                code={getDeliverableContent("COMPLETE_HTML_CODE")} 
              />
            </div>

            <div id="seo-package" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="SEO Metadata Package" 
                icon={Wrench} 
                defaultExpanded={true} 
                html={getDeliverableContent("SEO_GEO_OPTIMIZATION_PACKAGE_HTML")} 
              />
            </div>

            <div id="keyword-analysis" className="deliverable-card-container scroll-mt-10">
              <DeliverableCard 
                title="Keyword Gap Analysis" 
                icon={Target} 
                defaultExpanded={true} 
                html={getDeliverableContent("KEYWORD_RESEARCH_HTML")} 
              />
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showBackTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[#080936] text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[9999] hover:bg-indigo-600 transition-colors border border-white/10"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}