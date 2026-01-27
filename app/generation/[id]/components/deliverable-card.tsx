"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
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
  defaultExpanded?: boolean;
}

export const DeliverableCard = ({ id, title, icon: Icon, html, code, links, defaultExpanded = false }: DeliverableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isCopied, setIsCopied] = useState(false);

  const contentToExport = html || code || "";

  const handleMainCopy = async () => {
    if (!contentToExport) return;
    await navigator.clipboard.writeText(contentToExport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!contentToExport) return;
    const blob = new Blob([contentToExport], { type: html ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${html ? 'html' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id={id} className="deliverable-card-container bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      {/* HEADER */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-[#080936] uppercase tracking-tight">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* BOTONES DE ACCIÓN (Copy & Download) */}
          {(html || code) && (
            <div className="flex items-center bg-gray-50 rounded-lg p-1 mr-2 border border-gray-100">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMainCopy} 
                className="h-8 px-3 text-gray-500 hover:text-indigo-600 gap-2"
                title="Copy content"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold uppercase">Copy</span>
              </Button>
              <div className="w-[1px] h-4 bg-gray-200" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload} 
                className="h-8 px-3 text-gray-500 hover:text-indigo-600 gap-2"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Download</span>
              </Button>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#080936] bg-gray-100 hover:bg-gray-200 text-[10px] font-bold gap-2 px-4 rounded-lg h-10 border border-gray-100 transition-colors"
          >
            {isExpanded ? <><ChevronUp className="w-4 h-4" /> CONTRACT</> : <><ChevronDown className="w-4 h-4" /> EXPAND</>}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="bg-white border-t border-gray-50">
              {links && <LinkGroup links={links} />}
              {html && <HTMLViewer html={html} />}
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