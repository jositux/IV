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
  Code 
} from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { getAuthToken } from "@/lib/get-auth-token";
import { getProjectById, type ProjectDetail, type ProjectVideo } from "@/services/get-project-by-id";
import { getProjectDeliverables, type ProjectArtifact } from "@/services/deliverables/get-deliverables-by-project-id";
import { DeliverableCard } from "./components/deliverable-card";

export default function GenerationPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [projectData, setProjectData] = useState<ProjectDetail | null>(null);
  const [videoData, setVideoData] = useState<ProjectVideo | null>(null);
  const [deliverables, setDeliverables] = useState<ProjectArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("video-preview");

  // --- LÓGICA DE SCROLL SPY ---
  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Precisión para iluminar el menú
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    // Observamos tanto secciones como las tarjetas de entregables
    const targets = document.querySelectorAll("section[id], div[id].deliverable-card-container");
    targets.forEach((target) => observer.observe(target));

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
          setVideoData(pRes.data?.videos?.[0] || null); 
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
    <div className="min-h-screen p-4 bg-[#F8F9FB]">
      <AppHeader />
      
      <div className="py-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR NAVEGACIÓN */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 space-y-6">
              <div>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                  <span className="font-semibold text-sm">Dashboard</span>
                </Link>
                <h2 className="text-[28px] font-bold text-[#1a2b4b] leading-tight mb-2">Project Assets</h2>
                <p className="text-gray-500 text-sm">Review and implement your generated content.</p>
              </div>

              <div className="space-y-2">
                {[
                  { id: "video-preview", icon: Play, label: "Main Video" },
                  { id: "urls-script", icon: FileCode, label: "Links & Embeds" },
                  { id: "geo-analysis", icon: Sparkles, label: "GEO Strategy" },
                  { id: "add-website", icon: BookOpen, label: "Guide & Steps" },
                  { id: "sticky-action", icon: MonitorPlay, label: "Sticky Player" },
                  { id: "seo-package", icon: Wrench, label: "SEO Metadata" },
                  { id: "keyword-analysis", icon: Search, label: "Keyword Research" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
                      activeSection === item.id 
                        ? "bg-[#080936] text-white shadow-xl scale-[1.02]" 
                        : "bg-white border border-gray-100 text-[#5b4fd7] hover:border-indigo-200"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${activeSection === item.id ? "text-white" : "text-indigo-500"}`} />
                    <span className="text-[15px] font-bold tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* VIDEO SECTION */}
            <section id="video-preview" className="scroll-mt-10">
              <h1 className="text-2xl font-bold text-[#080936] mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                {projectData?.projectName}
              </h1>
              <div className="aspect-video rounded-[32px] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div 
                  className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" 
                  dangerouslySetInnerHTML={{ __html: videoData?.metaData?.embed || "" }} 
                />
              </div>
            </section>

            {/* ENTREGABLES MODULARES */}
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
    </div>
  );
}