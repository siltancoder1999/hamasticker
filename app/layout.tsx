import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_Arabic, Vazirmatn } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const notoKurdish = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kurdish",
  display: "swap",
})

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
})

export const metadata: Metadata = {
  title: "هەما ستیکەر | Hama Sticker",
  description: "باشترین شوێن بۆ داواکردنی ستیکەری تایبەت بە کوالیتی بەرز - هەما ستیکەر",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      suppressHydrationWarning
      className={`${notoKurdish.variable} ${vazir.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
