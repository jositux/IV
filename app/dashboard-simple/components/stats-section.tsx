"use client";

import { Video, FileText, Monitor, CreditCard, Type as type, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsSectionProps {
  totalCompletedCount: number;
  projectedBalance: number | null;
}

export function StatsSection({ totalCompletedCount, projectedBalance }: StatsSectionProps) {
  const stats: StatItem[] = [
    { label: "Total videos", value: totalCompletedCount, icon: Video },
    { label: "Available Credits", value: projectedBalance ?? 0, icon: CreditCard },
    { label: "Deliverables", value: totalCompletedCount * 5, icon: FileText },
    { label: "Landing Pages", value: 0, icon: Monitor },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-1 bg-white shadow-none border-gray-200 rounded-[24px]">
            <CardContent className="px-6 flex flex-col justify-center">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-[#080936]" />
              </div>
              <p className="text-4xl font-regular text-[#080936]">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
