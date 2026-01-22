"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, Check, Download, ArrowLeft, 
  Clock, CreditCard, FileText, Code, 
  Layout, Smartphone 
} from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getAuthToken } from "@/lib/get-auth-token";
import { getListProjects, type Project } from "@/services/get-list-projects";
import { CodeBlock } from "./components/code-block";

export default function GenerationPage() {
  const params = useParams();
  const videoId = params.id as string;

  // Estados de Datos
  const [videoData, setVideoData] = useState<UserVideo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("video-preview");

  // 1. Carga de datos unificada (Video + Proyectos)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          setError("Authentication or user session missing");
          return;
        }

        const [videosResponse, projectsResponse] = await Promise.all([
          getVideosByUser(token, userStr),
          getListProjects(token),
        ]);

        if (videosResponse.success && videosResponse.data) {
          const video = videosResponse.data.find((v) => v.videoId === videoId);
          if (video) setVideoData(video);
          else setError("Video not found");
        }

        if (projectsResponse.success) {
          setProjects(projectsResponse.data);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) loadData();
  }, [videoId]);

  // 2. Utilidad para nombre de proyecto
  const getProjectName = (projectId: string | null): string => {
    if (!projectId) return "Untitled Project";
    const project = projects.find((p) => p.projectId === projectId);
    return project?.projectName || "Project";
  };

  // 3. Observer para el Scroll (Activa items de la sidebar)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["video-preview", "script", "direct-play", "embed", "sticky-geo", "deliverables"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedItems((prev) => [...prev, id]);
    setTimeout(() => setCopiedItems((prev) => prev.filter((item) => item !== id)), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarNavItems = [
    { id: "video-preview", label: "Video Preview", icon: Layout },
    { id: "script", label: "Video Script", icon: FileText },
    { id: "direct-play", label: "Direct Play URL", icon: Smartphone },
    { id: "embed", label: "Embed Code", icon: Code },
    { id: "sticky-geo", label: "Sticky Video (GEO)", icon: Layout },
    { id: "deliverables", label: "All Deliverables", icon: Download },
  ];

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !videoData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-destructive font-medium">{error || "Data not found"}</p>
      <Link href="/dashboard"><Button variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-[#F8F9FB]">
      <AppHeader />

      <div className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR (33% - col-span-4) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 space-y-8">
              {/* Navegación de retorno */}
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>

              {/* Menú de Entregables */}
              <div className="bg-white p-2 rounded-[24px] border border-gray-200 shadow-sm">
                <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation</h3>
                <nav className="space-y-1">
                  {sidebarNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-[#080936] text-white shadow-md"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Card de Stats (Status, Duración, Créditos) */}
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                   <span className="text-sm text-gray-500">Video Status</span>
                   <Badge className={videoData.status === "completed" ? "bg-green-500" : "bg-amber-500"}>
                     {videoData.status}
                   </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">{videoData.duration || 0}s</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">{videoData.creditsCharged || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL (66% - col-span-8) */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* Header del Proyecto */}
            <div className="space-y-2">
              <h1 className="text-4xl font-light text-gray-400 leading-tight">
                Project: <span className="font-bold text-[#080936]">{getProjectName(videoData.projectId)}</span>
              </h1>
              <p className="text-gray-500">Access all your GEO-Optimized assets for this generation.</p>
            </div>

            {/* Video Preview */}
            <section id="video-preview" className="scroll-mt-24">
              <div className="rounded-[32px] overflow-hidden border-8 border-white shadow-2xl bg-black aspect-video relative">
                <div
                  dangerouslySetInnerHTML={{ __html: videoData.embed || "" }}
                  className="absolute inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
                />
              </div>
            </section>

            {/* Video Script */}
            <section id="script" className="scroll-mt-24 space-y-6">
              <h2 className="text-2xl font-bold text-[#080936]">Video Script</h2>
              <div className="rounded-[24px] border bg-white p-8 shadow-sm">
                <p className="text-lg leading-relaxed text-gray-600 italic font-serif">
                  "{videoData.prompt?.replace(/<[^>]*>?/gm, "")}"
                </p>
              </div>
            </section>

            {/* Direct Play URL */}
            <section id="direct-play" className="scroll-mt-24 space-y-6">
              <h2 className="text-2xl font-bold text-[#080936]">Direct Play URL</h2>
              <div className="rounded-[24px] border bg-white p-8 shadow-sm">
                <p className="text-sm text-gray-500 mb-4">Perfect for direct sharing or linking in emails and social media.</p>
                <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm break-all mb-6 border border-gray-100">
                  {videoData.directPlay || videoData.tavusUrl}
                </div>
                <Button 
                  className="rounded-full px-8"
                  onClick={() => handleCopy(videoData.directPlay || videoData.tavusUrl || "", "direct-play")}
                >
                  {copiedItems.includes("direct-play") ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copiedItems.includes("direct-play") ? "Copied" : "Copy URL"}
                </Button>
              </div>
            </section>

            {/* Embed Code */}
            <section id="embed" className="scroll-mt-24 space-y-6">
              <h2 className="text-2xl font-bold text-[#080936]">Standard Embed Code</h2>
              <CodeBlock code={videoData.embed || ""} filename="embed.html" language="html" />
            </section>

            {/* Sticky GEO Video */}
            <section id="sticky-geo" className="scroll-mt-24 space-y-6">
              <h2 className="text-2xl font-bold text-[#080936]">Sticky Video (GEO Optimized)</h2>
              <div className="space-y-6">
                <p className="text-gray-500">This implementation ensures maximum visibility by staying active while users browse your content.</p>
                <CodeBlock code={videoData.embed || ""} filename="sticky-geo.html" language="html" />
                <div className="grid grid-cols-2 gap-4">
                  {["WordPress", "Shopify", "Webflow", "Squarespace"].map(plat => (
                    <div key={plat} className="p-4 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600">
                      • {plat} Ready
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* All Deliverables */}
            <section id="deliverables" className="scroll-mt-24 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-[#080936]">Project Artifacts</h2>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-blue-200 text-blue-700">7 Files Total</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File MP4 */}
                <div className="p-6 bg-white border border-gray-200 rounded-[24px] shadow-sm hover:border-blue-300 transition-colors">
                  <h4 className="font-bold mb-1">Video Asset</h4>
                  <p className="text-xs text-gray-400 mb-4 uppercase">MP4 Format</p>
                  <a href={videoData.directPlay || videoData.tavusUrl} target="_blank" className="block">
                    <Button variant="outline" className="w-full rounded-full"><Download className="mr-2 w-4 h-4" /> Download MP4</Button>
                  </a>
                </div>

                {/* Thumbnail */}
                <div className="p-6 bg-white border border-gray-200 rounded-[24px] shadow-sm">
                  <h4 className="font-bold mb-1">Main Thumbnail</h4>
                  <p className="text-xs text-gray-400 mb-4 uppercase">JPG Format</p>
                  {videoData.thumbnailURL && (
                    <img src={videoData.thumbnailURL} alt="Thumb" className="rounded-lg mb-4 h-24 w-full object-cover" />
                  )}
                 
                    <Button variant="outline" className="w-full rounded-full"><Download className="mr-2 w-4 h-4" /> Download Image</Button>
                 
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}