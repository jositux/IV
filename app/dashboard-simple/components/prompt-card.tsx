"use client";

import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ActivePrompt {
  projectId: string;
  title?: string;
  topic?: string;
  replicaId?: string;
}

interface PromptCardProps {
  prompt: ActivePrompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <motion.div
      key={prompt.projectId}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Card className="border-1 bg-white p-0 shadow-none border-gray-200 h-full overflow-hidden rounded-[24px]">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <img
              src={`/assets/avatars/${prompt.replicaId || "default"}.jpg`}
              className="w-full h-full object-cover object-top grayscale-[0.2]"
              alt=""
            />
            <Badge className="rounded-[20px] font-normal absolute top-2 right-2 bg-[#FFF4CA] text-[#8F3F01]">
              queued
            </Badge>
          </div>
          <div className="p-5 space-y-2">
            <h2 className="text-2xl text-[#272830] font-medium truncate">
              {prompt.title || "New Project"}
            </h2>
            <p className="text-sm text-[#272830] line-clamp-1 italic min-h-[40px] opacity-60">
              "{prompt.topic || "Processing content..."}"
            </p>
            <div className="flex items-center gap-2 pt-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-[12px] text-gray-400 font-light">Generating script...</span>
            </div>
            <div className="pt-3">
              <Button
                disabled
                className="w-full h-10 bg-[#E2F2FE] text-[#2056E0] rounded-[20px] gap-2 border-none"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Queued...
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
