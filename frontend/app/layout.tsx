import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export const metadata: Metadata = {
  title: "RPMVault - Motorcycle Catalog",
  description: "Comprehensive motorcycle database with detailed technical specifications",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <LanguageProvider>
          <Suspense fallback={null}>{children}</Suspense>
          {/* Desktop floating controls */}
          <div className="hidden md:block fixed bottom-4 left-4 z-50">
            <LanguageSelector />
          </div>

          {/* Mobile bottom bar */}
          <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="container mx-auto px-4 py-3 flex items-center justify-center">
              <LanguageSelector />
            </div>
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
