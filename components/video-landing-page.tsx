"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VideoPopup } from "@/components/video-popup"
import { Play, Percent, BookOpen, Heart, Monitor, FileText, ShoppingBag } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { UserMenu } from "@/components/auth/user-menu"

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`fade-in-up ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function VideoLandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="min-w-full">
      {/* Header */}
      <header className="bg-[#1a0b2e] text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded"></div>
            <span className="text-xl font-bold">IntelligentVideos</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-purple-400 transition">
              How it Works
            </a>
            <a href="#pricing" className="hover:text-purple-400 transition">
              Pricing
            </a>
            <a href="#cases" className="hover:text-purple-400 transition">
              Learn Cases
            </a>
            <UserMenu />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900 text-white py-20 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10 fade-in-up">
              <p className="text-purple-300 text-sm mb-4 uppercase tracking-wide">
                AI-Powered, Intelligence-Driven Video
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
                From Concept to Professional Video in Minutes
              </h1>
              <p className="text-lg text-purple-200 mb-8 text-pretty">
                Give GPT the future of AGI content creation! Broadcast-quality videos, 140+ Generative avatars, smart
                scripts, voices & DIY or done-for-you editing. No camera, crew or experience.
              </p>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Get Started for $1
              </Button>
            </div>

            {/* Hero Image with Video Trigger */}
            <div className="relative z-10 fade-in-up animate-delay-300">
              <div className="relative cursor-pointer group" onClick={() => setIsVideoOpen(true)}>
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src="/professional-woman-in-orange-sweater-presenting-on.jpg"
                    alt="Video preview"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <Play className="w-10 h-10 text-purple-600 ml-1" />
                    </div>
                  </div>
                </div>
                {/* Small preview videos in background */}
                <div className="absolute -bottom-6 -left-6 w-32 h-24 rounded-lg overflow-hidden shadow-lg opacity-80">
                  <img src="/business-person-on-video.jpg" alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-24 rounded-lg overflow-hidden shadow-lg opacity-80">
                  <img src="/team-meeting-video.jpg" alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto">
          <AnimatedSection className="max-w-3xl mb-12">
            <h2 className="text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-xl text-muted-foreground mb-6">Three Simple Steps to Create to AGI-Level Videos</p>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent">
              Watch Explainer Video
            </Button>
            <p className="text-sm text-muted-foreground mt-2">No credit card required</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatedSection delay={100}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-purple-600 mb-4">1.</div>
                  <h3 className="text-xl font-bold mb-3">Add Your Inputs</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload a PDF, paste a URL, enter your ideas, or choose from 300+ AGI-Add custom media (optional)
                    information to create extraordinary videos.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Simple Inputs Include</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Website URL or transcript inputs</li>
                      <li>• Upload your own Media</li>
                      <li>• Select preferred avatar</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-purple-600 mb-4">2.</div>
                  <h3 className="text-xl font-bold mb-3">AGI Crafts Your Video Script</h3>
                  <p className="text-muted-foreground mb-4">
                    Our advanced reasoning model crafts "turns human thinking" scripts, scenes, and narration tailored
                    to your AGI-use, on-brand, voicing, required from you.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Why We Generate</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full professional script</li>
                      <li>• Scene-by-scene storyboard</li>
                      <li>• AGI-optimized hooks</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-purple-600 mb-4">3.</div>
                  <h3 className="text-xl font-bold mb-3">Receive Your Video Package</h3>
                  <p className="text-muted-foreground mb-4">
                    Get your professional video along with supporting files: scripts, captions, and embed code.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Plus Customize Included Products</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Broadcast-quality MP4 video file</li>
                      <li>• Pre-formatted for top social sites</li>
                      <li>• Word-transcript to help use, SRT</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Videos in Action Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">See AGI-Powered Videos in Action</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Real companies are using IntelligentVideos to transformionaries training with DigiHuman Avatars – without
              the spend.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 className="font-bold text-lg mb-2">Welcome New Hires Like They're Already Part of the Family</h3>
                  <p className="text-sm text-muted-foreground">
                    Deliver personalized new-hire experiences that start them from day one.
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
                  <h3 className="font-bold text-lg mb-2">Make Mandatory Training Actually Matter</h3>
                  <p className="text-sm text-muted-foreground">
                    Transform boring compliance into engaging videos employees actually complete.
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
                  <h3 className="font-bold text-lg mb-2">Cut Through the Noise, Unlike Your Competition</h3>
                  <p className="text-sm text-muted-foreground">
                    Messages that employees actually watch, understand, and remember.
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
                    Equip sales teams with AI-generated objection demos and quick-turn assets.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See Sales Video Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="cases" className="py-20 px-6 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection delay={100}>
              <Card>
                <CardContent className="pt-6">
                  <Percent className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Marketing & Product</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Launch videos that get AI-scalable solutions compared to traditional videography.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See Marketing Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card>
                <CardContent className="pt-6">
                  <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Learning & Development</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Turn complicated, dull or manual training into engaging training videos.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See L&D Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <Card>
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Customer Service Training</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drive happier teams with high-quality service training from your existing best teams.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See Service Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <Card>
                <CardContent className="pt-6">
                  <Monitor className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Add Video to Web Pages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Increase time-on-page by 400% with video hosted technology.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See Web Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={500}>
              <Card>
                <CardContent className="pt-6">
                  <FileText className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Transform Documents to Videos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Turn PDFs, PowerPoints, or documents into engaging video content.
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-semibold hover:underline">
                    See Document Example →
                  </a>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <Card className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-2xl mb-4">Ready to Transform Your Content?</h3>
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">Create a Video →</Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900 text-white"
      >
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple. Transparent pricing</h2>
            <p className="text-purple-200">All plans include access to our AGI content platform and AI-features.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Creator Plan */}
            <AnimatedSection delay={100}>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Creator</h3>
                  <p className="text-sm text-purple-200 mb-6">
                    Perfect for individuals who need occasional video content
                  </p>
                  <div className="mb-6">
                    <div className="text-sm text-purple-200 line-through mb-1">$99</div>
                    <div className="text-4xl font-bold mb-1">$50</div>
                    <div className="text-sm text-purple-200">Billed annually at $600/year</div>
                  </div>
                  <div className="text-center py-4 bg-white/5 rounded mb-6">
                    <div className="text-3xl font-bold">60</div>
                    <div className="text-sm text-purple-200">CREDITS PER MONTH</div>
                  </div>
                  <ul className="space-y-3 text-sm mb-6">
                    <li>• AI-generated scripts</li>
                    <li>• 140+ realistic avatars</li>
                    <li>• Full access to video templates</li>
                    <li>• HD 1080p video downloads</li>
                    <li>• Basic analytics & branding</li>
                  </ul>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-transparent">
                    Start Free
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Starter Plan - Most Popular */}
            <AnimatedSection delay={200}>
              <Card className="bg-purple-600 border-purple-400 text-white relative transform scale-105 shadow-2xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <p className="text-sm text-purple-100 mb-6">
                    For teams and professionals who need regular video content
                  </p>
                  <div className="mb-6">
                    <div className="text-sm text-purple-200 line-through mb-1">$198</div>
                    <div className="text-4xl font-bold mb-1">$116</div>
                    <div className="text-sm text-purple-200">Billed annually at $1,399/year</div>
                  </div>
                  <div className="text-center py-4 bg-white/10 rounded mb-6">
                    <div className="text-3xl font-bold">150</div>
                    <div className="text-sm text-purple-200">CREDITS PER MONTH</div>
                  </div>
                  <ul className="space-y-3 text-sm mb-6">
                    <li>• Everything in Creator</li>
                    <li>• Priority video rendering</li>
                    <li>• Custom avatars (2 included)</li>
                    <li>• Advanced AI editing</li>
                    <li>• Team collaboration tools</li>
                    <li>• API access</li>
                  </ul>
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Studio Plan */}
            <AnimatedSection delay={300}>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Studio Members Only / Reseller-Ready</h3>
                  <p className="text-sm text-purple-200 mb-6">
                    For agencies and premium customers who want 100% hands-off solutions
                  </p>
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-1">$499</div>
                    <div className="text-sm text-purple-200">600 Credits</div>
                  </div>
                  <ul className="space-y-3 text-sm mb-6">
                    <li>• 2 Additional Activator Licenses</li>
                    <li>• Studio+ VIP Perks</li>
                    <li>• Premium support & training</li>
                    <li>• White-label options</li>
                    <li>• Dedicated account manager</li>
                    <li>• Custom integrations</li>
                  </ul>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-transparent">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0518] text-white py-12 px-6">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded"></div>
                  <span className="text-xl font-bold">IntelligentVideos</span>
                </div>
                <p className="text-purple-300 text-sm mb-6">
                  Learn more about it all. AGI-powered video platform. Use GPT's intelligence to transform your text
                  into broadcast-quality video in clicks. Try it free (no credit card required).
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Subscribe to Our Newsletter</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-purple-300"
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700">→</Button>
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
  )
}
