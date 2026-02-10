import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import Sidebar from "@/features/sidebar/ui/Sidebar";
import { ThemeProvider } from '@/shared/styles/theme-provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS Resume Analyzer",
  description: "AI-powered recruitment insights and candidate analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto bg-background lg:ml-0">
              <div className="lg:hidden h-16" />
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}