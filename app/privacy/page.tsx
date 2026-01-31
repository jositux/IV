"use client";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto max-w-4xl py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-medium text-[#080936] mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Last updated: January 30, 2026</p>
        </div>
        
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-16 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">Data Protection</h2>
              <p className="text-[#3E4462] leading-relaxed">
                Your privacy is our priority. We collect only the data necessary to provide our service: email for account management and documents for video processing. Your content is encrypted at rest and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">Cookie Policy</h2>
              <p className="text-[#3E4462] leading-relaxed">
                We use strictly necessary cookies to keep you logged in and functional cookies to improve your user experience. We do not sell your personal data to third parties or use it for targeted advertising.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">User Rights</h2>
              <p className="text-[#3E4462] leading-relaxed">
                You have the right to access, export, or delete your personal data at any time. You can manage these settings directly from your profile or by contacting our support team.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}