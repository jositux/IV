"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function NoResultsState({ searchQuery, onClearSearch }: NoResultsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-[#080936]">No results for "{searchQuery}"</h3>
      <p className="text-gray-500 mt-2">Try checking the spelling or using different keywords.</p>
      <Button
        variant="link"
        onClick={onClearSearch}
        className="mt-4 text-[#6D58BB] font-semibold cursor-pointer"
      >
        Clear search
      </Button>
    </motion.div>
  );
}
