"use client";

import type React from "react";
import styles from "./home.module.css";
import Image from "next/image";
import Link from "next/link"
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
  Check,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import { Header } from "@/components/shared/header";
import { AppFooter } from "@/components/shared/app-footer";
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
              
              <a href="#cases" className="hover:text-purple-400 transition">
                Learn Cases
              </a>

              <a href="#pricing" className="hover:text-purple-400 transition">
                Pricing
              </a>

              <Header />
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
                <Link href="/login">
                <Button className="rounded-[20px] bg-[#6D58BB] text-[16px] text-white hover:bg-[#6D58BB] py-[10px] px-[24px] h-auto">
                Start Creating Now →
                </Button>
                </Link>
              
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
      <section id="how-it-works" className="mt-20 py-20">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-[40%_55%] gap-12 items-start">
            {/* LEFT COLUMN */}
            <AnimatedSection className="max-w-xl">
              <h2 className="text-6xl font-medium mb-4">How it Works</h2>
              <p className="text-2xl mb-8">
                Three Simple Steps
                <br />
                to AGI-Level Videos
              </p>
              <Link href="/login">
              <Button className="rounded-[20px] bg-[#6D58BB] text-[16px] text-white hover:bg-[#6D58BB] py-[10px] px-[24px] h-auto">
                Start Creating Now →
              </Button>
              </Link>

              <p className="text-sm mt-3">
                2-minute setup → Professional results instantly
              </p>
            </AnimatedSection>

            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {/* Step 1 */}
              <AnimatedSection delay={200}>
                <Card className="border-0 shadow-none p-0 bg-transparent">
                  <CardContent className="p-0">
                    {/* Número y título */}
                    <div className="flex items-start gap-4">
                    <div className="w-[80px] flex-shrink-0 text-5xl md:text-7xl font-medium text-[#761D78] leading-none">
    1.
  </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-medium mb-3">
                        Add Your Inputs
                        </h3>

                        {/* Bloque a dos columnas: descripción izquierda / lista derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="mb-6 max-w-md">
                            Upload a PDF, paste a URL, enter keywords, or describe your topic. Our AGI platform needs minimal information to create extraordinary results.
                            </p>
                          </div>{" "}
                          {/* Espacio vacío para alinear igual que en el diseño */}
                          <div>
                            <h4 className="font-semibold mb-2">
                            Simple Inputs Include
                            </h4>
                            <ul className="text-sm space-y-1">
                              <li>• PDFs up to 20,000 words</li>
                              <li>• Website URLs with Primary Focus</li>
                              <li>• Keywords or topic descriptions</li>
                              <li>• Training materials or documents</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Step 2 */}
              <AnimatedSection delay={200}>
                <Card className="border-0 shadow-none p-0 bg-transparent">
                  <CardContent className="p-0">
                    {/* Número y título */}
                    <div className="flex items-start gap-4">
                      <div className="w-[80px] text-5xl md:text-7xl font-medium text-[#761D78] leading-none">
                        2.
                      </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-medium mb-3">
                          AGI Crafts Your Video Script
                        </h3>

                        {/* Bloque a dos columnas: descripción izquierda / lista derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="mb-6 max-w-md">
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
                            <ul className="text-sm space-y-1">
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
              <AnimatedSection delay={200}>
                <Card className="border-0 shadow-none p-0 bg-transparent">
                  <CardContent className="p-0">
                    {/* Número y título */}
                    <div className="flex items-start gap-4">
                      <div className="w-[80px] text-5xl md:text-7xl font-medium text-[#761D78] leading-none">
                        3.
                      </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-medium mb-3">
                        Receive Your Video Package
                        </h3>

                        {/* Bloque a dos columnas: descripción izquierda / lista derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="mb-6 max-w-md">
                            Get your professional video along with sticky video code for your website and embed code.
                            </p>
                          </div>{" "}
                          {/* Espacio vacío para alinear igual que en el diseño */}
                          <div>
                            <h4 className="font-semibold mb-2">
                            Plus Optional Additional Products
                            </h4>
                            <ul className="text-sm space-y-1">
                              <li>• Long-form Articles (1-10 pages)</li>
                              <li>• Video Landing Pages (+341% conversion)</li>
                              <li>• Omni-Channel Communication Suite (email, social, PPT)</li>
                              
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Videos in Action Section */}
      <section id="cases" className="py-20">
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {" "}
            {/* items-stretch es clave */}
            <AnimatedSection delay={100} className="h-full">
              {" "}
              {/* h-full aquí */}
              <Card className="border-0 shadow-none p-0 bg-transparent h-full flex flex-col">
                <h2 className="text-5xl font-medium">
                  See AGI-Powered Videos in Action
                </h2>
                <p className="text-xl mb-12 pr-6">
                  Real examples of how <strong>IntelligentVideos.ai</strong>{" "}
                  transforms corporate training with{" "}
                  <strong>
                    {'"'}More Human Than Human{'"'}
                  </strong>{" "}
                  content
                </p>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card className="border-0 shadow-none overflow-hidden cursor-pointer p-0 bg-white h-full flex flex-col">
                <img
                  src="/assets/home/grid-0.jpg"
                  alt="Video example"
                  className="w-full h-full rounded-[8px] object-cover"
                />
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col`}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="/assets/home/grid-1.jpg"
                    alt="Video example"
                    className={styles.zoomImage}
                  />
<Link href="/login">
                  <Button
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    className="cursor-pointer absolute bottom-4 right-4 z-10 !text-white border-none rounded-[20px] px-6 py-4 text-sm transition-all duration-300 hover:!bg-black/80 hover:!text-white"
                  >
                    Create a Video →
                  </Button>
                  </Link>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col gap-3 text-[#080936]">
                  <span className="text-[#2FAEF9] uppercase text-[14px] font-regular tracking-wider">
                    Employee Orientation
                  </span>

                  <h3 className="font-regular text-3xl leading-tight">
                    Welcome New Hires Like They're Already Part of the Family
                  </h3>

                  <p className="text-base leading-relaxed">
                    Create orientation videos that make employees feel valued
                    from day one
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      {/* Este span crea un bullet pequeño y personalizado */}
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      73% Better Retention
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      73% Better Retention
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col`}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="/assets/home/grid-2.jpg"
                    alt="Video example"
                    className={styles.zoomImage}
                  />
<Link href="/login">
                  <Button
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    className="cursor-pointer absolute bottom-4 right-4 z-10 !text-white border-none rounded-[20px] px-6 py-4 text-sm transition-all duration-300 hover:!bg-black/80 hover:!text-white"
                  >
                    Create a Video →
                  </Button>
                  </Link>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col gap-3 text-[#080936]">
                  <span className="text-[#2FAEF9] uppercase text-[14px] font-regular tracking-wider">
                    Internal Communications
                  </span>

                  <h3 className="font-regular text-3xl leading-tight">
                    Cut Through the Noise. Unite Your Organization.
                  </h3>

                  <p className="text-base leading-relaxed">
                    Messages that employees actually watch, understand, and act
                    on
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      {/* Este span crea un bullet pequeño y personalizado */}
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      94% Message Retention 
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      3x Faster Adoption
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col`}
              >
                <div className={styles.imageContainer}>
                  <img
                    src="/assets/home/grid-3.jpg"
                    alt="Video example"
                    className={styles.zoomImage}
                  />
<Link href="/login">
                  <Button
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    className="cursor-pointer absolute bottom-4 right-4 z-10 !text-white border-none rounded-[20px] px-6 py-4 text-sm transition-all duration-300 hover:!bg-black/80 hover:!text-white"
                  >
                    Create a Video →
                  </Button>
                  </Link>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col gap-3 text-[#080936]">
                  <span className="text-[#2FAEF9] uppercase text-[14px] font-regular tracking-wider">
                    Compliance & Safety
                  </span>

                  <h3 className="font-regular text-3xl leading-tight">
                    Make Mandatory Training Actually Matter
                  </h3>

                  <p className="text-base leading-relaxed">
                    Transform boring compliance into engaging videos employees
                    remember
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      {/* Este span crea un bullet pequeño y personalizado */}
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      97% Completion Rate 
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#080936] shrink-0" />
                      73% Fewer Incidents
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-4.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                    Sales Enablement
                  </h3>

                  <p className="text-base leading-relaxed">
                    Close more deals with AGI-powered product demos and pitch
                    videos
                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                    See Sales Video Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-5.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                  Marketing & Product
                  </h3>

                  <p className="text-base leading-relaxed">
                  Launch videos that get AI citations and drive conversions
                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                  See Marketing Video Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-6.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                  Learning & Development
                  </h3>

                  <p className="text-base leading-relaxed">
                  Build professional skills at scale with engaging training videos
                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                  See L&D Video Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-7.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                  Customer Service Training
                  </h3>

                  <p className="text-base leading-relaxed">
                  Reduce support tickets by 73% with better-trained teams

                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                  See Service Training Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-8.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                  Add Video to Web Pages                  </h3>

                  <p className="text-base leading-relaxed">
                  Increase time on page by 420% with sticky video technology
                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                  See Sticky Video Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection delay={200} className="h-full">
              <Card
                className={`${styles.customCard} border-0 gap-0 shadow-none overflow-hidden cursor-pointer p-2 bg-white h-full flex flex-col justify-between`}
              >
                {/* Bloque superior: Imagen */}
                <div className="p-4">
                  {" "}
                  {/* Agregado un div para control de padding superior si lo deseas */}
                  <img
                    src="/assets/home/grid-9.svg"
                    alt="Video example"
                    width={100}
                    className="block"
                  />
                </div>

                <CardContent className="p-6 flex flex-col gap-3 text-[#080936]">
                  <h3 className="font-regular text-3xl leading-tight">
                  Transform Documents to Videos
                  </h3>

                  <p className="text-base leading-relaxed">
                  Turn PDFs, PowerPoints, and docs into engaging video content
                  </p>

                  <p className="text-[14px] leading-relaxed text-[#335DEE]">
                  See Document Video Example →{" "}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
            <AnimatedSection
              delay={200}
              className="h-full flex flex-col justify-center gap-2"
            >
              <p className="text-base leading-relaxed">
                Ready to Transform Your Content?
              </p>
              <Link href="/login">
              <p className="text-[40px] leading-relaxed text-[#335DEE] cursor-pointer">
                Create a Video →
              </p>
              </Link>
            </AnimatedSection>
            {/* Repetir h-full en las demás secciones */}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`${styles.priceContainer} rounded-[20px] mt-20 py-20 px-6 text-white`}
      >
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-5xl font-medium mb-4">
              Simple. Transparent pricing
            </h2>
            <p className="text-lg">
              All plans include access to our AGI-powered platform and all
              features.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Creator Plan */}
            <AnimatedSection>
              <Card className="bg-purple-900/40 backdrop-blur border-[#8CE4FD] text-white relative">
                <CardHeader>
                <CardTitle className="text-3xl font-medium mb-2">
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
                    <span className="text-5xl font-medium">$50</span>
                    <span className="text-purple-200 text-lg">/month</span>
                  </div>
                  <p className="text-sm text-purple-200 mb-6">
                    Billed annually at $600/year
                  </p>

                  {/* Credits Box */}
                  <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                    <div className="text-3xl font-medium mb-2">60</div>
                    <div className="text-sm text-gray-300 uppercase tracking-wide">
                      Credits per month
                    </div>
                  </div>

                  <ul className="space-y-1 mb-8">
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        All platform features included
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        Professional avatars in 30+ languages
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        AGI-powered Video Script generation
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        Video Landing Pages & Long-form Articles
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        GEO Optimization for AI search
                      </span>
                    </li>
                  </ul>
                  <Button className="w-full bg-[#335DEE] hover:bg-blue-700 text-white py-6 text-base font-semibold">
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Studio Plan */}
            <AnimatedSection>
              <Card className="border-[#8CE4FD] text-white relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#335DEE] text-white px-6 py-2 rounded-sm text-sm font-medium">
                  Most Popular
                </div>
                <CardHeader className="pt-0">
                  <CardTitle className="text-3xl font-medium mb-2">
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
                    <span className="text-5xl font-medium">$116</span>
                    <span className="text-purple-200 text-lg">/month</span>
                  </div>
                  <p className="text-sm text-purple-200 mb-6">
                    Billed annually at $1,393/year
                  </p>

                  {/* Credits Box */}
                  <div className="bg-gray-900/80 rounded-lg p-4 mb-6 text-center">
                    <div className="text-3xl font-medium mb-2">150</div>
                    <div className="text-sm text-gray-300 uppercase tracking-wide">
                      Credits per month
                    </div>
                  </div>

                  <ul className="space-y-1 mb-8">
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">
                        Everything in Creator, plus:
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">1 Personal Custom Avatar</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">Priority processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">Access to Studio Boost</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-sm">Email support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-[#335DEE] hover:bg-blue-700 text-white py-6 text-base font-medium rounded-sm">
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Studio Boost */}
            <AnimatedSection>
              <Card className="bg-purple-900/40 backdrop-blur border-[#8CE4FD] text-white">
                <CardHeader>
                <CardTitle className="text-3xl font-medium mb-2">
                    Studio Members Only / Studio Boost
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-sm leading-relaxed">
                    Need more credits? Purchase our Studio Boost pack anytime to
                    supercharge your content production. Only available to
                    Studio plan members.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span>600 credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span>2 Additional Personal Avatars</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                      <span>Never expires</span>
                    </li>
                  </ul>

                  {/* Boost Pricing Box */}
                  <div className="border-2 border-[#335DEE] rounded-lg p-6 mt-9 mb-6">
                    <div className="text-5xl font-medium mb-4">$499</div>
                    <div className="text-3xl font-medium mb-4">600 Credits</div>
                    <p className="text-sm text-purple-200">
                      One-time purchase Requires Studio plan
                    </p>
                  </div>

                  <Button className="w-full bg-[#335DEE] hover:bg-blue-700 text-white py-6 text-base font-semibold">
                    Purchase Boost
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <AppFooter />

      <VideoPopup isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
}
