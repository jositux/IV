"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface LinkItem {
  label: string;
  value: string;
  icon: any;
}

export const LinkGroup = ({ links }: { links: LinkItem[] }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-white">
      {links.map((link, idx) => (
        <div key={idx} className="space-y-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">
            {link.label}
          </span>
          <div className="flex items-center gap-3 bg-[#F8F9FB] p-2 pl-4 rounded-xl border border-gray-100 group">
            <link.icon className="w-4 h-4 text-indigo-400 shrink-0" />
            <code className="text-[12px] text-gray-600 truncate flex-grow font-mono">
              {link.value}
            </code>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCopy(link.value, idx)}
              className="bg-white border-gray-200 hover:border-indigo-200 min-w-[100px] h-9 transition-all"
            >
              {copiedIdx === idx ? (
                <><Check className="w-3.5 h-3.5 text-green-500 mr-2" /> <span className="text-[10px] font-bold text-green-500">COPIED</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5 text-gray-400 mr-2" /> <span className="text-[10px] font-bold text-gray-400">COPY</span></>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};