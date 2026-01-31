"use client";
import { X } from "lucide-react";
import { useEffect, useMemo, memo } from "react";

interface VideoPreviewModalProps {
  videoHtml?: string;
  videoSrc?: string;
  onClose: () => void;
}

// Usamos memo para que el modal solo se renderice si las props cambian de verdad
export const VideoPreviewModal = memo(function VideoPreviewModal({ 
  videoHtml, 
  videoSrc, 
  onClose 
}: VideoPreviewModalProps) {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const optimizedHtml = useMemo(() => {
    if (!videoHtml) return "";
    // Inyectamos autoplay para que no tengas que darle play otra vez
    if (videoHtml.includes("src=")) {
      return videoHtml.replace(/src="([^"]+)"/, (match, src) => {
        const separator = src.includes("?") ? "&" : "?";
        return `src="${src}${separator}autoplay=1"`;
      });
    }
    return videoHtml;
  }, [videoHtml]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      <div className="relative z-10 w-full max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1100px]">
        {/* Contenedor del Video sin bordes extra */}
        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-none">
          
          {/* Botón de Cierre DENTRO del video - Sin líneas negras */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[130] w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all border-none outline-none"
          >
            <X className="w-6 h-6 text-white stroke-[2.5px]" />
          </button>

          {videoHtml ? (
            <div
              className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
              dangerouslySetInnerHTML={{ __html: optimizedHtml }}
            />
          ) : (
            <video
              src={videoSrc}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          )}
        </div>
      </div>
    </div>
  );
});