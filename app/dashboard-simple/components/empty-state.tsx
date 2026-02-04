"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[24px] border border-gray-200 py-24">
        <h2 className="mb-2 text-5xl font-medium text-[#080936]">Create My First Video</h2>
        <p className="mb-8 text-gray-500">PDFs, Word docs, and Web pages are ≈ 400 words each</p>
        <Link href="/inputs" className="cursor-pointer">
          <Button
            size="lg"
            className="rounded-xl bg-[#6D58BB] px-8 py-7 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer"
          >
            Start Creating Now <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </CardContent>
    </motion.div>
  );
}
