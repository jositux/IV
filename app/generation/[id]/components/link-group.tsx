"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileText } from "lucide-react";

export const LinkGroup = ({ links, prompt }: { links?: any[], prompt?: string }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopy = async (text: string, type: "link" | "prompt", idx?: number) => {
    await navigator.clipboard.writeText(text);
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else if (idx !== undefined) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* SECCIÓN DE LINKS (URLs) */}
      {links && links.length > 0 && (
        <div className="space-y-4">
          {links.map((link, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{link.label}</span>
              <div className="flex items-center gap-3 bg-[#F8F9FB] p-2 pl-4 rounded-xl border border-gray-100">
                <link.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <code className="text-[12px] text-gray-600 truncate flex-grow font-mono">{link.value}</code>
                <Button variant="outline" size="sm" onClick={() => handleCopy(link.value, "link", idx)} className="bg-white min-w-[100px] h-9 cursor-pointer">
                  {copiedIdx === idx ? <><Check className="w-3.5 h-3.5 text-green-500 mr-2" /> <span className="text-[10px] font-bold text-green-500">COPIED</span></> : <><Copy className="w-3.5 h-3.5 text-gray-400 mr-2" /> <span className="text-[10px] font-bold text-gray-400">COPY</span></>}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN DE TEXTO / PROMPT (Bloque elegante) */}
      {prompt && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Video Script / Content</span>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FB] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-gray-600">Final Transcript</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(prompt, "prompt")} className="h-8 bg-white min-w-[100px] border border-gray-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span className={`ml-2 text-[10px] font-bold ${copiedPrompt ? 'text-green-500' : 'text-gray-500'}`}>
                  {copiedPrompt ? "COPIED" : "COPY"}
                </span>
              </Button>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                {prompt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};