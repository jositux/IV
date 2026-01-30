"use client";
import { useState } from "react";
import { 
  Search, Book, PlayCircle, CreditCard, ShieldCheck, 
  ChevronRight, MessageSquare, ExternalLink, LifeBuoy 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { title: "Getting Started", icon: PlayCircle, articles: "5 articles", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Billing & Plans", icon: CreditCard, articles: "3 articles", color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Video Creation", icon: Book, articles: "8 articles", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Security & Privacy", icon: ShieldCheck, articles: "4 articles", color: "text-green-600", bg: "bg-green-50" },
  ];

  const faqs = [
    {
      q: "How do credits work?",
      a: "Each video generation consumes credits based on the duration. 1 second of video equals 1 credit. You can track your balance directly in the Dashboard."
    },
    {
      q: "Which document formats are supported?",
      a: "Currently, you can upload PDF, Word (.docx), and TXT files. You can also provide URLs from most public websites for content extraction."
    },
    {
      q: "Can I change my avatar after generation?",
      a: "Once a video is processed, the avatar is permanent for that specific file. However, you can 'Rebuild' or create a new project with a different avatar using the same input data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      
      <main className="mx-auto max-w-6xl py-16">
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-medium text-[#080936] mb-6">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search for articles, guides..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl border-none bg-white pl-12 shadow-sm text-lg focus-visible:ring-[#6D58BB]" 
            />
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {categories.map((cat) => (
            <Card key={cat.title} className="border-none shadow-none hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${cat.bg} ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#080936] mb-1">{cat.title}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  {cat.articles} <ChevronRight className="w-3 h-3 ml-1" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ SECTION */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#080936] mb-6 flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-[#6D58BB]" /> Common Questions
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border-none px-6">
                  <AccordionTrigger className="hover:no-underline font-semibold text-[#080936] text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CONTACT SIDEBAR */}
          <div className="space-y-6">
            <Card className="border-none bg-[#080936] text-white overflow-hidden relative">
              <CardContent className="p-8">
                <MessageSquare className="w-10 h-10 mb-4 text-[#6D58BB]" />
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="text-blue-100/70 text-sm mb-6">Our support team is available Mon-Fri, 9am - 6pm EST.</p>
                <Button className="w-full bg-[#6D58BB] hover:bg-white hover:text-[#080936] transition-colors rounded-xl">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none bg-white">
              <CardContent className="p-6">
                <h4 className="font-bold text-[#080936] mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  {['API Documentation', 'Community Forum', 'Video Tutorials', 'System Status'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-600 hover:text-[#6D58BB] flex items-center justify-between group">
                        {link} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}