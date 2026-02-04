"use client";

import React from "react"

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPreviewModalProps {
  videoHtml?: string;
  onClose: () => void;
}

export function VideoPreviewModal({ videoHtml, onClose }: VideoPreviewModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl mx-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar video</span>
          </Button>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
            {videoHtml ? (
              <div
                className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full"
                dangerouslySetInnerHTML={{ __html: videoHtml }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No hay video disponible
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
