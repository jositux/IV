"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardHeaderProps {
  showCreateButton: boolean;
}

export function DashboardHeader({ showCreateButton }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-5xl font-medium text-[#080936]">Dashboard</h1>
      {showCreateButton && (
        <Link href="/inputs" className="cursor-pointer">
          <Button
            size="lg"
            className="rounded-xl bg-[#6D58BB] px-6 py-6 text-xl font-normal text-white hover:bg-[#080936] cursor-pointer"
          >
            <Plus className="mr-2 h-5 w-5" /> Create new project
          </Button>
        </Link>
      )}
    </div>
  );
}
