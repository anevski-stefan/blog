import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
  ),
  title: "My Blog",
  description: "A modern blog built with Next.js and Supabase",
  alternates: {
    types: {
      "application/rss+xml": "/feed",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
