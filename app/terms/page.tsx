"use client";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto max-w-4xl py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-blue-50 text-[#1D4ED8] rounded-2xl flex items-center justify-center mb-6">
            <ScrollText className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-medium text-[#080936] mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Last updated: January 30, 2026</p>
        </div>
        
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-16 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">1. Services</h2>
              <p className="text-[#3E4462] leading-relaxed">
                Our platform provides AI-driven video generation services. By using our site, you agree to provide accurate information and follow our usage guidelines. We reserve the right to update these terms at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">2. Credit System</h2>
              <p className="text-[#3E4462] leading-relaxed">
                Generations are paid via credits. Credits have no cash value and are consumed the moment a generation job starts. Failed jobs due to platform errors will be automatically refunded to your balance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">3. Prohibited Use</h2>
              <p className="text-[#3E4462] leading-relaxed">
                Users are strictly prohibited from generating content that is illegal, harmful, or infringes on third-party intellectual property rights. Violation of this rule results in immediate account termination.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}