"use client";

import Link from "next/link";
import { Sparkles, Layout, Smartphone, ShieldCheck, Rocket, CheckCircle2, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 md:pt-32 md:pb-48 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-[#1A233A] text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 border border-blue-200 dark:border-blue-900/50">
            <Sparkles className="w-4 h-4" />
            <span>100% Free & Client-Side Only</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-2xl mb-6 leading-[1.1]">
            Craft your perfect <span className="text-blue-500">resume</span> in minutes.
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-10 leading-relaxed">
            No sign-ups. No backend. No subscriptions. Build a beautiful, professional resume completely in your browser and export instantly to PDF.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Rocket className="w-5 h-5" />
              Get Started Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-8 flex-wrap justify-center lg:justify-start">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> Free Forever
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> No Sign Up
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> Instant Download
            </div>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none flex justify-center mt-10 lg:mt-0">
          <div className="relative w-full aspect-[4/5] max-w-md">
            
            {/* The Resume Document */}
            <div className="absolute inset-0 bg-white dark:bg-[#F8FAFC] rounded-2xl shadow-2xl rotate-6 transform transition-transform hover:rotate-3 border border-gray-100 dark:border-gray-200 overflow-hidden flex flex-col p-6 lg:p-8">
              
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <div className="h-5 w-32 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-400 rounded"></div>
                </div>
              </div>

              {/* Fake Content Lines */}
              <div className="space-y-6">
                <div>
                  <div className="h-3 w-16 bg-blue-500 rounded mb-3"></div>
                  <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-5/6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-4/6 bg-gray-200 rounded"></div>
                </div>
                <div>
                  <div className="h-3 w-20 bg-blue-500 rounded mb-3"></div>
                  <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-11/12 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-4/5 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-5/6 bg-gray-200 rounded mb-2"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-blue-500 rounded mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-blue-100 rounded-full"></div>
                    <div className="h-6 w-16 bg-blue-100 rounded-full"></div>
                    <div className="h-6 w-20 bg-blue-100 rounded-full"></div>
                    <div className="h-6 w-16 bg-blue-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -left-8 lg:-left-12 top-1/4 bg-white dark:bg-[#161B2A] p-3 pr-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 animate-[bounce_4s_infinite]">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Modern</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Templates</div>
              </div>
            </div>

            <div className="absolute -left-4 lg:-left-8 bottom-1/3 bg-white dark:bg-[#161B2A] p-3 pr-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 animate-[bounce_5s_infinite_1s]">
              <div className="bg-[#10B981] p-2 rounded-lg text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Fast &</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Easy</div>
              </div>
            </div>

            <div className="absolute -right-4 lg:-right-8 top-12 bg-white dark:bg-[#161B2A] p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center animate-[bounce_6s_infinite_2s]">
              <FileText className="w-8 h-8 text-red-500 mb-1" />
              <div className="text-xs font-bold text-gray-900 dark:text-white">PDF</div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="group bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800/60 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white rounded-2xl flex items-center justify-center mb-6">
              <Layout className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Premium Templates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Choose from modern, professional, minimal, and executive templates designed to pass ATS systems and impress recruiters.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-500 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              Explore Templates
              <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#1A233A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group bg-white dark:bg-[#0D211C] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#10B981]/20 hover:border-[#10B981]/50 dark:hover:border-[#10B981]/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-[#10B981] text-emerald-600 dark:text-white rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">100% Private</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Your data never leaves your device. Everything is stored locally in your browser so your personal information stays with you.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-[#10B981] group-hover:text-emerald-700 dark:group-hover:text-[#34D399] transition-colors">
              Learn More
              <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#064E3B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>

          {/* Card 3 */}
          <div className="group bg-white dark:bg-[#1E112A] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#A855F7]/20 hover:border-[#A855F7]/50 dark:hover:border-[#A855F7]/50 transition-colors">
            <div className="w-14 h-14 bg-purple-100 dark:bg-[#A855F7] text-purple-600 dark:text-white rounded-2xl flex items-center justify-center mb-6">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Live Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              See your resume update in real-time as you type. Watch how it perfectly scales to A4 paper dimensions before you export.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-[#A855F7] group-hover:text-purple-700 dark:group-hover:text-[#C084FC] transition-colors">
              Try It Now
              <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-[#4C1D95] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
          
        </div>
      </section>
    </div>
  );
}
