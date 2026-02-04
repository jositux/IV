"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export function CreateProjectCard() {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link href="/inputs" className="h-full block group cursor-pointer">
        <Card className="border-2 border-dashed border-gray-200 bg-transparent h-full min-h-[380px] flex flex-col items-center justify-center p-8 transition-all hover:border-[#6D58BB] hover:bg-white rounded-[24px]">
          <div className="rounded-full bg-gray-100 p-4 mb-4 group-hover:bg-[#E2F2FE] transition-colors">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-[#6D58BB]" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 group-hover:text-[#6D58BB]">
            Create new project
          </h3>
          <p className="text-sm text-gray-500 text-center mt-2">
            Scale your reach with another high-converting video
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}
