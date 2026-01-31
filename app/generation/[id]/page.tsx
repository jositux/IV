"use client";
import { useState, useEffect, useCallback } from "react";
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
  MousePointer2,
  RefreshCw,
  Download // Nuevo icono
} from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthToken } from "@/lib/get-auth-token";
import { getProjectById } from "@/services/get-project-by-id";
import { getProjectDeliverables } from "@/services/deliverables/get-deliverables-by-project-id";
import { DeliverableCard } from "./components/deliverable-card";
import { useGeneration } from "@/context/generation-context";
import JSZip from "jszip"; // Importante para la descarga

const REQUIRED_TYPES = [
  "GEO_OPTIMIZATION_REPORT_HTML",
  "CUSTOMER_INSTRUCTIONS_HTML",
  "COMPLETE_HTML_CODE",
  "SEO_GEO_OPTIMIZATION_PACKAGE_HTML",
  "KEYWORD_RESEARCH_HTML"
];

export default function GenerationPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { projects } = useGeneration();
  const activeProject = projects[projectId];

  const [projectData, setProjectData] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // Estado para la descarga
  const [activeSection, setActiveSection] = useState("video-preview");
  const [showBackTop, setShowBackTop] = useState(false);

  // Lógica para saber si todo está listo
  const isAllReady = REQUIRED_TYPES.every(type => 
    deliverables.some(d => d.artifactType === type)
  );

  const refreshDeliverables = useCallback(async () => {
    try {
      const token = await getAuthToken();
      const dRes = await getProjectDeliverables(token!, projectId);
      if (dRes.success) setDeliverables(dRes.data);
    } catch (error) {
      console.error("Error refreshing deliverables:", error);
    }
  }, [projectId]);

  // Función de descarga ZIP
  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${projectData?.projectName || "project"}-assets`);

      deliverables.forEach((item) => {
        const fileName = `${item.artifactType.toLowerCase()}.html`;
        const content = item.contentBody?.replace(/<[^>]+_(BEGIN|END)>/g, "").trim() || "";
        folder?.file(fileName, content);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectData?.projectName || "project"}_all_assets.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 400);
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

  useEffect(() => {
    if (activeProject?.completedDeliverables?.length) {
      refreshDeliverables();
    }
  }, [activeProject?.completedDeliverables?.length, refreshDeliverables]);

  const getDeliverableContent = (type: string) => {
    const item = deliverables.find(d => d.artifactType === type);
    return item?.contentBody?.replace(/<[^>]+_(BEGIN|END)>/g, "").trim() || null;
  };

  const isAssetReady = (type: string) => deliverables.some(d => d.artifactType === type);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const LoadingAsset = ({ title }: { title: string }) => (
    <div className="w-full bg-white border border-dashed border-indigo-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
      <h3 className="text-lg font-medium text-[#080936]">Generating {title}...</h3>
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-white">
      <AppHeader />
      
      <div className="py-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-4">
            <div className="sticky top-10 space-y-4">
              
              {/* HEADER DEL SIDEBAR CON BOTÓN DE DESCARGA */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group cursor-pointer">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                    <span className="font-semibold text-sm text-[#6D58BB]">Dashboard</span>
                  </Link>

                  {/* BOTÓN DE DESCARGA AL LADO DEL LINK */}
                  <AnimatePresence>
                    {isAllReady && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleDownloadAll}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-indigo-50 text-[#6D58BB] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all border border-1 border-[#6D58BB] cursor-pointer"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        DOWNLOAD ALL (.ZIP)
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <h1 className="text-[24px] font-semibold text-[#1e2a4a] leading-tight mb-0">Your Complete Project Deliverables</h1>
                <p className="text-gray-600 text-[16px] leading-snug mt-2">
                  Everything you need to deploy and optimize your video for maximum AI search visibility
                </p>
              </div>

              {/* Sidebar Navigation */}
              <div className="space-y-3">
                {[
                  { id: "video-preview", icon: Play, label: "Your Video", desc: "" },
                  { id: "urls-script", icon: Files, label: "Video URLs, Embed Codes, Video Script Copy", desc: "Instant access to your video files, universal embed codes, and complete transcript for seamless deployment" },
                  { id: "geo-analysis", icon: Sparkles, label: "How Your Video Content Is Engineered for Al Search Dominance", desc: "Personalized GEO analysis of YOUR video's dominance across ChatGPT, Perplexity, Claude, Gemini & Google AI - complete breakdown of how you achieve all 8 advanced GEO optimizations" },
                  { id: "add-website", icon: BookOpen, label: "How to Add Your Sticky Video to Your Website - All Platforms", desc: "Works on WordPress, Shopify, Wix, Squarespace, Webflow, React/Vue, Custom HTML & all platforms" },
                  { id: "sticky-action", icon: MonitorPlay, label: "See Your Sticky Video in Action", desc: "" },
                  { id: "seo-package", icon: Wrench, label: "GEO & SEO Optimization Package", desc: "Schema markup, meta tags & technical code to maximize AI search visibility" },
                  { id: "keyword-analysis", icon: Search, label: "Keyword Research & Content Gap Analysis", desc: "" },
                ].map((item) => (
                  <button
  key={item.id}
  onClick={() => scrollToSection(item.id)}
  className={`w-full flex items-start gap-4 p-3 rounded-xl transition-all duration-200 text-left border cursor-pointer ${
    activeSection === item.id
      ? "bg-white border-indigo-400 shadow-sm"
      : "bg-white border-gray-100 hover:border-gray-200"
  }`}
>
  {/* Icono arriba */}
  <item.icon
    className={`w-6 h-6 shrink-0 mt-1 ${
      activeSection === item.id ? "text-[#6D58BB]" : "text-black"
    }`}
  />

  {/* Texto centrado vertical */}
  <div className="flex flex-col gap-1 self-stretch justify-center">
    <span className="text-[15px] font-regular text-[#6D58BB] leading-tight">
      {item.label}
    </span>

    {item.desc && (
      <span className="text-[12px] text-gray-500 leading-tight">
        {item.desc}
      </span>
    )}
  </div>
</button>

                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-12">
            <section id="video-preview" className="scroll-mt-10">
              <h1 className="text-3xl font-regular text-[#080936] mb-6 flex items-center gap-3 tracking-tight">
               
                <span className="text-sm">Your Project:</span>{projectData?.projectName}
              </h1>
              <div className="w-full aspect-video rounded-[8px] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
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
              {isAssetReady("GEO_OPTIMIZATION_REPORT_HTML") ? (
                <DeliverableCard title="GEO Optimization Strategy" icon={Sparkles} defaultExpanded={true} html={getDeliverableContent("GEO_OPTIMIZATION_REPORT_HTML")} />
              ) : (
                <LoadingAsset title="GEO Optimization Report" />
              )}
            </div>

            <div id="add-website" className="deliverable-card-container scroll-mt-10">
              {isAssetReady("CUSTOMER_INSTRUCTIONS_HTML") ? (
                <DeliverableCard title="Customer Implementation Guide" icon={BookOpen} defaultExpanded={true} html={getDeliverableContent("CUSTOMER_INSTRUCTIONS_HTML")} />
              ) : (
                <LoadingAsset title="Implementation Guide" />
              )}
            </div>

            <div id="sticky-action" className="deliverable-card-container scroll-mt-10">
              {isAssetReady("COMPLETE_HTML_CODE") ? (
                <DeliverableCard title="Sticky Player Implementation" icon={MonitorPlay} code={getDeliverableContent("COMPLETE_HTML_CODE")} />
              ) : (
                <LoadingAsset title="Sticky Player Code" />
              )}
            </div>

            <div id="seo-package" className="deliverable-card-container scroll-mt-10">
              {isAssetReady("SEO_GEO_OPTIMIZATION_PACKAGE_HTML") ? (
                <DeliverableCard title="SEO Metadata Package" icon={Wrench} defaultExpanded={true} html={getDeliverableContent("SEO_GEO_OPTIMIZATION_PACKAGE_HTML")} />
              ) : (
                <LoadingAsset title="SEO Metadata" />
              )}
            </div>

            <div id="keyword-analysis" className="deliverable-card-container scroll-mt-10">
              {isAssetReady("KEYWORD_RESEARCH_HTML") ? (
                <DeliverableCard title="Keyword Gap Analysis" icon={Target} defaultExpanded={true} html={getDeliverableContent("KEYWORD_RESEARCH_HTML")} />
              ) : (
                <LoadingAsset title="Keyword Gap Analysis" />
              )}
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showBackTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[#080936] text-white rounded-full flex items-center justify-center shadow-xl z-[9999] cursor-pointer"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}