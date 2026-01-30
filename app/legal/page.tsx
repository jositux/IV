"use client";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto max-w-4xl py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-medium text-[#080936] mb-4">Legal Notice</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Last updated: January 30, 2026</p>
        </div>
        
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-16 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">Company Details</h2>
              <p className="text-[#3E4462] leading-relaxed">
                <strong>AI Video Systems Ltd.</strong><br />
                Registration No: 12345678<br />
                Address: 101 Tech Plaza, Silicon District<br />
                Contact: legal@aivideo.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">Disclaimer</h2>
              <p className="text-[#3E4462] leading-relaxed">
                The information provided on this website is for general informational purposes only. While we strive for accuracy, we make no representations or warranties about the completeness or reliability of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#080936] mb-4">Jurisdiction</h2>
              <p className="text-[#3E4462] leading-relaxed">
                Any disputes arising from the use of this website shall be governed by the laws of your primary jurisdiction, without regard to its conflict of law provisions.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}