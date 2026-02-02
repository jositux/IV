"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, Plus, Minus } from "lucide-react";
import { HTMLViewer } from "./html-viewer";
import { LinkGroup } from "./link-group";
import { motion, AnimatePresence } from "framer-motion";

interface DeliverableCardProps {
  id?: string;
  title: string;
  icon: any;
  html?: string | null;
  code?: string | null;
  links?: any[];
  prompt?: string; // Nuevo: El texto del script o prompt
  defaultExpanded?: boolean;
}

export const DeliverableCard = ({ 
  id, 
  title, 
  icon: Icon, 
  html, 
  code, 
  links, 
  prompt, 
  defaultExpanded = false 
}: DeliverableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isCopied, setIsCopied] = useState(false);

  // El contenido principal para exportar/descargar prioriza HTML, luego Code, luego Prompt
  const contentToExport = html || code || prompt || "";

  const handleMainCopy = async () => {
    if (!contentToExport) return;
    await navigator.clipboard.writeText(contentToExport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!contentToExport) return;
    const isHtml = !!html;
    const blob = new Blob([contentToExport], { type: isHtml ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${isHtml ? 'html' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id={id} className="deliverable-card-container bg-white rounded-[14px] border border-gray-100 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      {/* HEADER */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-[#080936] uppercase tracking-tight">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* BOTONES DE ACCIÓN RÁPIDA (Copy/Download del contenido principal) */}
          {contentToExport && (
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMainCopy} 
                className={`h-9 px-4 rounded-lg gap-2 cursor-pointer transition-all duration-300 ${
                  isCopied 
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                  : "text-gray-500 hover:text-indigo-600 hover:bg-white"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Copy</span>
                  </>
                )}
              </Button>

              <div className="w-[1px] h-4 bg-gray-200 mx-1" />

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload} 
                className="h-9 px-4 text-gray-500 hover:text-indigo-600 hover:bg-white cursor-pointer rounded-lg gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Download</span>
              </Button>
            </div>
          )}
          
          {/* BOTÓN COLAPSO DINÁMICO */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`h-10 w-10 rounded-3xl border border-gray-100 cursor-pointer transition-all duration-300 ${
              isExpanded 
              ? "bg-[#080936] text-white hover:bg-[#15175a]" 
              : "bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-100"
            }`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </motion.div>
          </Button>
        </div>
      </div>

      {/* CUERPO ANIMADO */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="bg-white border-t border-gray-50">
              {/* Sección de Links y/o Texto (Prompt) */}
              {(links || prompt) && <LinkGroup links={links} prompt={prompt} />}
              
              {/* Sección de Visualización HTML (si aplica) */}
              {html && <HTMLViewer html={html} />}

              {/* Sección de Bloque de Código (si aplica) */}
              {code && (
                <div className="p-6 bg-[#Fcfdff]">
                  <pre className="bg-[#080936] text-blue-50 p-6 rounded-2xl text-[12px] overflow-x-auto font-mono leading-relaxed border border-[#1a2b4b] shadow-inner">
                    <code>{code}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};