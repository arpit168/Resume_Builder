import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScreenWarningModal } from "@/components/layout/ScreenWarningModal";
import { ToastContainer } from "@/components/ui/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Hire-Craft | Professional Resume Builder",
    template: "%s | Hire-Craft",
  },
  description:
    "Create, customize, preview and download professional resumes directly in your browser. Build an ATS-friendly resume in minutes.",
  keywords: [
    "resume builder",
    "cv maker",
    "professional resume",
    "hire-craft",
    "ats friendly resume",
  ],
  openGraph: {
    title: "Hire-Craft | Professional Resume Builder",
    description:
      "Create, customize, preview and download professional resumes directly in your browser.",
    type: "website",
    siteName: "Hire-Craft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire-Craft | Professional Resume Builder",
    description:
      "Build an ATS-friendly resume in minutes completely in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { InitialLoaderWrapper } from "@/components/layout/InitialLoaderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head></head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('resume-builder-theme');
                if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <ThemeProvider>
          <InitialLoaderWrapper>
            <ScreenWarningModal />
            <Header />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
            <ToastContainer />
          </InitialLoaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
