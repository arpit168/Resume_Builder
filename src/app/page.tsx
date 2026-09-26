"use client";

import Link from "next/link";
import {
  Sparkles,
  Rocket,
  Zap,
  User,
  FileText,
  CheckCircle2,
  Download,
  LayoutTemplate,
  Edit,
  Settings,
} from "lucide-react";
import { Particles } from "@/components/layout/Particles";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-white dark:bg-[#080B14] font-sans overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[500px] bg-blue-50/60 dark:bg-blue-900/20 blur-[120px] rounded-full pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-50/60 dark:bg-purple-900/20 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/4 translate-y-1/4" />

      {/* Particles Effect */}
      <Particles />

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-transparent text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 shadow-sm">
            <Zap className="w-4 h-4" />
            <span>100% Free & Create-Only</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Craft your <br className="hidden lg:block" />
            <span className="text-blue-600 dark:text-blue-400">
              perfect resume
            </span>{" "}
            <br className="hidden lg:block" />
            in minutes.
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mb-10 leading-relaxed font-medium">
            No sign-ups. No backend. No subscriptions. Build a beautiful,
            professional resume completely in your browser and export instantly
            to PDF.
          </p>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_8px_20px_rgba(37,99,235,0.25)] dark:shadow-[0_8px_25px_rgba(59,130,246,0.3)] mb-12"
          >
            <Rocket className="w-5 h-5" />
            Get Started Now
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div className="flex items-start sm:items-center gap-6 sm:gap-8 flex-col sm:flex-row w-full justify-center lg:justify-start">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#10B981]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Free Forever
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  No hidden charges
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#8B5CF6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  No Sign Up
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Start instantly
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Instant Download
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Get PDF in seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="flex-1 relative z-10 w-full max-w-2xl lg:max-w-none flex justify-center mt-16 lg:mt-0 lg:ml-6 xl:ml-12">
          <div className="relative w-full max-w-[600px] xl:max-w-[700px] aspect-[16/11] sm:aspect-[16/10]">
            {/* The App UI Container */}
            <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-[#121826] rounded-2xl shadow-2xl rotate-2 transform border border-gray-200 dark:border-gray-800 flex overflow-hidden z-10">
              {/* 1. Left Sidebar */}
              <div className="w-[20%] border-r border-gray-200 dark:border-gray-800/60 p-3 sm:p-4 flex flex-col gap-6 bg-white dark:bg-[#0B0F19]">
                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                  <span className="hidden sm:block">HireCraft</span>
                </div>

                {/* Nav items */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-blue-500 text-white p-2 rounded-lg text-xs font-medium shadow-sm shadow-blue-500/20">
                    <LayoutTemplate className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:block">Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-lg text-xs font-medium transition-colors">
                    <Edit className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:block">Editor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-lg text-xs font-medium transition-colors">
                    <Settings className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:block">Settings</span>
                  </div>
                </div>
              </div>

              {/* 2. Middle Column */}
              <div className="w-[35%] sm:w-[40%] p-4 sm:p-5 flex flex-col gap-6 bg-[#F8FAFC] dark:bg-[#121826]">
                {/* Search Bar Mock */}
                <div className="w-full h-7 bg-white dark:bg-[#1A2234] rounded-md border border-gray-200 dark:border-gray-700/50 flex items-center px-2 shadow-sm">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  <div className="w-1 h-3 bg-gray-300 dark:bg-gray-600 -ml-0.5 mt-2 transform -rotate-45" />
                  <div className="ml-2 w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>

                {/* Choose a Template */}
                <div>
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white mb-3">
                    Choose a Template
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/3 aspect-[1/1.4] bg-white dark:bg-blue-900/10 border-2 border-blue-500 rounded flex flex-col p-1 shadow-sm">
                      <div className="w-full h-1/4 bg-blue-100 dark:bg-blue-900/40 rounded-sm mb-1"></div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-0.5"></div>
                      <div className="w-3/4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    </div>
                    <div className="w-1/3 aspect-[1/1.4] bg-white dark:bg-[#1A2234] border border-gray-200 dark:border-gray-700/50 rounded flex flex-col p-1 shadow-sm">
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-sm mb-1"></div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-0.5"></div>
                      <div className="w-3/4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    </div>
                    <div className="w-1/3 aspect-[1/1.4] bg-white dark:bg-[#1A2234] border border-gray-200 dark:border-gray-700/50 rounded flex flex-col p-1 shadow-sm">
                      <div className="flex gap-1 mb-1">
                        <div className="w-1/3 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                        <div className="w-2/3 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                      </div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-0.5"></div>
                      <div className="w-3/4 h-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Your Resume */}
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white mb-3">
                    Your Resume
                  </div>
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        Personal Info
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1"></div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          Experience
                        </div>
                        <div className="h-1 w-[90%] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-1 w-[70%] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          Education
                        </div>
                        <div className="h-1 w-[80%] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-1 w-[50%] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1"></div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          Skills
                        </div>
                        <div className="h-1 w-[85%] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Right Column - Preview */}
              <div className="flex-1 bg-gray-100/50 dark:bg-black/20 p-4 sm:p-5 flex items-center justify-center border-l border-gray-200 dark:border-gray-800/60 relative">
                {/* Top header with icons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200/50 dark:bg-gray-800/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <div className="w-full h-full max-h-[90%] bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.2)] p-4 sm:p-5 overflow-hidden flex flex-col border border-gray-100">
                  {/* Arpit Gupta header */}
                  <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 bg-blue-600 flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5">
                        Arpit Gupta
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                        Frontend Developer
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px] font-bold">
                          ×
                        </div>{" "}
                        Experience
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1"></div>
                        <div className="w-full">
                          <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="h-1.5 w-[85%] bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="h-1.5 w-[60%] bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px] font-bold">
                          ×
                        </div>{" "}
                        Skills
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1"></div>
                        <div className="w-full">
                          <div className="h-1.5 w-[90%] bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="h-1.5 w-[70%] bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px] font-bold">
                          ×
                        </div>{" "}
                        Education
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1"></div>
                        <div className="w-full">
                          <div className="h-1.5 w-[80%] bg-gray-200 rounded-full mb-1.5"></div>
                          <div className="h-1.5 w-[50%] bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements / Badges */}

            {/* Top right - Professional Templates text with arrow (Simulated) */}
            <div className="absolute -top-8 right-0 z-20 flex flex-col items-center hidden sm:flex">
              <div className="text-blue-500 dark:text-blue-400 font-handwriting text-lg italic mr-10 mb-1 transform -rotate-6">
                Professional
                <br />
                Templates
              </div>
              <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                className="text-blue-500 absolute top-8 right-2 transform rotate-12"
              >
                <path
                  d="M10 90 Q 50 10 90 20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M80 10 L90 20 L80 30"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Middle left panel */}
            <div className="absolute top-32 -left-12 sm:-left-16 z-20 bg-white/80 dark:bg-[#1A2234]/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 flex flex-col gap-3 min-w-[150px]">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                  Modern
                  <br />
                  Templates
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-6 h-6 text-blue-500 flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Easy to
                  <br />
                  Edit
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">
                  100% Free
                </div>
              </div>
            </div>

            {/* Top Right Red PDF icon */}
            <div className="absolute top-20 -right-6 sm:-right-8 z-20 bg-white/90 dark:bg-[#1A2234]/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-200 dark:border-red-900/50">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-center mt-1 text-red-600 dark:text-red-400">
                PDF
              </div>
            </div>

            {/* Bottom Right Green Download button */}
            <div className="absolute bottom-16 -right-6 sm:-right-10 z-20 bg-white/90 dark:bg-[#1A2234]/90 backdrop-blur-md py-2 px-3 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] font-bold absolute bottom-1 right-1 bg-white text-[#10B981] rounded-sm px-0.5">
                  PDF
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-[11px] font-bold text-gray-900 dark:text-white">
                  Download
                </div>
                <div className="text-[11px] font-bold text-gray-900 dark:text-white">
                  Resume{" "}
                  <Download className="inline w-3 h-3 text-[#10B981] ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
