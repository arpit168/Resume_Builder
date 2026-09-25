"use client";

import Link from "next/link";
import { Sparkles, Rocket, Zap, User, FileText, CheckCircle2, Star, ShieldCheck, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-white dark:bg-[#080B14] font-sans overflow-hidden relative">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[500px] bg-blue-50/60 dark:bg-blue-900/20 blur-[120px] rounded-full pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-50/60 dark:bg-purple-900/20 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/4 translate-y-1/4" />

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-transparent text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 shadow-sm">
            <Zap className="w-4 h-4" />
            <span>100% Free & Create-Only</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Craft your <br className="hidden lg:block"/>
            <span className="text-blue-600 dark:text-blue-400">perfect resume</span> <br className="hidden lg:block"/>
            in minutes.
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mb-10 leading-relaxed font-medium">
            No sign-ups. No backend. No subscriptions. Build a beautiful, professional resume completely in your browser and export instantly to PDF.
          </p>
          
          <Link href="/dashboard" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_8px_20px_rgba(37,99,235,0.25)] dark:shadow-[0_8px_25px_rgba(59,130,246,0.3)] mb-12">
            <Rocket className="w-5 h-5" />
            Get Started Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <div className="flex items-start sm:items-center gap-6 sm:gap-8 flex-col sm:flex-row w-full justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Free Forever</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">No hidden charges</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">No Sign Up</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Start instantly</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Instant Download</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Get PDF in seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none flex justify-center mt-16 lg:mt-0 lg:ml-10">
          
          <div className="relative w-[340px] md:w-[400px] h-[520px]">
            
            {/* The Resume Document Container */}
            <div className="absolute inset-0 bg-white dark:bg-[#151B2B] rounded-[24px] shadow-2xl rotate-2 transform border border-gray-100 dark:border-gray-800 flex flex-col p-6 z-10">
              
              {/* Header inside resume */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">Arpit Gupta</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Frontend Developer</div>
                </div>
              </div>

              {/* Fake Content Sections */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">Experience</div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-2"></div>
                  <div className="h-2 w-[85%] bg-gray-100 dark:bg-gray-800 rounded-full mb-2"></div>
                  <div className="h-2 w-[60%] bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">Education</div>
                  <div className="h-2 w-[90%] bg-gray-100 dark:bg-gray-800 rounded-full mb-2"></div>
                  <div className="h-2 w-[70%] bg-gray-100 dark:bg-gray-800 rounded-full mb-2"></div>
                  <div className="h-2 w-[50%] bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">Skills</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-2 w-24 bg-blue-100 dark:bg-blue-900/40 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-2 w-16 bg-blue-100 dark:bg-blue-900/40 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-2 w-20 bg-blue-100 dark:bg-blue-900/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements / Badges */}
            
            {/* Top right - Professional Templates text with arrow (Simulated) */}
            <div className="absolute -top-8 right-0 z-20 flex flex-col items-center hidden sm:flex">
              <div className="text-blue-500 dark:text-blue-400 font-handwriting text-lg italic mr-10 mb-1 transform -rotate-6">Professional<br/>Templates</div>
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="text-blue-500 absolute top-8 right-2 transform rotate-12">
                <path d="M10 90 Q 50 10 90 20" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M80 10 L90 20 L80 30" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Middle left panel */}
            <div className="absolute top-32 -left-12 sm:-left-16 z-20 bg-white/80 dark:bg-[#1A2234]/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 flex flex-col gap-3 min-w-[150px]">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Modern<br/>Templates</div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-6 h-6 text-blue-500 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Easy to<br/>Edit</div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">100% Free</div>
              </div>
            </div>

            {/* Top Right Red PDF icon */}
            <div className="absolute top-20 -right-6 sm:-right-8 z-20 bg-white/90 dark:bg-[#1A2234]/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-200 dark:border-red-900/50">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-center mt-1 text-red-600 dark:text-red-400">PDF</div>
            </div>

            {/* Bottom Right Green Download button */}
            <div className="absolute bottom-16 -right-6 sm:-right-10 z-20 bg-white/90 dark:bg-[#1A2234]/90 backdrop-blur-md py-2 px-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] font-bold absolute bottom-1 right-1 bg-white text-[#10B981] rounded-sm px-0.5">PDF</span>
              </div>
              <div className="flex flex-col">
                <div className="text-[11px] font-bold text-gray-900 dark:text-white">Download</div>
                <div className="text-[11px] font-bold text-gray-900 dark:text-white">Resume <Download className="inline w-3 h-3 text-[#10B981] ml-1" /></div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
