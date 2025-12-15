"use client";

import type React from "react";
import styles from "./home.module.css";
import Image from "next/image";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { VideoPopup } from "@/components/video-popup";
import {
  Play,
  Percent,
  BookOpen,
  Heart,
  Monitor,
  FileText,
  ShoppingBag,
  Check,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`fade-in-up ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function VideoLandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className={`${styles.homeContainer} min-w-full p-4`}>
      <div className={`${styles.hero} rounded-[20px] overflow-hidden`}>
        {/* Header */}
        <header className="text-white py-8 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logoiv.svg"
                alt="Logo"
                layout="responsive"
                width={4}
                height={3}
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#how-it-works"
                className="hover:text-purple-400 transition"
              >
                How it Works
              </a>
              <a href="#pricing" className="hover:text-purple-400 transition">
                Pricing
              </a>
              <a href="#cases" className="hover:text-purple-400 transition">
                Learn Cases
              </a>
              <a href="#" className="hover:text-purple-400 transition">
                Login / Sign Up
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative text-white pt-20 pb-30 px-6 overflow-hidden">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="z-10 fade-in-up">
                <p className="text-[#2FAEF9] text-sm mb-4 uppercase tracking-wide">
                  Artificial General Intelligence Reasoning Model
                </p>
                <h1 className={`${styles.heroText} text-6xl mb-8 font-medium`}>
                  From Concept to
                  <br /> Professional Video
                  <br /> in Minutes
                </h1>
                <p className="text-lg text-[#C9EBFF] mb-8 font-medium">
                  Step into the future of AGI content creation Broadcast-ready
                  videos, GEO-Optimized articles, social media posts, emails &
                  PPTs Experience writing that transcends human limitations
                </p>
                <Button
                  size="lg"
                  className="bg-[#6D58BB] cursor-pointer text-white px-8"
                  onClick={() => setIsVideoOpen(true)}
                >
                  Start Creating Now →
                </Button>
              </div>

              {/* Hero Image with Video Trigger */}
              <div className="relative z-10 fade-in-up animate-delay-300">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="/video-girl.png"
                      alt="Imagen del post"
                      layout="responsive"
                      width={4}
                      height={3}
                    />

                    <div className="absolute mt-18 inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center group-hover:scale-120  group-hover:bg-white transition">
                        <Play className="w-10 h-10 text-[#6D58BB] ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-6"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-12 items-start">
            {/* LEFT COLUMN */}
            <AnimatedSection className="max-w-xl">
              <h2 className="text-5xl font-bold mb-4">How it Works</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Three Simple Steps to AGI-Level Videos
              </p>

              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                Start Creating Now →
              </Button>

              <p className="text-sm text-muted-foreground mt-3">
                2-minute setup → Professional results instantly
              </p>
            </AnimatedSection>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {/* Step 1 */}
              <AnimatedSection delay={100}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl font-extrabold text-purple-600 mb-4">
                      1.
                    </div>
                    <h3 className="text-xl font-bold mb-3">Add Your Inputs</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload a PDF, paste a URL, enter keywords...
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Simple Inputs Include
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• PDFs or URLs</li>
                        <li>• Upload your own media</li>
                        <li>• Select preferred avatar</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 2 */}
              <AnimatedSection delay={200}>
                <Card>
                  <CardContent className="pt-6">
                    {/* Número y título */}
                    <div className="flex items-start gap-4">
                      <div className="text-5xl md:text-6xl font-extrabold text-purple-600 leading-none">
                        2.
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">
                          AGI Crafts Your Video Script
                        </h3>

                        {/* Bloque a dos columnas: descripción izquierda / lista derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-muted-foreground mb-6 max-w-md">
                              Our advanced reasoning model crafts “More Human
                              Than Human” scripts and discovers insights you
                              haven’t thought of — no writing required from you.
                            </p>
                          </div>{" "}
                          {/* Espacio vacío para alinear igual que en el diseño */}
                          <div>
                            <h4 className="font-semibold mb-2">
                              What We Generate
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Professional video scripts</li>
                              <li>• Natural avatar presentations</li>
                              <li>• Multi-language support (30+ languages)</li>
                              <li>• GEO-optimized content</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 3 */}
              <AnimatedSection delay={300}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl font-extrabold text-purple-600 mb-4">
                      3.
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      Receive Your Video Package
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get your professional video + embed code…
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Included Products</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• MP4 video</li>
                        <li>• Social-ready formats</li>
                        <li>• SRT + transcripts</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Videos in Action Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">
              See AGI-Powered Videos in Action
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Real companies are using IntelligentVideos to transformionaries
              training with DigiHuman Avatars – without the spend.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection delay={100}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition group">
                <h2 className="text-4xl font-bold mb-4">
                  See AGI-Powered Videos in Action
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Real companies are using IntelligentVideos to
                  transformionaries training with DigiHuman Avatars – without
                  the spend.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition group">
                <div className="relative h-64 bg-gradient-to-br from-purple-300 to-purple-500 overflow-hidden">
                  <img
                    src="/happy-professional-woman-on-laptop-with-purple-lig.jpg"
                    alt="Video example"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition group">
                <div className="relative h-48 bg-gradient-to-br from-orange-300 to-orange-500 overflow-hidden">
                  <img
                    src="/person-in-yellow-jacket-with-coffee-outdoors.jpg"
                    alt="Video example"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">
                    Welcome New Hires Like They're Already Part of the Family
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Deliver personalized new-hire experiences that start them
                    from day one.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition group">
                <div className="relative h-48 bg-gradient-to-br from-blue-300 to-blue-500 overflow-hidden">
                  <img
                    src="/professional-presenting-with-screen-behind.jpg"
                    alt="Video example"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">
                    Make Mandatory Training Actually Matter
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Transform boring compliance into engaging videos employees
                    actually complete.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition group">
                <div className="relative h-48 bg-gradient-to-br from-green-300 to-green-500 overflow-hidden">
                  <img
                    src="/outdoor-business-discussion.jpg"
                    alt="Video example"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">
                    Cut Through the Noise, Unlike Your Competition
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Messages that employees actually watch, understand, and
                    remember.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={500}>
              <Card className="border-2 border-dashed flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-2 border-purple-600 rounded-lg flex items-center justify-center">
                    <Play className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <Card className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Sales Enablement</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Equip sales teams with AI-generated objection demos and
                    quick-turn assets.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See Sales Video Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section
        id="cases"
        className="py-20 px-6"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection delay={100}>
              <Card>
                <CardContent className="pt-6">
                  <Percent className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">
                    Marketing & Product
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Launch videos that get AI-scalable solutions compared to
                    traditional videography.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See Marketing Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card>
                <CardContent className="pt-6">
                  <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">
                    Learning & Development
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Turn complicated, dull or manual training into engaging
                    training videos.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See L&D Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <Card>
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">
                    Customer Service Training
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drive happier teams with high-quality service training from
                    your existing best teams.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See Service Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <Card>
                <CardContent className="pt-6">
                  <Monitor className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">
                    Add Video to Web Pages
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Increase time-on-page by 400% with video hosted technology.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See Web Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={500}>
              <Card>
                <CardContent className="pt-6">
                  <FileText className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">
                    Transform Documents to Videos
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Turn PDFs, PowerPoints, or documents into engaging video
                    content.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 text-sm font-semibold hover:underline"
                  >
                    See Document Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <Card className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-2xl mb-4">
                    Ready to Transform Your Content?
                  </h3>
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">
                    Create a Video →
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`${styles.priceContainer} rounded-[20px] py-20 px-6 text-white`}
      >
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Simple. Transparent pricing
            </h2>
            <p className="text-purple-200 text-lg">
              All plans include access to our AGI-powered platform and all
              features.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Creator Plan */}
            <AnimatedSection>
              <Card className="bg-purple-900/40 backdrop-blur border-purple-500/30 text-white relative">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold mb-2">
                    Creator
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-sm leading-relaxed">
                    Perfect for individuals and small businesses getting started
                    with professional video content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-gray-400 line-through text-xl mr-2">
                      $59
                    </span>
                    <span className="text-5xl font-bold">$50</span>
                    <span className="text-purple-200 text-lg">/month</span>
                  </div>
                  <p className="text-sm text-purple-200 mb-6">
                    Billed annually at $600/year
                  </p>

                  {/* Credits Box */}
                  <div className="bg-gray-900/80 rounded-lg p-6 mb-6 text-center">
                    <div className="text-5xl font-bold mb-2">60</div>
                    <div className="text-sm text-gray-300 uppercase tracking-wide">
                      Credits per month
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        All platform features included
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        Professional avatars in 30+ languages
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        AGI-powered Video Script generation
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        Video Landing Pages & Long-form Articles
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        GEO Optimization for AI search
                      </span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold">
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Studio Plan */}
            <AnimatedSection>
              <Card className="bg-purple-900/40 backdrop-blur border-purple-500/30 text-white relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold">
                  Most Popular
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-2xl font-semibold mb-2">
                    Studio
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-sm leading-relaxed">
                    For growing businesses and teams that need more content and
                    personalization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-gray-400 line-through text-xl mr-2">
                      $129
                    </span>
                    <span className="text-5xl font-bold">$116</span>
                    <span className="text-purple-200 text-lg">/month</span>
                  </div>
                  <p className="text-sm text-purple-200 mb-6">
                    Billed annually at $1,393/year
                  </p>

                  {/* Credits Box */}
                  <div className="bg-gray-900/80 rounded-lg p-6 mb-6 text-center">
                    <div className="text-5xl font-bold mb-2">150</div>
                    <div className="text-sm text-gray-300 uppercase tracking-wide">
                      Credits per month
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">
                        Everything in Creator, plus:
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">1 Personal Custom Avatar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">Priority processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">Access to Studio Boost</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">Email support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold">
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Studio Boost */}
            <AnimatedSection>
              <Card className="bg-purple-900/40 backdrop-blur border-purple-500/30 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold mb-2">
                    Studio Members Only / Studio Boost
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-sm leading-relaxed">
                    Need more credits? Purchase our Studio Boost pack anytime to
                    supercharge your content production. Only available to
                    Studio plan members.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>600 credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>2 Additional Personal Avatars</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Never expires</span>
                    </li>
                  </ul>

                  {/* Boost Pricing Box */}
                  <div className="border-2 border-blue-600 rounded-lg p-6 mb-6">
                    <div className="text-5xl font-bold mb-4">$499</div>
                    <div className="text-3xl font-bold mb-4">600 Credits</div>
                    <p className="text-sm text-purple-200">
                      One-time purchase Requires Studio plan
                    </p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold">
                    Purchase Boost
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0F3A] mt-4 rounded-[20px] text-gray-400 py-12 px-6">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                <Image
                src="/logofooter.svg"
                alt="Logo"
                width={300}
                height={100}
              />
                </div>
                <p className="text-purple-300 text-sm mb-6">
                  Learn more about it all. AGI-powered video platform. Use GPT's
                  intelligence to transform your text into broadcast-quality
                  video in clicks. Try it free (no credit card required).
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">
                    Subscribe to Our Newsletter
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-purple-300"
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      →
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Legal Pages</h4>
                  <ul className="space-y-2 text-sm text-purple-300">
                    <li>
                      <a href="#" className="hover:text-white transition">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white transition">
                        Privacy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-purple-300">
              <p>© 2025 Intelligent Videos. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white transition">
                  YouTube
                </a>
                <a href="#" className="hover:text-white transition">
                  Instagram
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      <VideoPopup isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
}
